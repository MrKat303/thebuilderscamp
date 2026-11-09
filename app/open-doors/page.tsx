"use client";

import Link from "next/link";
import Image from "next/image";
import { FormEvent, useState } from "react";
import Navbar from "../components/Navbar";
import styles from "./page.module.css";

const network = [
  ["🏢", "Empresas", "Comparten sus espacios, equipos y desafíos reales."],
  ["🔬", "Colegios", "Abren talleres, laboratorios y proyectos educativos."],
  ["🎓", "Universidades", "Acercan carreras, investigación y vida universitaria."],
  ["🌱", "Organizaciones", "Conectan a jóvenes con causas y soluciones concretas."],
];

const steps = [
  ["01", "Una institución propone", "Comparte un espacio, conocimiento o desafío que pueda transformarse en una experiencia."],
  ["02", "Diseñamos juntos", "The Builders define el formato, los objetivos y las condiciones de participación."],
  ["03", "Los jóvenes participan", "Exploran, preguntan, prueban y conectan con personas y entornos reales."],
  ["04", "Evaluamos y mejoramos", "Recogemos aprendizajes para fortalecer las próximas experiencias."],
];

export default function OpenDoorsPage() {
  const [state, setState] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    setMessage("");
    try {
      const response = await fetch("/api/open-doors", { method: "POST", body: new FormData(event.currentTarget) });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || "No fue posible enviar la solicitud.");
      setState("success");
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "No fue posible enviar la solicitud.");
    }
  }

  return (
    <main className={styles.page}>
      <Navbar />

      <section className={styles.hero}>
        <div className={`${styles.container} ${styles.heroGrid}`}>
          <div className={styles.heroContent}>
            <Image
              className={styles.heroLogo}
              src="/open-doors-logo.png"
              alt="Open Doors"
              width={1536}
              height={1024}
              priority
            />
            <p className={styles.heroLead}>
              Abrimos puertas. Creamos oportunidades. Conectamos a jóvenes con instituciones dispuestas a compartir sus espacios, conocimientos y experiencias.
            </p>
            <div className={styles.heroActions}>
              <Link className={styles.primaryButton} href="#participa">Abrir nuestras puertas <span aria-hidden="true">→</span></Link>
              <Link className={styles.ghostButton} href="#programa">Conocer el programa</Link>
            </div>
          </div>
        </div>
      </section>

      <div className={styles.storyBackdrop}>
      <section className={styles.belief} id="programa">
        <div className={`${styles.container} ${styles.beliefGrid}`}>
          <div>
            <span className={styles.eyebrow}>Qué es Open Doors</span>
            <h2 className={styles.title}>Experiencias reales que amplían horizontes.</h2>
          </div>
          <div>
            <p className={styles.beliefStatement}><strong>Open Doors conecta a jóvenes con instituciones</strong> dispuestas a abrir sus espacios, conocimientos y redes.</p>
            <p className={styles.beliefCopy}>
              Convertimos visitas, talleres, encuentros y desafíos en oportunidades para descubrir caminos, conocer referentes y aprender haciendo.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.network}>
        <div className={styles.container}>
          <div className={styles.networkHeader}>
            <div><span className={styles.eyebrow}>Quiénes participan</span><h2 className={styles.title}>Instituciones que abren puertas.</h2></div>
            <p className={styles.networkIntro}>Empresas, colegios, universidades y organizaciones pueden convertir lo que ya hacen en una experiencia de aprendizaje.</p>
          </div>
          <div className={styles.networkGrid}>
            {network.map(([icon, title, text]) => (
              <article className={styles.networkCard} key={title}>
                <span className={styles.networkIcon} aria-hidden="true">{icon}</span>
                <div><h3>{title}</h3><p>{text}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.process} id="como-funciona">
        <div className={styles.container}>
          <span className={styles.eyebrow}>Cómo funciona</span>
          <h2 className={styles.title}>De una idea a una experiencia real.</h2>
          <div className={styles.steps}>
            {steps.map(([number, title, text]) => <article className={styles.step} key={number}><span className={styles.stepNumber}>{number}</span><h3>{title}</h3><p>{text}</p></article>)}
          </div>
        </div>
      </section>

      <section className={styles.contact} id="participa">
        <div className={`${styles.container} ${styles.contactGrid}`} id="contacto">
          <div>
            <span className={styles.eyebrow}>Abramos una puerta</span>
            <h2 className={styles.title}>Conversemos.</h2>
            <p className={styles.contactCopy}>Cuéntanos qué espacio, conocimiento o comunidad podrías conectar. No necesitas tener la experiencia diseñada: la construiremos juntos.</p>
          </div>
          {state === "success" ? (
            <div className={`${styles.form} ${styles.success}`} role="status"><div><div className={styles.successIcon}>✓</div><h2>La puerta está abierta.</h2><p>Recibimos tu propuesta. Nuestro equipo revisará la información para conversar sobre el siguiente paso.</p></div></div>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.formGrid}>
                <div className={styles.field}><label htmlFor="organization_name">Institución *</label><input id="organization_name" name="organization_name" required autoComplete="organization" /></div>
                <div className={styles.field}><label htmlFor="organization_type">Tipo de institución *</label><select id="organization_type" name="organization_type" required defaultValue=""><option value="" disabled>Selecciona una opción</option><option>Empresa</option><option>Colegio</option><option>Universidad</option><option>Organización / fundación</option><option>Institución pública</option><option>Otra</option></select></div>
                <div className={styles.field}><label htmlFor="contact_name">Nombre y apellido *</label><input id="contact_name" name="contact_name" required autoComplete="name" /></div>
                <div className={styles.field}><label htmlFor="role">Cargo o rol *</label><input id="role" name="role" required /></div>
                <div className={styles.field}><label htmlFor="email">Correo *</label><input id="email" name="email" type="email" required autoComplete="email" /></div>
                <div className={styles.field}><label htmlFor="phone">Teléfono</label><input id="phone" name="phone" type="tel" autoComplete="tel" /></div>
                <div className={`${styles.field} ${styles.full}`}><label htmlFor="participation_type">¿Cómo les gustaría participar? *</label><select id="participation_type" name="participation_type" required defaultValue=""><option value="" disabled>Selecciona una opción</option><option>Abrir un espacio o instalaciones</option><option>Ofrecer un taller o experiencia</option><option>Compartir profesionales o referentes</option><option>Acercar jóvenes a las experiencias</option><option>Explorar una alianza</option></select></div>
                <div className={`${styles.field} ${styles.full}`}><label htmlFor="message">¿Qué puerta podrían abrir? *</label><textarea id="message" name="message" required placeholder="Cuéntanos sobre el espacio, conocimiento, experiencia o comunidad que les gustaría conectar…" /></div>
                <div className={styles.honeypot} aria-hidden="true"><label htmlFor="website">Sitio web</label><input id="website" name="website" tabIndex={-1} autoComplete="off" /></div>
                <label className={`${styles.consent} ${styles.full}`}><input type="checkbox" name="consent" value="yes" required /><span>Acepto que The Builders utilice estos datos para responder esta solicitud y coordinar una posible colaboración en Open Doors. *</span></label>
              </div>
              <div className={styles.formFooter}><button className={styles.submitButton} type="submit" disabled={state === "sending"}>{state === "sending" ? "Enviando…" : "Enviar propuesta"}</button><p className={`${styles.status} ${state === "error" ? styles.error : ""}`} aria-live="polite">{message}</p></div>
            </form>
          )}
        </div>
      </section>

      <footer className={styles.footer}><div className={`${styles.container} ${styles.footerInner}`}><span>© {new Date().getFullYear()} Open Doors · Un programa de The Builders</span><Link href="/">Volver al inicio</Link></div></footer>
      </div>
    </main>
  );
}
