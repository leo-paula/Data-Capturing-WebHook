import { NextRequest, NextResponse } from "next/server";

interface requesting{
    id: string | number,
    mail: string,
    name: string,
    phone: string,
}

interface WebhookResult {
  done?: boolean;
  message?: string;
  response?: string;
}

export async function POST(request: NextRequest) {
  const data:requesting = await request.json();
  if (!data.id || !data.mail || !data.name || !data.phone) {
    return NextResponse.json(
      {
        message: "Impossível remover, registros faltantes",
        database: {
          ok: false,
          message: "Dados incompletos para salvar no banco.",
        },
        webhook: {
          ok: false,
          done: false,
          message: "Dados incompletos para enviar ao WebHook.",
        },
      },
      { status: 400 },
    );
  } else {
    const databasePromise = fetch(`http://localhost:3001/records/${data.id}`, {
      method: "DELETE",
    });
    const webhookPromise = fetch(
      "https://script.google.com/macros/s/AKfycbyA5GMkx2SP5r7J5mxh8eeUCWD_b9g7f4Yv67l6zHpeUFDjOyCyAlWh7z2IYNLB65WVvA/exec",
      {
        method: "POST",
        body: JSON.stringify({
          operation: "Deleting",
          info: {
            ...data
          }
        }),
      },
    );

    const [databaseResult, webhookResult] = await Promise.allSettled([
      databasePromise,
      webhookPromise,
    ]);

    const databaseResponse =
      databaseResult.status === "fulfilled" ? databaseResult.value : null;
    const webhookResponse =
      webhookResult.status === "fulfilled" ? webhookResult.value : null;

    let databaseBody: unknown = null;
    if (databaseResponse?.ok) {
      try {
        databaseBody = await databaseResponse.json();
      } catch (error) {
        databaseBody = null;
      }
    }

    let webhookBody: WebhookResult | null = null;
    if (webhookResponse?.ok) {
      try {
        webhookBody = (await webhookResponse.json()) as WebhookResult;
      } catch (error) {
        webhookBody = null;
      }
    }

    const webhookDone = webhookBody?.done === true;
    const webhookMessage =
      webhookBody?.message ??
      webhookBody?.response ??
      (webhookResponse?.ok
        ? "WebHook respondeu, mas sem mensagem."
        : "Falha ao remover no WebHook.");

    const databaseMessage = databaseResponse?.ok
      ? "Registro removido no banco de dados."
      : "Falha ao remover no banco de dados.";

    return NextResponse.json(
      {
        message: webhookDone
          ? "Registros removidos com sucesso!"
          : "Registro removido, mas WebHook falhou.",
        database: {
          ok: databaseResponse?.ok ?? false,
          status: databaseResponse?.status ?? 0,
          message: databaseMessage,
          body: databaseBody,
        },
        webhook: {
          ok: webhookResponse?.ok ?? false,
          status: webhookResponse?.status ?? 0,
          done: webhookDone,
          message: webhookMessage,
          body: webhookBody,
        },
      },
      { status: 200 },
    );
  }
}
