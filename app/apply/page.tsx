"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const mobileStyles = `
  @media (max-width: 600px) {
    .apply-grid-2 {
      grid-template-columns: 1fr !important;
    }
    .apply-main {
      padding: 100px 1rem 60px !important;
    }
    .apply-card {
      padding: 1.5rem 1.2rem !important;
      border-radius: 18px !important;
    }
    .apply-title {
      font-size: 2rem !important;
    }
    .apply-h2 {
      font-size: 1.2rem !important;
    }
    .apply-option-label {
      padding: 0.7rem 0.8rem !important;
      font-size: 0.9rem !important;
    }
    .apply-nav-btn {
      padding: 0.58rem 1rem !important;
      font-size: 0.84rem !important;
      min-width: 0 !important;
    }
  }
`;

const c = {
  orange: "#8B5CF6",
  orangeDark: "#7C3AED",
  cream: "#F9F4E1",
  dark: "#1A1208",
  muted: "#7A5C4F",
  white: "#ffffff",
  forest: "#43a574",
};

export default function ApplyPage() {
  const container = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [hasLiderado, setHasLiderado] = useState<string>("");
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [familySupport, setFamilySupport] = useState("");
  const [attendance, setAttendance] = useState("");
  const [paymentCapacity, setPaymentCapacity] = useState("");
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const cardRef = useRef<HTMLDivElement>(null);
  
  const totalSteps = 4;

  const toggleArea = (area: string) => {
    setSelectedAreas(prev => 
      prev.includes(area) ? prev.filter(a => a !== area) : prev.length < 2 ? [...prev, area] : prev
    );
  };

  const toggleTrait = (trait: string) => {
    setSelectedTraits((current) =>
      current.includes(trait)
        ? current.filter((item) => item !== trait)
        : current.length < 3
          ? [...current, trait]
          : current
    );
  };

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormValues(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  useGSAP(() => {
    gsap.from(".form-card", {
      y: 40,
      opacity: 0,
      duration: 1.2,
      ease: "power4.out",
    });
    gsap.from(".form-header > *", {
      y: 20,
      opacity: 0,
      duration: 1,
      stagger: 0.1,
      ease: "power3.out",
    });
  }, { scope: container });

  const nextStep = () => {
    if (step >= totalSteps) return;

    if (step === 2 && (!hasLiderado || selectedAreas.length === 0 || !familySupport || !paymentCapacity || !attendance)) {
      alert("Por favor, completa todas las preguntas obligatorias antes de continuar.");
      return;
    }

    if (step === 3 && selectedTraits.length === 0) {
      alert("Por favor, completa todas las preguntas obligatorias antes de continuar.");
      return;
    }
    
    gsap.to(".step-content", {
      x: -20,
      opacity: 0,
      duration: 0.4,
      onComplete: () => {
        setStep(step + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
        gsap.fromTo(".step-content", { x: 20, opacity: 0 }, { x: 0, opacity: 1, duration: 0.4 });
      }
    });
  };

  const prevStep = () => {
    if (step <= 1) return;
    gsap.to(".step-content", {
      x: 20,
      opacity: 0,
      duration: 0.4,
      onComplete: () => {
        setStep(step - 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
        gsap.fromTo(".step-content", { x: -20, opacity: 0 }, { x: 0, opacity: 1, duration: 0.4 });
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < totalSteps) {
      nextStep();
      return;
    }

    const courseLabels: Record<string, string> = { "1": "1ro Medio", "2": "2do Medio", "3": "3ro Medio", "4": "4to Medio" };

    const payload = new URLSearchParams({
      "entry.781459710": formValues.name || "",
      "entry.1187180142": formValues.age || "",
      "entry.1705219438": formValues.school || "",
      "entry.1455852837": courseLabels[formValues.course] || "",
      "entry.1436178938": formValues.region || "",
      "entry.1625050353": formValues.comuna || "",
      "entry.159407556": formValues.email || "",
      "entry.779351655": formValues.phone || "",
      "entry.1869493394": formValues.gender || "",
      "entry.634755484": formValues.tiempo_libre || "",
      "entry.935512835": formValues.future_interest || "",
      "entry.1679683040": formValues.curiosity_topic || "",
      "entry.920754456": hasLiderado,
      "entry.1920943622": hasLiderado === "Sí" ? formValues.actividades_desc?.trim() || "" : "",
      "entry.1862178203": familySupport,
      "entry.182877332": attendance,
      "entry.1838260082": paymentCapacity,
      "entry.804024667": formValues.community_problem || "",
      "entry.1963440088": selectedTraits.includes("Otro") ? formValues.trait_other || "" : "",
      "entry.169260751": formValues.team_role || "",
      "entry.161688947": formValues.admired_person || "",
      "entry.1085691853": formValues.ref_1 || "",
      "entry.321074777": formValues.ref_2 || "",
      "entry.413881830": "Acepto que mis datos sean enviados y utilizados exclusivamente para analizar mi postulación a la convocatoria de The Builders Camp. Mis datos no serán compartidos con terceros ni descargados por ningún motivo."
    });

    selectedAreas.forEach(value => payload.append("entry.2096164779", value));
    selectedTraits.forEach(value => payload.append("entry.1447882457", value));
    setIsSubmitting(true);
    setSubmitError("");
    try {
      const response = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: payload.toString(),
      });
      if (!response.ok) throw new Error("Google Forms rechazó el envío");
      setSubmitted(true);
    } catch {
      setSubmitError("No pudimos enviar tu postulación. Revisa tu conexión e inténtalo nuevamente.");
      setIsSubmitting(false);
      return;
    }
    gsap.to(".form-card", {
      scale: 0.98,
      opacity: 0,
      duration: 0.4,
      onComplete: () => {
        gsap.to(".form-card", { scale: 1, opacity: 1, duration: 0.5 });
      }
    });
  };

  const inputStyle = {
    width: "100%",
    padding: "0.95rem 1.25rem",
    borderRadius: "14px",
    border: "1px solid rgba(255, 255, 255, 0.15)",
    fontSize: "0.95rem",
    outline: "none",
    transition: "all 0.3s ease",
    background: "rgba(0,0,0,0.25)",
    color: c.white
  };

  const selectStyle = {
    width: "100%",
    padding: "0.95rem 2.8rem 0.95rem 1.25rem",
    borderRadius: "14px",
    border: "1px solid rgba(255, 255, 255, 0.15)",
    fontSize: "0.95rem",
    outline: "none",
    transition: "all 0.3s ease",
    background: "rgba(0,0,0,0.25)",
    color: c.white,
    appearance: "none" as const,
    WebkitAppearance: "none" as const,
    MozAppearance: "none" as const,
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.6)' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 1rem center",
    cursor: "pointer",
  };

  const labelStyle = {
    display: "block",
    fontWeight: 700,
    marginBottom: "0.5rem",
    fontSize: "0.75rem",
    color: "rgba(255,255,255,0.8)",
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em"
  };

  const handleFocus = (e: any) => {
    e.target.style.borderColor = c.orange;
    e.target.style.background = "rgba(0,0,0,0.4)";
    e.target.style.boxShadow = "0 0 0 3px rgba(139, 92, 246, 0.2)";
  };

  const handleBlur = (e: any) => {
    e.target.style.borderColor = "rgba(255,255,255,0.15)";
    e.target.style.background = "rgba(0,0,0,0.25)";
    e.target.style.boxShadow = "none";
  };

  const stepTitles = [
    "1. Datos personales",
    "2. Intereses, experiencia y disponibilidad",
    "3. Tu lado Builder",
    "4. Reflexión"
  ];

  return (
    <div ref={container} style={{ backgroundColor: "transparent", minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      <style>{mobileStyles}</style>
      <Navbar solid={true} />
      
      <div 
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: "linear-gradient(rgba(26, 18, 8, 0.4), rgba(26, 18, 8, 0.65)), url('/beach.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: -2,
        }}
      />
      <div style={{ position: "absolute", top: "15%", left: "-10%", width: "500px", height: "500px", borderRadius: "50%", background: "rgba(139,92,246,0.15)", filter: "blur(100px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "10%", right: "-10%", width: "400px", height: "400px", borderRadius: "50%", background: "rgba(123,44,191,0.1)", filter: "blur(80px)", pointerEvents: "none" }} />

      <main className="apply-main" style={{ padding: "120px 1.5rem 80px", maxWidth: "800px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div className="form-header" style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <h1 className="apply-title" style={{ fontSize: "2.8rem", color: c.white, marginBottom: "0.75rem", lineHeight: 1.1, fontWeight: 400 }}>Únete ahora</h1>
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "1.1rem", fontWeight: 500, marginBottom: "0.5rem" }}>Buscamos a los futuros builders, líderes y founders de Chile.</p>
        </div>

        <div className="apply-card form-card" style={{ 
          background: "rgba(26, 18, 40, 0.35)", 
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          borderRadius: "24px", 
          padding: "2.2rem", 
          boxShadow: "0 24px 60px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
        }}>
          {!submitted ? (
            <form onSubmit={handleSubmit}>
              {step > 0 && (
                <>
                  {/* Progress Bar */}
                  <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
                    {[...Array(totalSteps)].map((_, i) => (
                      <div key={i} style={{ flex: 1, height: "4px", background: step > i ? c.orange : "rgba(255,255,255,0.1)", borderRadius: "2px", transition: "0.3s" }} />
                    ))}
                  </div>
                  
                  <h2 className="apply-h2" style={{ color: c.white, fontSize: "1.4rem", fontWeight: 600, marginBottom: "2rem", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "1rem" }}>
                    {stepTitles[step - 1]}
                  </h2>
                </>
              )}

              <div className="step-content">
                
                {/* STEP 0: INTRO */}
                {step === 0 && (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "1rem 0 2rem" }}>
                    <div style={{ width: "70px", height: "70px", borderRadius: "50%", background: "rgba(139, 92, 246, 0.15)", border: "1px solid rgba(139, 92, 246, 0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem", color: c.orange }}>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                    </div>
                    <h2 style={{ fontSize: "2rem", color: c.white, marginBottom: "1.5rem", fontWeight: 600 }}>Antes de comenzar</h2>
                    
                    <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem", color: "rgba(255,255,255,0.85)", fontSize: "1.05rem", lineHeight: 1.6, maxWidth: "550px", margin: "0 auto" }}>
                      <p>Este cuestionario es parte del proceso de selección del bootcamp <strong>The Builders Camp</strong>.</p>
                      <p>No hay respuestas correctas ni incorrectas. Queremos conocerte tal como eres: tu forma de pensar, tus intereses y cómo enfrentas los desafíos.</p>
                      <p>Los postulantes seleccionados serán contactados directamente por WhatsApp con los próximos pasos.</p>
                    </div>
                    
                    <button type="button" onClick={nextStep} style={{ 
                      marginTop: "2.5rem", width: "100%", maxWidth: "300px", background: c.orange, color: "white", padding: "1.1rem", 
                      borderRadius: "14px", border: "none", fontWeight: 800, fontSize: "1.1rem", cursor: "pointer",
                      boxShadow: "0 4px 15px rgba(139, 92, 246, 0.4)", transition: "all 0.2s"
                    }} onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"} onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
                      Empezar
                    </button>
                  </div>
                )}
                
                {/* STEP 1: DATOS PERSONALES */}
                {step === 1 && (
                  <div style={{ display: "grid", gap: "1.5rem" }}>
                    <div className="apply-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                      <div>
                        <label htmlFor="name" style={labelStyle}>Nombre Completo *</label>
                        <input type="text" id="name" required value={formValues.name || ""} onChange={handleFieldChange} placeholder="Tu nombre" style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
                      </div>
                      <div>
                        <label htmlFor="age" style={labelStyle}>Edad *</label>
                        <input type="number" id="age" required value={formValues.age || ""} onChange={handleFieldChange} placeholder="Ej: 16" style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
                      </div>
                    </div>
                    
                    <div className="apply-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                      <div>
                        <label htmlFor="school" style={labelStyle}>Colegio *</label>
                        <input type="text" id="school" required value={formValues.school || ""} onChange={handleFieldChange} placeholder="Tu colegio" style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
                      </div>
                      <div>
                        <label htmlFor="course" style={labelStyle}>Curso *</label>
                        <select id="course" required value={formValues.course || ""} onChange={handleFieldChange} style={selectStyle} onFocus={handleFocus} onBlur={handleBlur}>
                          <option value="" style={{ color: "black" }}>Selecciona</option>
                          <option value="1" style={{ color: "black" }}>1ro Medio</option>
                          <option value="2" style={{ color: "black" }}>2do Medio</option>
                          <option value="3" style={{ color: "black" }}>3ro Medio</option>
                          <option value="4" style={{ color: "black" }}>4to Medio</option>
                        </select>
                      </div>
                    </div>

                    <div className="apply-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                      <div>
                        <label htmlFor="region" style={labelStyle}>Región *</label>
                        <select id="region" required value={formValues.region || ""} onChange={handleFieldChange} style={selectStyle} onFocus={handleFocus} onBlur={handleBlur}>
                          <option value="" style={{ color: "black" }}>Selecciona</option>
                          <option value="Arica y Parinacota" style={{ color: "black" }}>Arica y Parinacota</option>
                          <option value="Tarapacá" style={{ color: "black" }}>Tarapacá</option>
                          <option value="Antofagasta" style={{ color: "black" }}>Antofagasta</option>
                          <option value="Atacama" style={{ color: "black" }}>Atacama</option>
                          <option value="Coquimbo" style={{ color: "black" }}>Coquimbo</option>
                          <option value="Valparaíso" style={{ color: "black" }}>Valparaíso</option>
                          <option value="Metropolitana" style={{ color: "black" }}>Metropolitana</option>
                          <option value="O'Higgins" style={{ color: "black" }}>O'Higgins</option>
                          <option value="Maule" style={{ color: "black" }}>Maule</option>
                          <option value="Ñuble" style={{ color: "black" }}>Ñuble</option>
                          <option value="Biobío" style={{ color: "black" }}>Biobío</option>
                          <option value="La Araucanía" style={{ color: "black" }}>La Araucanía</option>
                          <option value="Los Ríos" style={{ color: "black" }}>Los Ríos</option>
                          <option value="Los Lagos" style={{ color: "black" }}>Los Lagos</option>
                          <option value="Aysén" style={{ color: "black" }}>Aysén</option>
                          <option value="Magallanes" style={{ color: "black" }}>Magallanes</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="comuna" style={labelStyle}>Comuna *</label>
                        <input type="text" id="comuna" required value={formValues.comuna || ""} onChange={handleFieldChange} placeholder="Ej: Providencia" autoComplete="address-level2" style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
                      </div>
                    </div>

                    <div className="apply-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                      <div>
                        <label htmlFor="email" style={labelStyle}>Correo *</label>
                        <input type="email" id="email" required value={formValues.email || ""} onChange={handleFieldChange} placeholder="tu@email.com" autoComplete="email" style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
                      </div>
                      <div>
                        <label htmlFor="phone" style={labelStyle}>Teléfono *</label>
                        <input
                          type="tel"
                          id="phone"
                          required
                          pattern="(?:\+569|9)[0-9]{8}"
                          minLength={9}
                          maxLength={12}
                          value={formValues.phone || ""}
                          onChange={handleFieldChange}
                          placeholder="+56912345678 o 912345678"
                          title="Ingresa el teléfono como +56912345678 o 912345678, sin espacios."
                          aria-describedby="phone-help"
                          autoComplete="tel"
                          inputMode="tel"
                          style={inputStyle}
                          onFocus={handleFocus}
                          onBlur={handleBlur}
                        />
                        <p id="phone-help" style={{ margin: "0.45rem 0 0", color: "rgba(255,255,255,0.58)", fontSize: "0.78rem", lineHeight: 1.4 }}>
                          Formato: +56912345678 o 912345678, sin espacios.
                        </p>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="gender" style={labelStyle}>Género (opcional)</label>
                      <select id="gender" value={formValues.gender || ""} onChange={handleFieldChange} style={selectStyle} onFocus={handleFocus} onBlur={handleBlur}>
                        <option value="" style={{ color: "black" }}>Selecciona</option>
                        <option value="Femenino" style={{ color: "black" }}>Femenino</option>
                        <option value="Masculino" style={{ color: "black" }}>Masculino</option>
                        <option value="No binario" style={{ color: "black" }}>No binario</option>
                        <option value="Otro" style={{ color: "black" }}>Otro</option>
                        <option value="Prefiero no decirlo" style={{ color: "black" }}>Prefiero no decirlo</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* STEP 2: INTERESES Y EXPERIENCIA */}
                {step === 2 && (
                  <div style={{ display: "grid", gap: "2rem" }}>
                    <div>
                      <label htmlFor="tiempo_libre" style={labelStyle}>¿Qué te gusta hacer en tu tiempo libre? *</label>
                      <textarea id="tiempo_libre" required value={formValues.tiempo_libre || ""} onChange={handleFieldChange} rows={3} placeholder="Cuéntanos sobre tus pasatiempos..." style={{ ...inputStyle, resize: "vertical" }} onFocus={handleFocus} onBlur={handleBlur}></textarea>
                    </div>
                    
                    <div>
                      <label htmlFor="actividades" style={labelStyle}>¿Has participado en actividades extracurriculares, concursos, clubes o proyectos fuera del colegio? *</label>
                      <select id="actividades" required onChange={(e) => setHasLiderado(e.target.value)} value={hasLiderado} style={selectStyle} onFocus={handleFocus} onBlur={handleBlur}>
                        <option value="" style={{ color: "black" }}>Selecciona</option>
                        <option value="Sí" style={{ color: "black" }}>Sí</option>
                        <option value="No" style={{ color: "black" }}>No</option>
                      </select>
                    </div>

                    {hasLiderado === "Sí" && (
                      <div>
                        <label htmlFor="actividades_desc" style={labelStyle}>Si respondiste que sí, cuéntanos brevemente qué hiciste (opcional)</label>
                        <textarea id="actividades_desc" value={formValues.actividades_desc || ""} onChange={handleFieldChange} rows={3} placeholder="Ej: Participé en un voluntariado, armé un club de debate..." style={{ ...inputStyle, resize: "vertical" }} onFocus={handleFocus} onBlur={handleBlur}></textarea>
                      </div>
                    )}

                    <div>
                      <label style={labelStyle}>¿Cuál de estas áreas te interesa más explorar durante el bootcamp? Elige hasta 2. *</label>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.7rem", marginTop: "0.5rem" }}>
                        {["Inteligencia artificial", "Emprendimiento e innovación", "Diseño de soluciones sociales", "Liderazgo y habilidades blandas", "Programación o desarrollo", "Comunicación y presentación de ideas", "No estoy seguro/a aún"].map(area => (
                          <button type="button" key={area} aria-pressed={selectedAreas.includes(area)} onClick={() => toggleArea(area)} style={{ display: "flex", alignItems: "center", textAlign: "left", width: "100%", gap: "0.6rem", cursor: selectedAreas.includes(area) || selectedAreas.length < 2 ? "pointer" : "not-allowed", padding: "0.65rem 0.9rem", background: selectedAreas.includes(area) ? "rgba(139, 92, 246, 0.2)" : "rgba(0,0,0,0.2)", borderRadius: "10px", border: selectedAreas.includes(area) ? "1px solid rgba(139, 92, 246, 0.5)" : "1px solid transparent", transition: "all 0.2s", color: "rgba(255,255,255,0.9)", fontFamily: "inherit", fontSize: "0.9rem", opacity: !selectedAreas.includes(area) && selectedAreas.length >= 2 ? 0.4 : 1 }}>
                            <input type="checkbox" checked={selectedAreas.includes(area)} readOnly tabIndex={-1} aria-hidden="true" style={{ accentColor: c.orange, width: "16px", height: "16px", flexShrink: 0, pointerEvents: "none" }} />
                            {area}
                          </button>
                        ))}
                      </div>
                      {selectedAreas.length >= 2 && <p style={{ color: "rgba(255,200,100,0.8)", fontSize: "0.8rem", marginTop: "0.5rem" }}>Máximo 2 áreas seleccionadas.</p>}
                    </div>

                    <div>
                      <label htmlFor="future_interest" style={labelStyle}>¿Hay algún área, tema o profesión que hoy te interese explorar en el futuro? *</label>
                      <p style={{ margin: "-0.15rem 0 0.65rem", color: "rgba(255,255,255,0.62)", fontSize: "0.84rem", lineHeight: 1.45 }}>
                        No necesitas tenerlo decidido.
                      </p>
                      <textarea
                        id="future_interest"
                        required
                        value={formValues.future_interest || ""}
                        onChange={handleFieldChange}
                        rows={3}
                        placeholder="Cuéntanos qué te gustaría explorar..."
                        style={{ ...inputStyle, resize: "vertical" }}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                      />
                    </div>

                    <div>
                      <label htmlFor="curiosity_topic" style={labelStyle}>¿Qué tema podría tenerte horas investigando, conversando o aprendiendo sin que nadie te lo pidiera? ¿Por qué? *</label>
                      <textarea
                        id="curiosity_topic"
                        required
                        value={formValues.curiosity_topic || ""}
                        onChange={handleFieldChange}
                        rows={3}
                        placeholder="Cuéntanos qué tema despierta tu curiosidad y por qué..."
                        style={{ ...inputStyle, resize: "vertical" }}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                      />
                    </div>

                    <div>
                      <label style={labelStyle}>¿Tu familia o adulto responsable sabe que estás postulando a The Builders Camp? *</label>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem", marginTop: "0.5rem" }}>
                        {[
                          "Sí, y apoya mi participación.",
                          "Sí, pero todavía tenemos que conversar algunos detalles.",
                          "Aún no les he contado sobre mi postulación.",
                          "Prefiero conversarlo con ellos si avanzo en el proceso."
                        ].map(opt => (
                          <label key={opt} onClick={() => setFamilySupport(opt)} style={{ display: "flex", alignItems: "center", gap: "0.6rem", cursor: "pointer", padding: "0.7rem 1rem", background: familySupport === opt ? "rgba(139, 92, 246, 0.2)" : "rgba(0,0,0,0.2)", borderRadius: "10px", border: familySupport === opt ? "1px solid rgba(139, 92, 246, 0.5)" : "1px solid transparent", transition: "all 0.2s", color: "rgba(255,255,255,0.9)", fontSize: "0.9rem" }}>
                            <input type="radio" name="family" value={opt} checked={familySupport === opt} readOnly style={{ accentColor: c.orange, width: "16px", height: "16px", flexShrink: 0 }} />
                            {opt}
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label style={labelStyle}>The Builders Camp se realizará presencialmente en Santiago del 14 al 18 de diciembre. En caso de ser seleccionado/a, ¿podrías participar durante los cinco días? *</label>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem", marginTop: "0.5rem" }}>
                        {[
                          "Sí, podría participar durante los cinco días sin inconvenientes.",
                          "Sí, pero necesitaría apoyo para transporte y/o alojamiento.",
                          "Probablemente sí, aunque todavía debo confirmar algunos detalles.",
                          "No estoy seguro/a por el momento."
                        ].map(opt => (
                          <label key={opt} onClick={() => setAttendance(opt)} style={{ display: "flex", alignItems: "center", gap: "0.6rem", cursor: "pointer", padding: "0.7rem 1rem", background: attendance === opt ? "rgba(139, 92, 246, 0.2)" : "rgba(0,0,0,0.2)", borderRadius: "10px", border: attendance === opt ? "1px solid rgba(139, 92, 246, 0.5)" : "1px solid transparent", transition: "all 0.2s", color: "rgba(255,255,255,0.9)", fontSize: "0.9rem" }}>
                            <input type="radio" name="attendance" value={opt} checked={attendance === opt} readOnly style={{ accentColor: c.orange, width: "16px", height: "16px", flexShrink: 0 }} />
                            {opt}
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label style={labelStyle}>The Builders Camp tiene un costo de participación de $60.000. En caso de ser seleccionado/a, ¿cuál de estas opciones describe mejor tu situación? *</label>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem", marginTop: "0.5rem" }}>
                        {[
                          "Podría cubrir el costo total de $60.000.",
                          "Podría cubrir una parte del costo.",
                          "Necesitaría una beca para poder participar.",
                        ].map((option) => (
                          <label key={option} style={{ display: "flex", alignItems: "flex-start", gap: "0.7rem", cursor: "pointer", padding: "0.8rem 1rem", background: paymentCapacity === option ? "rgba(139, 92, 246, 0.2)" : "rgba(0,0,0,0.2)", borderRadius: "10px", border: paymentCapacity === option ? "1px solid rgba(139, 92, 246, 0.5)" : "1px solid transparent", transition: "all 0.2s", color: "rgba(255,255,255,0.9)", fontSize: "0.9rem", lineHeight: 1.45 }}>
                            <input
                              type="radio"
                              name="paymentCapacity"
                              value={option}
                              checked={paymentCapacity === option}
                              onChange={(event) => setPaymentCapacity(event.target.value)}
                              style={{ accentColor: c.orange, width: "17px", height: "17px", marginTop: "2px", flexShrink: 0 }}
                            />
                            {option}
                          </label>
                        ))}
                      </div>
                      <p style={{ margin: "0.75rem 0 0", color: "rgba(255,255,255,0.62)", fontSize: "0.82rem", lineHeight: 1.5 }}>
                        Tu respuesta no influirá en el proceso de selección. Esta información nos permitirá conocer las necesidades de apoyo de quienes postulan.
                      </p>
                    </div>
                  </div>
                )}

                {/* STEP 3: TU LADO BUILDER */}
                {step === 3 && (
                    <section style={{ display: "grid", gap: "1.8rem" }}>

                      <div>
                        <label htmlFor="community_problem" style={labelStyle}>Si pudieras resolver un problema de tu colegio, comunidad o entorno, ¿cuál elegirías y por qué? *</label>
                        <textarea id="community_problem" required value={formValues.community_problem || ""} onChange={handleFieldChange} rows={3} placeholder="Describe el problema y por qué te importa..." style={{ ...inputStyle, resize: "vertical" }} onFocus={handleFocus} onBlur={handleBlur} />
                      </div>

                      <div>
                        <label style={labelStyle}>¿Con cuál de estas palabras te identificas más? Elige hasta 3. *</label>
                        <div className="apply-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.7rem", marginTop: "0.5rem" }}>
                          {["Curioso/a", "Creativo/a", "Analítico/a", "Líder", "Comunicador/a", "Inquieto/a", "Emprendedor/a", "Tecnológico/a", "Optimista", "Empático/a", "Soñador/a", "Otro"].map((trait) => (
                            <button type="button" key={trait} aria-pressed={selectedTraits.includes(trait)} onClick={() => toggleTrait(trait)} style={{ display: "flex", alignItems: "center", textAlign: "left", width: "100%", gap: "0.6rem", cursor: selectedTraits.includes(trait) || selectedTraits.length < 3 ? "pointer" : "not-allowed", padding: "0.7rem 0.9rem", background: selectedTraits.includes(trait) ? "rgba(139, 92, 246, 0.2)" : "rgba(0,0,0,0.2)", borderRadius: "10px", border: selectedTraits.includes(trait) ? "1px solid rgba(139, 92, 246, 0.5)" : "1px solid transparent", color: "rgba(255,255,255,0.9)", fontFamily: "inherit", fontSize: "0.9rem", opacity: !selectedTraits.includes(trait) && selectedTraits.length >= 3 ? 0.45 : 1 }}>
                              <input type="checkbox" checked={selectedTraits.includes(trait)} readOnly tabIndex={-1} aria-hidden="true" style={{ accentColor: c.orange, width: "16px", height: "16px", flexShrink: 0, pointerEvents: "none" }} />
                              {trait}
                            </button>
                          ))}
                        </div>
                        {selectedTraits.includes("Otro") && (
                          <input
                            type="text"
                            id="trait_other"
                            required
                            value={formValues.trait_other || ""}
                            onChange={handleFieldChange}
                            placeholder="Especifica otra palabra"
                            style={{ ...inputStyle, marginTop: "0.75rem" }}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                          />
                        )}
                        {selectedTraits.length >= 3 && <p style={{ color: "rgba(255,200,100,0.8)", fontSize: "0.8rem", marginTop: "0.5rem" }}>Máximo 3 palabras seleccionadas.</p>}
                      </div>

                      <div>
                        <label htmlFor="team_role" style={labelStyle}>En un equipo, ¿qué rol tiendes a tomar? *</label>
                        <textarea id="team_role" required value={formValues.team_role || ""} onChange={handleFieldChange} rows={3} placeholder="Cuéntanos qué rol sueles asumir y cómo aportas al equipo..." style={{ ...inputStyle, resize: "vertical" }} onFocus={handleFocus} onBlur={handleBlur} />
                      </div>

                      <div>
                        <label htmlFor="admired_person" style={labelStyle}>¿Qué persona admiras y por qué? *</label>
                        <textarea id="admired_person" required value={formValues.admired_person || ""} onChange={handleFieldChange} rows={3} placeholder="Puede ser una persona real o ficticia..." style={{ ...inputStyle, resize: "vertical" }} onFocus={handleFocus} onBlur={handleBlur} />
                      </div>
                    </section>
                )}

                {/* STEP 4: REFLEXION */}
                {step === 4 && (
                  <div style={{ display: "grid", gap: "2rem" }}>
                    <div>
                      <label htmlFor="ref_1" style={labelStyle}>¿Por qué quieres ser parte de The Builders Camp? Cuéntanos en tus propias palabras. *</label>
                      <textarea id="ref_1" required value={formValues.ref_1 || ""} onChange={handleFieldChange} rows={4} placeholder="Tu motivación..." style={{ ...inputStyle, resize: "vertical" }} onFocus={handleFocus} onBlur={handleBlur}></textarea>
                    </div>

                    <div>
                      <label htmlFor="ref_2" style={labelStyle}>¿Qué opinas sobre el rol de la inteligencia artificial en la sociedad? ¿Te genera entusiasmo, preocupación, o ambas cosas a la vez? *</label>
                      <textarea id="ref_2" required value={formValues.ref_2 || ""} onChange={handleFieldChange} rows={4} placeholder="Escribe tu opinión honesta..." style={{ ...inputStyle, resize: "vertical" }} onFocus={handleFocus} onBlur={handleBlur}></textarea>
                    </div>

                    <label style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.85rem",
                      padding: "1.1rem 1.2rem",
                      borderRadius: "14px",
                      border: "1px solid rgba(255,255,255,0.15)",
                      background: "rgba(0,0,0,0.25)",
                      color: "rgba(255,255,255,0.9)",
                      fontSize: "0.9rem",
                      lineHeight: 1.55,
                      cursor: "pointer"
                    }}>
                      <input
                        type="checkbox"
                        name="dataConsent"
                        required
                        style={{ accentColor: c.orange, width: "18px", height: "18px", marginTop: "2px", flexShrink: 0 }}
                      />
                      <span>
                        Acepto que mis datos sean enviados y utilizados exclusivamente para analizar mi postulación a la convocatoria de The Builders Camp. Mis datos no serán compartidos con terceros ni descargados por ningún motivo. *
                      </span>
                    </label>
                  </div>
                )}

                {/* Navigation Buttons */}
                {step > 0 && (
                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "2.5rem" }}>
                    {step > 1 && (
                      <button className="apply-nav-btn" type="button" onClick={prevStep} style={{ 
                        background: "rgba(255,255,255,0.08)", color: "white", padding: "0.62rem 1.15rem",
                        borderRadius: "10px", border: "1px solid rgba(255,255,255,0.12)", fontWeight: 600, fontSize: "0.88rem", cursor: "pointer",
                        transition: "all 0.2s"
                      }} onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"} onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}>
                        Atrás
                      </button>
                    )}
                    
                    <button className="apply-nav-btn" type="submit" disabled={isSubmitting} style={{ 
                      background: c.orange, color: "white", padding: "0.62rem 1.25rem", minWidth: "145px",
                      borderRadius: "10px", border: "1px solid rgba(255,255,255,0.14)", fontWeight: 600, fontSize: "0.88rem", cursor: "pointer",
                      boxShadow: "0 2px 8px rgba(139, 92, 246, 0.3)", transition: "all 0.2s",
                      opacity: isSubmitting ? 0.65 : 1
                    }} onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"} onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
                      {step < totalSteps ? "Continuar" : isSubmitting ? "Enviando..." : "Finalizar postulación"}
                    </button>
                  </div>
                )}

                {submitError && (
                  <p role="alert" style={{ color: "#fecaca", fontSize: "0.9rem", textAlign: "center", marginTop: "1rem" }}>
                    {submitError}
                  </p>
                )}
                
              </div>
            </form>
          ) : (
            <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
              <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "rgba(67, 165, 116, 0.15)", border: "1px solid rgba(67, 165, 116, 0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 2rem", color: c.forest }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <h2 style={{ fontSize: "2.2rem", color: c.white, marginBottom: "1rem", fontWeight: 600 }}>¡Postulación Enviada!</h2>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "1.1rem", marginBottom: "2.5rem", maxWidth: "400px", margin: "0 auto 2.5rem" }}>
                Hemos recibido tu postulación con éxito. Analizaremos tu perfil y te contactaremos muy pronto.
              </p>
              <Link href="/" style={{ background: "rgba(255,255,255,0.1)", color: "white", padding: "1rem 2.5rem", borderRadius: "99px", textDecoration: "none", fontWeight: 700, display: "inline-block", border: "1px solid rgba(255,255,255,0.2)", transition: "all 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.2)"} onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}>
                Volver al Inicio
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
