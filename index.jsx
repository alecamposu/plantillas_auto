import { useState, useEffect } from "react";

const TEMPLATES = {
  venta: {
    id: "venta",
    title: "Business Case",
    subtitle: "Venta",
    desc: "Proyección de ahorro para prospectos. Incluye costos actuales, escenarios de ahorro, cotización y ROI.",
    color: "#FFD600",
    icon: "📊",
    sections: [
      {
        title: "Datos de la Empresa",
        fields: [
          { key: "empresa_nombre", label: "Nombre de la empresa", type: "text", required: true },
          { key: "industria", label: "Industria / vertical", type: "select", options: ["Pasajeros", "Carga pesada", "Última milla", "Mixta"], required: true },
          { key: "unidades_total", label: "Número total de unidades", type: "number", required: true },
          { key: "subdivisiones", label: "Subdivisiones de flota (nombre: cantidad, separadas por coma)", type: "text", placeholder: "Ej: Pasajeros: 550, Carga: 350, Última milla: 150" },
          { key: "moneda", label: "Moneda", type: "select", options: ["MXN", "COP", "USD"], required: true },
        ],
      },
      {
        title: "Costos de Rotación",
        fields: [
          { key: "rotacion_pct", label: "% de rotación anual de conductores", type: "number", placeholder: "Ej: 60" },
          { key: "rotacion_costo", label: "Costo promedio por rotación (finiquito + reclutamiento)", type: "number", placeholder: "Ej: 50000" },
        ],
      },
      {
        title: "Costos de Siniestros",
        fields: [
          { key: "siniestralidad_pct", label: "% de siniestralidad anual", type: "number", placeholder: "Ej: 20" },
          { key: "num_siniestros", label: "Número de siniestros anuales", type: "number" },
          { key: "costo_siniestro_leve", label: "Costo promedio siniestro leve", type: "number" },
          { key: "costo_siniestro_medio", label: "Costo promedio siniestro medio", type: "number" },
          { key: "costo_siniestro_grave", label: "Costo promedio siniestro grave", type: "number" },
        ],
      },
      {
        title: "Costos de Combustible",
        fields: [
          { key: "gasto_combustible_anual", label: "Gasto anual en combustible", type: "number" },
          { key: "rendimiento_actual", label: "Rendimiento actual (km/l)", type: "number", placeholder: "Ej: 3.2" },
          { key: "tipo_combustible", label: "Tipo de combustible", type: "select", options: ["Diesel", "Gasolina", "Mixto"] },
        ],
      },
      {
        title: "Cotización Airbag",
        fields: [
          { key: "precio_licencia", label: "Precio por licencia mensual", type: "number", placeholder: "Ej: 200" },
          { key: "presupuesto_premios", label: "Presupuesto de premios por conductor/mes", type: "number", placeholder: "Ej: 350" },
          { key: "descuento_pct", label: "% de descuento aplicable", type: "number", placeholder: "Ej: 20" },
        ],
      },
      {
        title: "Contacto Comercial",
        fields: [
          { key: "ejecutivo_nombre", label: "Nombre del ejecutivo", type: "text" },
          { key: "ejecutivo_cargo", label: "Cargo", type: "text" },
          { key: "ejecutivo_tel", label: "Teléfono", type: "text" },
          { key: "ejecutivo_email", label: "Email", type: "text" },
        ],
      },
    ],
  },
  conversion_piloto: {
    id: "conversion_piloto",
    title: "Fin de Piloto",
    subtitle: "Conversión",
    desc: "Reporte de resultados del piloto para cerrar la conversión a contrato. ROI por empresa y consolidado.",
    color: "#2ECC71",
    icon: "🏆",
    sections: [
      {
        title: "Datos del Piloto",
        fields: [
          { key: "canal_nombre", label: "Nombre del canal/aseguradora (ej: SURA)", type: "text", required: true },
          { key: "num_empresas", label: "Número de empresas participantes", type: "number", required: true },
          { key: "duracion_meses", label: "Duración del piloto (meses)", type: "number", required: true },
          { key: "periodo", label: "Periodo (ej: Oct 2025 — Mar 2026)", type: "text", required: true },
          { key: "conductores_inscritos", label: "Conductores inscritos", type: "number", required: true },
          { key: "moneda", label: "Moneda", type: "select", options: ["MXN", "COP"], required: true },
          { key: "precio_licencia_mes", label: "Precio licencia/conductor/mes", type: "number" },
        ],
      },
      {
        title: "Empresas del Piloto (repetir por empresa separando con |)",
        fields: [
          { key: "empresas_nombres", label: "Nombres de empresas (separados por |)", type: "text", placeholder: "Inmel | Alianza Team | Antioquia SURA" },
          { key: "empresas_conductores", label: "Conductores inicial→final por empresa (|)", type: "text", placeholder: "82→90 | 29→28 | 18→15" },
          { key: "empresas_riesgo_bajo_ini", label: "% Riesgo bajo inicial por empresa (|)", type: "text", placeholder: "27 | 50 | 29" },
          { key: "empresas_riesgo_bajo_fin", label: "% Riesgo bajo final por empresa (|)", type: "text", placeholder: "33 | 33 | 40" },
          { key: "empresas_riesgo_alto_ini", label: "% Riesgo alto inicial por empresa (|)", type: "text", placeholder: "10 | 0 | 14" },
          { key: "empresas_riesgo_alto_fin", label: "% Riesgo alto final por empresa (|)", type: "text", placeholder: "12 | 21 | 27" },
          { key: "empresas_reduccion", label: "% Reducción riesgo alto por empresa (|)", type: "text", placeholder: "68 | 56 | 75" },
          { key: "empresas_roi", label: "% ROI por empresa (|)", type: "text", placeholder: "251 | 151 | 233" },
          { key: "empresas_ahorro", label: "Ahorro anual por empresa (|)", type: "text", placeholder: "337.7M | 23.9M | 24.2M" },
        ],
      },
      {
        title: "ROI Consolidado",
        fields: [
          { key: "ahorro_consolidado", label: "Ahorro consolidado total", type: "text", placeholder: "Ej: $515M COP" },
          { key: "roi_promedio", label: "ROI promedio (%)", type: "number", placeholder: "Ej: 190" },
          { key: "reduccion_riesgo_total", label: "% Reducción total de riesgo alto", type: "number", placeholder: "Ej: 50" },
        ],
      },
      {
        title: "Siguientes Pasos",
        fields: [
          { key: "paso1", label: "Paso 1 y fecha", type: "text", placeholder: "Revisión de resultados — Abril 2026" },
          { key: "paso2", label: "Paso 2 y fecha", type: "text", placeholder: "Definición de escenario — Abril 2026" },
          { key: "paso3", label: "Paso 3 y fecha", type: "text", placeholder: "Formalización contrato — Mayo 2026" },
          { key: "paso4", label: "Paso 4 y fecha", type: "text", placeholder: "Kick-off implementación — Mayo 2026" },
        ],
      },
    ],
  },
  impacto_gerentes: {
    id: "impacto_gerentes",
    title: "Análisis de Impacto",
    subtitle: "Conversión",
    desc: "Resultados por administrador/gerente de flota con ahorro económico proyectado y casos de éxito.",
    color: "#E67E22",
    icon: "👤",
    sections: [
      {
        title: "Datos Generales",
        fields: [
          { key: "empresa_nombre", label: "Nombre de la empresa", type: "text", required: true },
          { key: "periodo", label: "Periodo de análisis", type: "text", required: true, placeholder: "May-Ago 2025, Dic 2025-Feb 2026" },
          { key: "muestra_conductores", label: "Total de conductores en muestra", type: "number", required: true },
          { key: "num_admins", label: "Número de administradores", type: "number", required: true },
          { key: "calificacion_ini", label: "Calificación general inicial", type: "number", placeholder: "Ej: 79" },
          { key: "calificacion_fin", label: "Calificación general final", type: "number" },
          { key: "combustible_sin", label: "Rendimiento sin Airbag (km/l)", type: "number" },
          { key: "combustible_con", label: "Rendimiento con Airbag (km/l)", type: "number" },
          { key: "siniestros_sin", label: "Costo siniestros sin Airbag", type: "number" },
          { key: "siniestros_con", label: "Costo siniestros con Airbag", type: "number" },
          { key: "admins_uso", label: "Administradores con uso (ej: 3/6)", type: "text" },
          { key: "conductores_uso", label: "Conductores con uso (ej: 31/66)", type: "text" },
          { key: "puntos_generados", label: "Puntos generados", type: "number" },
          { key: "moneda", label: "Moneda", type: "select", options: ["MXN", "COP"], required: true },
        ],
      },
      {
        title: "Administradores (separar múltiples con |)",
        fields: [
          { key: "admin_nombres", label: "Nombres de administradores (|)", type: "text", placeholder: "Cesar Rodriguez | Edson Garza" },
          { key: "admin_conductores", label: "# conductores por admin (|)", type: "text", placeholder: "15 | 17" },
          { key: "admin_calif_ini", label: "Calificación inicial por admin (|)", type: "text", placeholder: "79 | 78" },
          { key: "admin_calif_fin", label: "Calificación final por admin (|)", type: "text", placeholder: "74 | 75" },
          { key: "admin_interacciones", label: "Interacciones/mes por admin (|)", type: "text", placeholder: "19 | 18" },
          { key: "admin_mejor_habito", label: "Mejor hábito mejorado por admin (|)", type: "text", placeholder: "Exceso de velocidad | Frenado brusco" },
        ],
      },
      {
        title: "ROI",
        fields: [
          { key: "num_unidades_roi", label: "Número de unidades para proyección", type: "number" },
          { key: "total_sin_airbag", label: "Total anual SIN Airbag", type: "number" },
          { key: "total_con_airbag", label: "Total anual CON Airbag", type: "number" },
          { key: "ahorro_combustible", label: "Ahorro en combustible", type: "number" },
          { key: "ahorro_siniestros", label: "Ahorro en siniestros", type: "number" },
          { key: "retorno_neto", label: "Retorno neto", type: "number" },
          { key: "roi_pct", label: "ROI (%)", type: "number" },
          { key: "meses_retorno", label: "Meses para retorno de inversión", type: "number" },
        ],
      },
    ],
  },
  upsell: {
    id: "upsell",
    title: "Potencial de Flota",
    subtitle: "Upsell",
    desc: "Demuestra que los resultados actuales son solo una fracción del potencial al escalar a toda la flota.",
    color: "#3498DB",
    icon: "🚀",
    sections: [
      {
        title: "Datos Actuales",
        fields: [
          { key: "empresa_nombre", label: "Nombre de la empresa", type: "text", required: true },
          { key: "division_actual", label: "División/línea actual con Airbag", type: "text", required: true },
          { key: "periodo", label: "Periodo de uso actual", type: "text", required: true },
          { key: "conductores_actuales", label: "# conductores actuales con Airbag", type: "number", required: true },
          { key: "conductores_total", label: "# total de conductores de la empresa", type: "number", required: true },
          { key: "moneda", label: "Moneda", type: "select", options: ["MXN", "COP"], required: true },
        ],
      },
      {
        title: "Resultados de Actividad",
        fields: [
          { key: "usuarios_registrados", label: "Usuarios registrados", type: "number" },
          { key: "usuarios_descarga", label: "Usuarios con descarga", type: "number" },
          { key: "usuarios_uso", label: "Usuarios con uso activo", type: "number" },
          { key: "km_analizados", label: "Km analizados", type: "number" },
          { key: "trayectos", label: "Trayectos analizados", type: "number" },
          { key: "puntos_entregados", label: "Puntos entregados", type: "number" },
        ],
      },
      {
        title: "Progreso (Semana 1 vs Semana Final)",
        fields: [
          { key: "calif_ini", label: "Calificación promedio inicial", type: "number" },
          { key: "calif_fin", label: "Calificación promedio final", type: "number" },
          { key: "riesgo_alto_ini", label: "% viajes riesgo alto inicial", type: "number" },
          { key: "riesgo_alto_fin", label: "% viajes riesgo alto final", type: "number" },
          { key: "riesgo_bajo_ini", label: "% viajes riesgo bajo inicial", type: "number" },
          { key: "riesgo_bajo_fin", label: "% viajes riesgo bajo final", type: "number" },
          { key: "celular_min_ini", label: "Minutos celular inicial", type: "number" },
          { key: "celular_min_fin", label: "Minutos celular final", type: "number" },
        ],
      },
      {
        title: "Impacto Medido",
        fields: [
          { key: "rotacion_antes", label: "% Rotación antes de Airbag", type: "number" },
          { key: "rotacion_durante", label: "% Rotación durante Airbag", type: "number" },
          { key: "siniestros_antes", label: "Costo siniestros antes", type: "number" },
          { key: "siniestros_durante", label: "Costo siniestros durante", type: "number" },
          { key: "rendimiento_mejora_pct", label: "% Mejora rendimiento combustible", type: "number" },
          { key: "ahorro_combustible_anual", label: "Ahorro proyectado anual combustible", type: "number" },
        ],
      },
      {
        title: "Proyección al Escalar (3 Escenarios)",
        fields: [
          { key: "costo_sin_pesimista", label: "Costo SIN Airbag — Pesimista", type: "number" },
          { key: "costo_sin_conservador", label: "Costo SIN Airbag — Conservador", type: "number" },
          { key: "costo_sin_optimista", label: "Costo SIN Airbag — Optimista", type: "number" },
          { key: "ahorro_pesimista", label: "Ahorro estimado — Pesimista", type: "number" },
          { key: "ahorro_conservador", label: "Ahorro estimado — Conservador", type: "number" },
          { key: "ahorro_optimista", label: "Ahorro estimado — Optimista", type: "number" },
          { key: "costo_airbag_anual", label: "Costo anual de Airbag (flota completa)", type: "number" },
          { key: "roi_pesimista", label: "% ROI Pesimista", type: "number" },
          { key: "roi_conservador", label: "% ROI Conservador", type: "number" },
          { key: "roi_optimista", label: "% ROI Optimista", type: "number" },
        ],
      },
    ],
  },
};

function TemplateCard({ t, selected, onClick }) {
  const isSelected = selected === t.id;
  return (
    <button
      onClick={() => onClick(t.id)}
      className="text-left transition-all duration-200"
      style={{
        background: isSelected ? t.color + "18" : "#fff",
        border: isSelected ? `2px solid ${t.color}` : "2px solid #e5e5e5",
        borderRadius: 16,
        padding: "20px 22px",
        cursor: "pointer",
        width: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {isSelected && (
        <div style={{ position: "absolute", top: 0, left: 0, width: 4, height: "100%", background: t.color }} />
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <span style={{ fontSize: 28 }}>{t.icon}</span>
        <div>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", color: t.color }}>{t.subtitle}</div>
          <div style={{ fontSize: 18, fontWeight: 900, color: "#1a1a1a", fontFamily: "'Archivo Black', sans-serif" }}>{t.title}</div>
        </div>
      </div>
      <div style={{ fontSize: 13, color: "#666", lineHeight: 1.5 }}>{t.desc}</div>
    </button>
  );
}

function FormField({ field, value, onChange }) {
  const base = {
    width: "100%",
    padding: "10px 14px",
    border: "1.5px solid #ddd",
    borderRadius: 10,
    fontSize: 14,
    fontFamily: "inherit",
    background: "#fafafa",
    color: "#1a1a1a",
    outline: "none",
    transition: "border-color 0.15s",
  };
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#444", marginBottom: 5, letterSpacing: 0.3 }}>
        {field.label} {field.required && <span style={{ color: "#FFD600" }}>*</span>}
      </label>
      {field.type === "select" ? (
        <select
          value={value || ""}
          onChange={(e) => onChange(field.key, e.target.value)}
          style={{ ...base, cursor: "pointer" }}
        >
          <option value="">Seleccionar...</option>
          {field.options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      ) : (
        <input
          type={field.type === "number" ? "number" : "text"}
          value={value || ""}
          onChange={(e) => onChange(field.key, e.target.value)}
          placeholder={field.placeholder || ""}
          style={base}
          onFocus={(e) => (e.target.style.borderColor = "#FFD600")}
          onBlur={(e) => (e.target.style.borderColor = "#ddd")}
        />
      )}
    </div>
  );
}

export default function App() {
  const [selected, setSelected] = useState(null);
  const [formData, setFormData] = useState({});
  const [activeSection, setActiveSection] = useState(0);
  const [copied, setCopied] = useState(false);

  const template = selected ? TEMPLATES[selected] : null;

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleCopy = () => {
    if (!template) return;
    const lines = [`PLANTILLA: ${template.title} (${template.subtitle})\n`];
    template.sections.forEach((sec) => {
      lines.push(`\n## ${sec.title}`);
      sec.fields.forEach((f) => {
        const v = formData[f.key];
        if (v) lines.push(`${f.label}: ${v}`);
      });
    });
    const text = lines.join("\n");
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendToChat = () => {
    if (!template) return;
    const lines = [`Genera la presentación con la plantilla "${template.title} (${template.subtitle})" usando estos datos:\n`];
    template.sections.forEach((sec) => {
      lines.push(`\n## ${sec.title}`);
      sec.fields.forEach((f) => {
        const v = formData[f.key];
        if (v) lines.push(`- ${f.label}: ${v}`);
      });
    });
    const text = lines.join("\n");
    if (typeof sendPrompt === "function") {
      sendPrompt(text);
    }
  };

  const filledCount = template
    ? template.sections.reduce((acc, sec) => acc + sec.fields.filter((f) => formData[f.key]).length, 0)
    : 0;
  const totalFields = template
    ? template.sections.reduce((acc, sec) => acc + sec.fields.length, 0)
    : 0;
  const requiredFilled = template
    ? template.sections.every((sec) =>
        sec.fields.filter((f) => f.required).every((f) => formData[f.key])
      )
    : false;

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: "#f0f0f0", minHeight: "100vh" }}>
      <link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=DM+Sans:wght@400;500;700;900&display=swap" rel="stylesheet" />
      
      {/* Header */}
      <div style={{ background: "#1a1a1a", borderBottom: "3px solid #FFD600", padding: "16px 28px", display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 24, fontWeight: 900, color: "#fff", fontFamily: "'Archivo Black', sans-serif" }}>airbag</span>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#FFD600", marginTop: -8 }} />
        </div>
        <div style={{ width: 1, height: 24, background: "#444" }} />
        <span style={{ fontSize: 13, color: "#888", fontWeight: 600, letterSpacing: 1 }}>GENERADOR DE PRESENTACIONES</span>
      </div>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "28px 20px" }}>
        {/* Step 1: Template Selection */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#FFD600", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 16, fontFamily: "'Archivo Black'" }}>1</div>
            <span style={{ fontSize: 18, fontWeight: 800, color: "#1a1a1a" }}>Selecciona el tipo de presentación</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 12 }}>
            {Object.values(TEMPLATES).map((t) => (
              <TemplateCard
                key={t.id}
                t={t}
                selected={selected}
                onClick={(id) => {
                  setSelected(id);
                  setActiveSection(0);
                  setFormData({});
                }}
              />
            ))}
          </div>
        </div>

        {/* Step 2: Form */}
        {template && (
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e5e5e5", overflow: "hidden" }}>
            {/* Section tabs */}
            <div style={{ background: "#1a1a1a", padding: "12px 20px", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginRight: 14 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#FFD600", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 14, fontFamily: "'Archivo Black'" }}>2</div>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Completa los datos</span>
              </div>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {template.sections.map((sec, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveSection(i)}
                    style={{
                      padding: "6px 14px",
                      borderRadius: 100,
                      border: "none",
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: "pointer",
                      background: activeSection === i ? template.color : "#333",
                      color: activeSection === i ? "#1a1a1a" : "#aaa",
                      transition: "all 0.15s",
                    }}
                  >
                    {sec.title.length > 22 ? sec.title.slice(0, 22) + "…" : sec.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Active section form */}
            <div style={{ padding: "24px 28px" }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: "#1a1a1a", marginBottom: 18, fontFamily: "'Archivo Black'" }}>
                {template.sections[activeSection].title}
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
                {template.sections[activeSection].fields.map((f) => (
                  <FormField key={f.key} field={f} value={formData[f.key]} onChange={handleChange} />
                ))}
              </div>
              {/* Navigation */}
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20, paddingTop: 16, borderTop: "1px solid #eee" }}>
                <button
                  onClick={() => setActiveSection(Math.max(0, activeSection - 1))}
                  disabled={activeSection === 0}
                  style={{
                    padding: "8px 20px",
                    borderRadius: 8,
                    border: "1.5px solid #ddd",
                    background: "#fff",
                    cursor: activeSection === 0 ? "not-allowed" : "pointer",
                    fontSize: 13,
                    fontWeight: 700,
                    opacity: activeSection === 0 ? 0.4 : 1,
                    color: "#666",
                  }}
                >
                  ← Anterior
                </button>
                {activeSection < template.sections.length - 1 ? (
                  <button
                    onClick={() => setActiveSection(activeSection + 1)}
                    style={{
                      padding: "8px 20px",
                      borderRadius: 8,
                      border: "none",
                      background: template.color,
                      cursor: "pointer",
                      fontSize: 13,
                      fontWeight: 800,
                      color: "#1a1a1a",
                    }}
                  >
                    Siguiente →
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Actions */}
        {template && (
          <div style={{ marginTop: 24, background: "#1a1a1a", borderRadius: 16, padding: "20px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div>
              <div style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>
                {filledCount}/{totalFields} campos completados
              </div>
              <div style={{ height: 4, width: 200, background: "#333", borderRadius: 100, overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%",
                    width: `${(filledCount / totalFields) * 100}%`,
                    background: template.color,
                    borderRadius: 100,
                    transition: "width 0.3s",
                  }}
                />
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={handleCopy}
                style={{
                  padding: "10px 22px",
                  borderRadius: 10,
                  border: "1.5px solid #444",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#fff",
                }}
              >
                {copied ? "✓ Copiado" : "Copiar datos"}
              </button>
              <button
                onClick={handleSendToChat}
                disabled={!requiredFilled}
                style={{
                  padding: "10px 28px",
                  borderRadius: 10,
                  border: "none",
                  background: requiredFilled ? "#FFD600" : "#444",
                  cursor: requiredFilled ? "pointer" : "not-allowed",
                  fontSize: 13,
                  fontWeight: 900,
                  color: "#1a1a1a",
                  fontFamily: "'Archivo Black'",
                }}
              >
                Generar presentación →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
