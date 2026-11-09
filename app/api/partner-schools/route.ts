const APPS_SCRIPT_URL = process.env.GOOGLE_APPS_SCRIPT_URL;
const APPS_SCRIPT_TOKEN = process.env.GOOGLE_APPS_SCRIPT_TOKEN;

const REQUIRED_FIELDS = [
  "school_name",
  "school_type",
  "contact_name",
  "role",
  "email",
  "city",
  "region",
  "message",
  "consent",
] as const;

export async function POST(request: Request) {
  try {
    if (!APPS_SCRIPT_URL || !APPS_SCRIPT_TOKEN) {
      return Response.json(
        { error: "El formulario de contacto no está configurado todavía." },
        { status: 503 },
      );
    }

    const formData = await request.formData();

    if (formData.get("website")) {
      return Response.json({ ok: true });
    }

    const missingField = REQUIRED_FIELDS.find((field) => !String(formData.get(field) || "").trim());
    if (missingField) {
      return Response.json({ error: "Completa todos los campos obligatorios." }, { status: 400 });
    }

    if (formData.getAll("interests").length === 0) {
      return Response.json({ error: "Selecciona al menos un interés para la alianza." }, { status: 400 });
    }

    const email = String(formData.get("email"));
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ error: "Ingresa un correo electrónico válido." }, { status: 400 });
    }

    const outgoing = new URLSearchParams();
    for (const [key, value] of formData.entries()) {
      if (key !== "website") outgoing.append(key, String(value));
    }
    outgoing.set("form_type", "partner_school");
    outgoing.set("token", APPS_SCRIPT_TOKEN);

    const scriptResponse = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
      body: outgoing.toString(),
      cache: "no-store",
    });

    if (!scriptResponse.ok) {
      return Response.json({ error: "No fue posible registrar la solicitud." }, { status: 502 });
    }

    const result = await scriptResponse.json();
    if (!result.ok) {
      return Response.json({ error: result.error || "No fue posible registrar la solicitud." }, { status: 502 });
    }

    return Response.json({ ok: true, responseId: result.responseId });
  } catch {
    return Response.json({ error: "No fue posible procesar la solicitud." }, { status: 500 });
  }
}
