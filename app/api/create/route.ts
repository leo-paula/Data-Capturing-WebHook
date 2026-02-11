import { NextRequest, NextResponse } from "next/server";

interface requesting{
    mail: string,
    name: string,
    phone: string,
    [key: string]: string,
}

interface WebhookResult {
  done?: boolean;
  message?: string;
  response?: string;
}

export async function POST(request: NextRequest) {
  const data:requesting = await request.json();
  if (!data.mail || !data.name || !data.phone) {
    return NextResponse.json(
      {
        message: "Impossível inserir, registros faltantes",
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
    
    const existing = await (await fetch('http://localhost:3001/records')).json()
    if (!existing){
      return NextResponse.json({
        message: 'Erro, banco de dados retornou valores vazios!'
      })
    }
    var already_exists = false
    for (const el of existing) {
      const {phone, ...db} = el
      if(phone == data.phone){
        already_exists = true
      }
    }
    if (already_exists){
      const webhookPromise = fetch(
        "https://script.google.com/macros/s/AKfycbw6codchVaDY6j21Dk5yQdZdKGwMt17SJTEmjdublzNG5R_qL-26b361dcl2UC85xE3eg/exec",
        {
          method: "POST",
          body: JSON.stringify({
            operation: "Creating",
            info: {
              ...data
            }
          }),
        },
      );

      const webhookResult = await webhookPromise;
      let webhookBody: WebhookResult | null = null;
      if (webhookResult?.ok) {
        try {
          webhookBody = (await webhookResult.json()) as WebhookResult;
        } catch (error) {
          webhookBody = null;
        }
      }

      return NextResponse.json(
        {
          message: "Registro já existe no banco de dados.",
          database: {
            ok: false,
            message: "Dados duplicados a.",
          },
          webhook: {
            ok: webhookResult?.ok ?? false,
            status: webhookResult?.status ?? 0,
            done: webhookBody?.done ?? false,
            message: webhookBody?.message ?? webhookBody,
            body: webhookBody,
          },
        },
        { status: 409 },
      );
    }
    const databasePromise = fetch("http://localhost:3001/records", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const webhookPromise = fetch(
      "https://script.google.com/macros/s/AKfycbyA5GMkx2SP5r7J5mxh8eeUCWD_b9g7f4Yv67l6zHpeUFDjOyCyAlWh7z2IYNLB65WVvA/exec",
      {
        method: "POST",
        body: JSON.stringify({
          operation: "Creating",
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
        : "Falha ao chamar o WebHook.");

    const databaseMessage = databaseResponse?.ok
      ? "Registro salvo no banco de dados."
      : "Falha ao salvar no banco de dados.";

    return NextResponse.json(
      {
        message: webhookDone
          ? "Registros inseridos com sucesso!"
          : "Registro salvo, mas WebHook falhou.",
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
