const FORM_NAME = "Postulación The Builders Camp 2026";

const FIELDS = [
  { key: "name", title: "Nombre completo", type: "text", required: true },
  { key: "age", title: "Edad", type: "text", required: true },
  { key: "school", title: "Colegio", type: "text", required: true },
  { key: "course", title: "Curso", type: "list", required: true, choices: ["1ro Medio", "2do Medio", "3ro Medio", "4to Medio"] },
  { key: "region", title: "Región", type: "list", required: true, choices: ["Arica y Parinacota", "Tarapacá", "Antofagasta", "Atacama", "Coquimbo", "Valparaíso", "Metropolitana", "O'Higgins", "Maule", "Ñuble", "Biobío", "La Araucanía", "Los Ríos", "Los Lagos", "Aysén", "Magallanes"] },
  { key: "comuna", title: "Comuna", type: "text", required: true },
  { key: "email", title: "Correo", type: "text", required: true },
  { key: "phone", title: "Teléfono", type: "text", required: true },
  { key: "gender", title: "Género", type: "list", required: false, choices: ["Femenino", "Masculino", "No binario", "Otro", "Prefiero no decirlo"] },
  { key: "tiempo_libre", title: "¿Qué te gusta hacer en tu tiempo libre?", type: "paragraph", required: true },
  { key: "has_liderado", title: "¿Has participado en actividades extracurriculares, concursos, clubes o proyectos fuera del colegio?", type: "multiple", required: true, choices: ["Sí", "No"] },
  { key: "actividades_desc", title: "Si respondiste que sí, cuéntanos brevemente qué hiciste", type: "paragraph", required: false },
  { key: "areas", title: "¿Cuál de estas áreas te interesa más explorar durante el bootcamp?", type: "checkbox", required: true, choices: ["Inteligencia artificial", "Emprendimiento e innovación", "Diseño de soluciones sociales", "Liderazgo y habilidades blandas", "Programación o desarrollo", "Comunicación y presentación de ideas", "No estoy seguro/a aún"] },
  { key: "future_interest", title: "¿Hay algún área, tema o profesión que hoy te interese explorar en el futuro?", type: "paragraph", required: true },
  { key: "curiosity_topic", title: "¿Qué tema podría tenerte horas investigando, conversando o aprendiendo sin que nadie te lo pidiera? ¿Por qué?", type: "paragraph", required: true },
  { key: "family_support", title: "¿Tu familia o adulto responsable sabe que estás postulando a The Builders Camp?", type: "multiple", required: true, choices: ["Sí, y apoya mi participación.", "Sí, pero todavía tenemos que conversar algunos detalles.", "Aún no les he contado sobre mi postulación.", "Prefiero conversarlo con ellos si avanzo en el proceso."] },
  { key: "attendance", title: "¿Podrías participar presencialmente durante los cinco días, del 14 al 18 de diciembre?", type: "multiple", required: true, choices: ["Sí, podría participar durante los cinco días sin inconvenientes.", "Sí, pero necesitaría apoyo para transporte y/o alojamiento.", "Probablemente sí, aunque todavía debo confirmar algunos detalles.", "No estoy seguro/a por el momento."] },
  { key: "payment_capacity", title: "¿Cuál de estas opciones describe mejor tu situación respecto al costo de participación de $60.000?", type: "multiple", required: true, choices: ["Podría cubrir el costo total de $60.000.", "Podría cubrir una parte del costo.", "Necesitaría una beca para poder participar."] },
  { key: "community_problem", title: "Si pudieras resolver un problema de tu colegio, comunidad o entorno, ¿cuál elegirías y por qué?", type: "paragraph", required: true },
  { key: "traits", title: "¿Con cuál de estas palabras te identificas más?", type: "checkbox", required: true, choices: ["Curioso/a", "Creativo/a", "Analítico/a", "Líder", "Comunicador/a", "Inquieto/a", "Emprendedor/a", "Tecnológico/a", "Optimista", "Empático/a", "Soñador/a", "Otro"] },
  { key: "trait_other", title: "Otra palabra con la que te identificas", type: "text", required: false },
  { key: "team_role", title: "En un equipo, ¿qué rol tiendes a tomar?", type: "paragraph", required: true },
  { key: "admired_person", title: "¿Qué persona admiras y por qué?", type: "paragraph", required: true },
  { key: "ref_1", title: "¿Por qué quieres ser parte de The Builders Camp?", type: "paragraph", required: true },
  { key: "ref_2", title: "¿Qué opinas sobre el rol de la inteligencia artificial en la sociedad?", type: "paragraph", required: true },
  { key: "consent", title: "Consentimiento para el tratamiento de datos", type: "checkbox", required: true, choices: ["Acepto"] }
];

function setupForm() {
  const properties = PropertiesService.getScriptProperties();
  const existingId = properties.getProperty("FORM_ID");
  if (existingId) {
    const existingForm = FormApp.openById(existingId);
    console.log(JSON.stringify(getSetupInfo_(existingForm)));
    return;
  }

  const form = FormApp.create(FORM_NAME)
    .setDescription("Formulario oficial de postulación a The Builders Camp by HiveYoung.")
    .setConfirmationMessage("¡Gracias! Recibimos tu postulación correctamente.")
    .setProgressBar(true)
    .setCollectEmail(false);

  form.addSectionHeaderItem().setTitle("1. Datos personales");
  for (let index = 0; index <= 8; index++) addField_(form, FIELDS[index]);

  form.addPageBreakItem().setTitle("2. Intereses, experiencia y disponibilidad");
  for (let index = 9; index <= 17; index++) addField_(form, FIELDS[index]);

  form.addPageBreakItem().setTitle("3. Tu lado Builder");
  for (let index = 18; index <= 22; index++) addField_(form, FIELDS[index]);

  form.addPageBreakItem().setTitle("4. Reflexión");
  for (let index = 23; index <= 25; index++) addField_(form, FIELDS[index]);

  const spreadsheet = SpreadsheetApp.create("Respuestas - " + FORM_NAME);
  form.setDestination(FormApp.DestinationType.SPREADSHEET, spreadsheet.getId());

  properties.setProperty("FORM_ID", form.getId());
  properties.setProperty("INTEGRATION_TOKEN", Utilities.getUuid());
  properties.setProperty("SPREADSHEET_ID", spreadsheet.getId());

  console.log(JSON.stringify(getSetupInfo_(form)));
}

function addField_(form, field) {
  let item;
  if (field.type === "text") item = form.addTextItem();
  if (field.type === "paragraph") item = form.addParagraphTextItem();
  if (field.type === "list") item = form.addListItem().setChoiceValues(field.choices);
  if (field.type === "multiple") item = form.addMultipleChoiceItem().setChoiceValues(field.choices);
  if (field.type === "checkbox") item = form.addCheckboxItem().setChoiceValues(field.choices);
  item.setTitle(field.title).setRequired(field.required);
}

function doGet() {
  const properties = PropertiesService.getScriptProperties();
  return json_({
    ok: true,
    service: "The Builders Camp applications",
    configured: Boolean(properties.getProperty("FORM_ID"))
  });
}

function doPost(e) {
  try {
    const properties = PropertiesService.getScriptProperties();
    const data = parseRequest_(e);

    if (!properties.getProperty("FORM_ID")) throw new Error("El formulario aún no está configurado.");
    if (!data.token || data.token !== properties.getProperty("INTEGRATION_TOKEN")) {
      return json_({ ok: false, error: "No autorizado." });
    }

    const form = FormApp.openById(properties.getProperty("FORM_ID"));
    const itemsByTitle = {};
    form.getItems().forEach(item => itemsByTitle[item.getTitle()] = item);
    const response = form.createResponse();

    FIELDS.forEach(field => {
      const value = data[field.key];
      if (value === undefined || value === null || value === "" || (Array.isArray(value) && value.length === 0)) return;
      const item = itemsByTitle[field.title];
      if (!item) throw new Error("No se encontró la pregunta: " + field.title);

      if (field.type === "text") response.withItemResponse(item.asTextItem().createResponse(String(value)));
      if (field.type === "paragraph") response.withItemResponse(item.asParagraphTextItem().createResponse(String(value)));
      if (field.type === "list") response.withItemResponse(item.asListItem().createResponse(String(value)));
      if (field.type === "multiple") response.withItemResponse(item.asMultipleChoiceItem().createResponse(String(value)));
      if (field.type === "checkbox") {
        const values = Array.isArray(value) ? value : [value];
        response.withItemResponse(item.asCheckboxItem().createResponse(values));
      }
    });

    const submitted = response.submit();
    return json_({ ok: true, responseId: submitted.getId() });
  } catch (error) {
    console.error(error);
    return json_({ ok: false, error: error.message || String(error) });
  }
}

function parseRequest_(e) {
  if (e.postData && e.postData.type && e.postData.type.indexOf("application/json") === 0) {
    return JSON.parse(e.postData.contents || "{}");
  }
  const data = {};
  Object.keys(e.parameters || {}).forEach(key => {
    const values = e.parameters[key];
    data[key] = values.length > 1 ? values : values[0];
  });
  return data;
}

function getSetupInfo_(form) {
  const properties = PropertiesService.getScriptProperties();
  return {
    formId: form.getId(),
    editUrl: form.getEditUrl(),
    publishedUrl: form.getPublishedUrl(),
    spreadsheetUrl: properties.getProperty("SPREADSHEET_ID") ? "https://docs.google.com/spreadsheets/d/" + properties.getProperty("SPREADSHEET_ID") + "/edit" : null,
    token: properties.getProperty("INTEGRATION_TOKEN")
  };
}

function json_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}
