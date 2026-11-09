"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import Navbar from "../components/Navbar";
import styles from "./page.module.css";

const benefits = [
  {
    title: "Oportunidades para tus estudiantes",
    text: "Recibe información y materiales para que estudiantes con distintos perfiles puedan conocer y postular a The Builders Camp.",
  },
  {
    title: "Acompañamiento claro",
    text: "Cuenta con un punto de contacto y orientación para comunicar la convocatoria, resolver dudas y preparar a tu comunidad educativa.",
  },
  {
    title: "Conexión con habilidades del futuro",
    text: "Acerca a tu colegio una experiencia enfocada en liderazgo, emprendimiento, tecnología, comunicación y trabajo colaborativo.",
  },
  {
    title: "Comunidad de colegios",
    text: "Forma parte de una red que comparte el propósito de ampliar las oportunidades y el protagonismo de jóvenes de enseñanza media.",
  },
];

const steps = [
  ["01", "Cuéntanos sobre tu colegio", "Completa el formulario con los datos de tu institución y de la persona que será nuestro contacto."],
  ["02", "Conversemos", "Nuestro equipo revisará la información y coordinará una conversación para entender el contexto y los intereses de tu comunidad."],
  ["03", "Definamos la colaboración", "Acordaremos acciones simples y realistas: difusión, identificación de estudiantes y acompañamiento durante la convocatoria."],
  ["04", "Activemos la alianza", "Tu colegio recibirá materiales, fechas clave y apoyo para conectar a sus estudiantes con la experiencia."],
];

const faqs = [
  ["¿Tiene costo convertirse en Partner School?", "No existe un costo por manifestar interés ni por conversar con el equipo. Cualquier condición específica de colaboración se comunica y acuerda antes de activar la alianza."],
  ["¿Qué colegios pueden participar?", "Invitamos a establecimientos que trabajen con estudiantes de enseñanza media y compartan el interés por acercar oportunidades de formación y desarrollo."],
  ["¿Debemos asegurar un número mínimo de postulantes?", "No. Buscamos difusión comprometida y acompañamiento, pero cada estudiante decide libremente si quiere postular."],
  ["¿Ser Partner School garantiza cupos?", "No. Las postulaciones se revisan según el proceso de selección de The Builders Camp. La alianza facilita el acceso a información y acompañamiento, no una admisión automática."],
];

export default function PartnerSchoolsPage() {
  const [state, setState] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    if (formData.getAll("interests").length === 0) {
      setState("error");
      setMessage("Selecciona al menos un interés para la alianza.");
      return;
    }
    setState("sending");
    setMessage("");

    try {
      const response = await fetch("/api/partner-schools", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || "No fue posible enviar el formulario.");
      setState("success");
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "No fue posible enviar el formulario.");
    }
  }

  return (
    <main className={styles.page}>
      <Navbar />

      <section className={styles.hero}>
        <div className={`${styles.container} ${styles.heroGrid}`}>
          <div>
            <span className={styles.eyebrow}>Partner Schools · The Builders Camp</span>
            <h1>Tu colegio puede abrir la próxima puerta.</h1>
            <p className={styles.heroLead}>
              Conecta a tus estudiantes con una experiencia práctica para desarrollar liderazgo,
              creatividad, tecnología y la confianza para construir su futuro.
            </p>
            <div className={styles.heroActions}>
              <Link href="#contacto" className={styles.primaryButton}>
                Quiero ser Partner School <span aria-hidden="true">→</span>
              </Link>
              <Link href="#como-funciona" className={styles.secondaryButton}>
                Conocer el proceso
              </Link>
            </div>
          </div>
          <aside className={styles.heroAside}>
            <p>Una alianza simple. Un impacto que puede durar años.</p>
            <p>
              Ustedes conocen el potencial de sus estudiantes. Nosotros acercamos una experiencia
              donde pueden ponerlo en acción.
            </p>
          </aside>
        </div>
      </section>

      <section className={styles.intro}>
        <div className={`${styles.container} ${styles.introGrid}`}>
          <div>
            <span className={styles.sectionEyebrow}>Qué significa ser partner</span>
            <h2 className={styles.sectionTitle}>Una colaboración para que el talento encuentre oportunidades.</h2>
          </div>
          <div>
            <p className={styles.introCopy}>
              Una <strong>Partner School</strong> es un colegio que ayuda a que más estudiantes
              conozcan The Builders Camp, se atrevan a postular y cuenten con orientación durante el
              proceso. La alianza se adapta al contexto del establecimiento y se construye junto a
              su equipo.
            </p>
            <div className={styles.principles}>
              <div className={styles.principle}><span>01</span><p>Acceso claro a información y fechas.</p></div>
              <div className={styles.principle}><span>02</span><p>Acompañamiento para el equipo escolar.</p></div>
              <div className={styles.principle}><span>03</span><p>Postulación individual y selección transparente.</p></div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.benefits} id="beneficios">
        <div className={styles.container}>
          <span className={styles.sectionEyebrow}>Beneficios</span>
          <h2 className={styles.sectionTitle}>Más que difundir una convocatoria.</h2>
          <div className={styles.benefitGrid}>
            {benefits.map((benefit, index) => (
              <article className={styles.benefitCard} key={benefit.title}>
                <span className={styles.benefitNumber}>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{benefit.title}</h3>
                  <p>{benefit.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.process} id="como-funciona">
        <div className={styles.container}>
          <div className={styles.processHeader}>
            <div>
              <span className={styles.sectionEyebrow}>Cómo ser Partner School</span>
              <h2 className={styles.sectionTitle}>De la primera conversación a la acción.</h2>
            </div>
            <p className={styles.processIntro}>
              Diseñamos un proceso liviano para que la alianza sume valor sin agregar complejidad
              innecesaria a tu equipo.
            </p>
          </div>
          <div className={styles.steps}>
            {steps.map(([number, title, text]) => (
              <article className={styles.step} key={number}>
                <span className={styles.stepNumber}>{number}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.commitment}>
        <div className={`${styles.container} ${styles.commitmentGrid}`}>
          <div>
            <span className={styles.sectionEyebrow}>Lo que necesitamos de tu colegio</span>
            <h2 className={styles.sectionTitle}>Un referente, comunicación y ganas de abrir oportunidades.</h2>
          </div>
          <div className={styles.commitmentPanel}>
            <ul className={styles.checkList}>
              <li><span className={styles.check}>✓</span><span>Designar una persona de contacto para coordinar la alianza.</span></li>
              <li><span className={styles.check}>✓</span><span>Compartir la convocatoria y los materiales con estudiantes y familias.</span></li>
              <li><span className={styles.check}>✓</span><span>Ayudar a identificar estudiantes que podrían beneficiarse de la experiencia.</span></li>
              <li><span className={styles.check}>✓</span><span>Facilitar la comunicación de fechas, requisitos y pasos de postulación.</span></li>
              <li><span className={styles.check}>✓</span><span>Entregar retroalimentación para mejorar futuras colaboraciones.</span></li>
            </ul>
          </div>
        </div>
      </section>

      <section className={styles.faq}>
        <div className={styles.container}>
          <span className={styles.sectionEyebrow}>Preguntas frecuentes</span>
          <h2 className={styles.sectionTitle}>Antes de conversar.</h2>
          <div className={styles.faqGrid}>
            {faqs.map(([question, answer]) => (
              <article className={styles.faqItem} key={question}>
                <h3>{question}</h3>
                <p>{answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.contact} id="contacto">
        <div className={`${styles.container} ${styles.contactGrid}`}>
          <div>
            <span className={styles.sectionEyebrow}>Hablemos</span>
            <h2 className={styles.sectionTitle}>Convirtamos a tu colegio en un puente.</h2>
            <p className={styles.contactCopy}>
              Completa el formulario y cuéntanos qué necesita tu comunidad. Revisaremos la
              información para dar el siguiente paso contigo.
            </p>
            <p className={styles.contactNote}>
              Manifestar interés no genera obligaciones. La colaboración comienza cuando ambas
              partes acuerdan cómo trabajar juntas.
            </p>
          </div>

          {state === "success" ? (
            <div className={`${styles.form} ${styles.success}`} role="status">
              <div>
                <div className={styles.successIcon} aria-hidden="true">✓</div>
                <h2>¡Gracias por escribirnos!</h2>
                <p>Recibimos los datos de tu colegio. Nuestro equipo revisará la información para ponerse en contacto.</p>
              </div>
            </div>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.formGrid}>
                <div className={styles.field}>
                  <label htmlFor="school_name">Nombre del colegio *</label>
                  <input id="school_name" name="school_name" required autoComplete="organization" />
                </div>
                <div className={styles.field}>
                  <label htmlFor="school_type">Tipo de establecimiento *</label>
                  <select id="school_type" name="school_type" required defaultValue="">
                    <option value="" disabled>Selecciona una opción</option>
                    <option>Municipal / SLEP</option>
                    <option>Particular subvencionado</option>
                    <option>Particular pagado</option>
                    <option>Otro</option>
                  </select>
                </div>
                <div className={styles.field}>
                  <label htmlFor="contact_name">Nombre y apellido *</label>
                  <input id="contact_name" name="contact_name" required autoComplete="name" />
                </div>
                <div className={styles.field}>
                  <label htmlFor="role">Cargo o rol *</label>
                  <input id="role" name="role" required placeholder="Ej. Orientadora, director, docente" />
                </div>
                <div className={styles.field}>
                  <label htmlFor="email">Correo institucional *</label>
                  <input id="email" name="email" type="email" required autoComplete="email" />
                </div>
                <div className={styles.field}>
                  <label htmlFor="phone">Teléfono</label>
                  <input id="phone" name="phone" type="tel" autoComplete="tel" />
                </div>
                <div className={styles.field}>
                  <label htmlFor="city">Comuna / ciudad *</label>
                  <input id="city" name="city" required autoComplete="address-level2" />
                </div>
                <div className={styles.field}>
                  <label htmlFor="region">Región *</label>
                  <input id="region" name="region" required autoComplete="address-level1" />
                </div>
                <div className={`${styles.field} ${styles.full}`}>
                  <label className={styles.choiceLabel}>¿Qué les interesa explorar? *</label>
                  <div className={styles.choices}>
                    {["Difusión de la convocatoria", "Charlas informativas", "Becas y acceso", "Alianza de largo plazo"].map((interest) => (
                      <label className={styles.choice} key={interest}>
                        <input type="checkbox" name="interests" value={interest} />
                        <span>{interest}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className={`${styles.field} ${styles.full}`}>
                  <label htmlFor="message">Cuéntanos sobre tu colegio y qué esperan de la alianza *</label>
                  <textarea id="message" name="message" required />
                </div>
                <div className={styles.honeypot} aria-hidden="true">
                  <label htmlFor="website">Sitio web</label>
                  <input id="website" name="website" tabIndex={-1} autoComplete="off" />
                </div>
                <label className={`${styles.consent} ${styles.full}`}>
                  <input type="checkbox" name="consent" value="yes" required />
                  <span>Acepto que HiveYoung utilice estos datos para responder esta solicitud y coordinar una posible alianza con The Builders Camp. *</span>
                </label>
              </div>
              <div className={styles.formFooter}>
                <button className={styles.submitButton} type="submit" disabled={state === "sending"}>
                  {state === "sending" ? "Enviando…" : "Enviar solicitud"}
                </button>
                <p className={`${styles.status} ${state === "error" ? styles.error : ""}`} aria-live="polite">
                  {message}
                </p>
              </div>
            </form>
          )}
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={`${styles.container} ${styles.footerInner}`}>
          <span>© {new Date().getFullYear()} The Builders Camp by HiveYoung</span>
          <Link href="/">Volver al inicio</Link>
        </div>
      </footer>
    </main>
  );
}
