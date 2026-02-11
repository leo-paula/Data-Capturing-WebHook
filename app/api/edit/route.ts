import { NextRequest, NextResponse } from "next/server";

interface requesting{
    data: {
        id: string | number,
        mail: string,
        name: string,
        phone: string,

    },
    new_values: {
        mail: string,
        name: string,
        phone: string,
    }
}

interface WebhookResult {
  done?: boolean;
  message?: string;
  response?: string;
}

export async function POST(request: NextRequest) {
  const requested:requesting = await request.json();
  if (!requested.data.id || !requested.data.mail || !requested.data.name || !requested.data.phone ||
      !requested.new_values.mail || !requested.new_values.name || !requested.new_values.phone) {
    return NextResponse.json(
      {
        message: "Impossível editar, registros faltantes",
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
    var existingRecordId: string | number | null = null
    for (const el of existing) {
      if(el.phone == requested.new_values.phone && el.id != requested.data.id){
        already_exists = true
        existingRecordId = el.id
        break
      }
    }
    if (already_exists){
      const webhookPromise = fetch(
      "https://script.google.com/macros/s/AKfycbyA5GMkx2SP5r7J5mxh8eeUCWD_b9g7f4Yv67l6zHpeUFDjOyCyAlWh7z2IYNLB65WVvA/exec",
      {
        method: "POST",
        body: JSON.stringify({
          operation: "Editing",
          info: {
            ...requested.data
          },
          new_values: {
            ...requested.new_values
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

      console.log('a' + webhookBody)
      return NextResponse.json(
        {
          message: "Não é possível editar: número de telefone já existe em outro registro.",
          database: {
            ok: false,
            message: "Dados duplicados (telefone).",
            existing: existing.find((el: any) => el.id === existingRecordId),
          },
          webhook: {
            ok: webhookResult?.ok ?? false,
            status: webhookResult?.status ?? 0,
            done: webhookBody?.done ?? false,
            message: webhookBody?.message ?? "Notificação de duplicação enviada.",
            body: webhookBody,
          },
        },
        { status: 409 },
      );
    }
    const databasePromise = fetch(`http://localhost:3001/records/${requested.data.id}`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        id: requested.data.id,
        ...requested.new_values
      }),
    });
    const webhookPromise = fetch(
      "https://script.google.com/macros/s/AKfycbyA5GMkx2SP5r7J5mxh8eeUCWD_b9g7f4Yv67l6zHpeUFDjOyCyAlWh7z2IYNLB65WVvA/exec",
      {
        method: "POST",
        body: JSON.stringify({
          operation: "Editing",
          info: {
            ...requested.data
          },
          new_values: {
            ...requested.new_values
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
          ? "Registros editados com sucesso!"
          : "Registro editado, mas WebHook falhou.",
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
