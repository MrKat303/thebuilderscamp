const APPS_SCRIPT_URL = process.env.GOOGLE_APPS_SCRIPT_URL;
const APPS_SCRIPT_TOKEN = process.env.GOOGLE_APPS_SCRIPT_TOKEN;

export async function POST(request: Request) {
  try {
    if (!APPS_SCRIPT_URL || !APPS_SCRIPT_TOKEN) {
      return Response.json({ error: "La integración de postulaciones no está configurada." }, { status: 503 });
    }

    const incoming = new URLSearchParams(await request.text());

    if (!incoming.get("name") || !incoming.get("email")) {
      return Response.json({ error: "Faltan datos obligatorios." }, { status: 400 });
    }

    incoming.set("token", APPS_SCRIPT_TOKEN);

    const scriptResponse = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: incoming.toString(),
      cache: "no-store",
    });

    if (!scriptResponse.ok) {
      return Response.json({ error: "Google Apps Script rechazó el envío." }, { status: 502 });
    }

    const responseText = await scriptResponse.text();
    let result: { ok?: boolean; error?: string; responseId?: string };

    try {
      result = JSON.parse(responseText) as { ok?: boolean; error?: string; responseId?: string };
    } catch {
      console.error("Google Apps Script devolvió una respuesta inválida.", {
        status: scriptResponse.status,
        responsePreview: responseText.slice(0, 200),
      });
      return Response.json({ error: "El servicio de postulaciones devolvió una respuesta inválida." }, { status: 502 });
    }

    if (!result.ok) {
      return Response.json({ error: result.error || "No fue posible guardar la postulación." }, { status: 502 });
    }

    return Response.json({ ok: true, responseId: result.responseId });
  } catch (error) {
    console.error("Error al procesar la postulación.", error);
    return Response.json({ error: "No fue posible comunicarse con el servicio de postulaciones." }, { status: 502 });
  }
}
