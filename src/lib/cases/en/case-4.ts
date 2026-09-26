// Перевод кейса №4 (английский). Оригинал — ../ru/case-4.ts.
// Сгенерирован из оригинала: структура, ответы и снимки совпадают. Текст проверяет врач заказчика.
import { diagnosisAndTreatmentStep } from "../diagnoses";
import type { ClinicalCase } from "../types";

export const case4: ClinicalCase = {
  slug: "case-4",
  number: 4,
  title: "Breathlessness at rest and orthopnoea",
  topic: "Respiratory failure",
  summary:
    "71 years old, four exacerbations in a year. Breathlessness at rest, cyanosis, RR 32, SpO₂ 82%. Blood gases: pH 7.31, PaCO₂ 58 mmHg.",
  difficulty: "hard",
  minutes: 12,
  patient: {
    name: "Gulmira Maratovna Sadykova",
    age: 71,
    sex: "female",
    admission: "Hospital admission",
    photo: { src: "/cases/case-4/patient.jpg", width: 1408, height: 768 },
  },
  cover: { src: "/cases/case-4/xray.jpg", width: 1377, height: 751 },
  steps: [
    {
      kind: "history",
      title: "History and examination",
      vitals: [
        { label: "BP", value: "150/90", unit: "mmHg" },
        { label: "Pulse", value: "112", unit: "/min" },
        { label: "SpO₂", value: "82", unit: "% on room air" },
        { label: "Temperature", value: "37.8", unit: "°C" },
        { label: "RR", value: "32", unit: "/min" },
      ],
      complaints: [
        "Severe breathlessness at rest, difficulty breathing out, bouts of coughing with sputum that is hard to clear, weakness, a feeling of air hunger.",
      ],
      anamnesis:
        "COPD was diagnosed 10 years ago. Over the last 5 days her breathing has gradually worsened. In the past 24 hours her breathlessness has increased markedly, and short-acting inhalers are not helping enough. Four exacerbations in the past year, two hospital admissions.",
      lifeHistory:
        "Smoked for 45 years, quit 3 years ago. Arterial hypertension, chronic heart failure, functional class I–II.",
      allergy: "Denies drug allergies.",
      exam: [
        "Severe condition. Orthopnoea. Cyanotic skin. Shallow breathing, markedly prolonged expiration. Auscultation: sharply diminished vesicular breath sounds, multiple dry wheezes. RR 32/min.",
      ],
    },
    {
      kind: "findings",
      title: "Investigations",
      labs: [
        "WBC — 13.6 ×10⁹/L.",
        "Neutrophils — 84%.",
        "CRP — 78 mg/L.",
        "pH — 7.31.",
        "PaCO₂ — 58 mmHg.",
        "PaO₂ — 49 mmHg.",
        "HCO₃⁻ — 28 mmol/L.",
      ],
      studies: [
        "Chest X-ray: marked emphysema, flattened diaphragm domes, no new infiltrates.",
        "ECG: sinus tachycardia.",
      ],
      photos: [
        {
          kind: "ecg",
          caption: "12-lead ECG",
          alt: "12-lead electrocardiogram",
          image: { src: "/cases/case-4/ecg.jpg", width: 1191, height: 650 },
          audio: "/cases/case-4/auscultation.mp3",
        },
        {
          kind: "scheme",
          caption: "Signs of emphysema on a chest X-ray (diagram)",
          alt: "Diagram of the radiological signs of pulmonary emphysema",
          image: { src: "/cases/case-4/emphysema-scheme.jpg", width: 1050, height: 573 },
        },
        {
          kind: "xray",
          caption: "Chest X-ray",
          alt: "Two chest radiographs",
          image: { src: "/cases/case-4/xray.jpg", width: 1377, height: 751 },
        },
      ],
    },
    diagnosisAndTreatmentStep(4, "en", [
      {
        id: "t1",
        text: "Which respiratory support is indicated first for this patient with respiratory acidosis (pH = 7.31) and marked hypercapnia (PaCO₂ = 58 mmHg) on controlled oxygen therapy?",
        correctId: "b",
        options: [
          { id: "a", label: "High-flow 100% O₂ via a mask with a reservoir bag" },
          {
            id: "b",
            label: "Non-invasive ventilation (NIV / BiPAP)",
            feedback:
              "In acute hypercapnic respiratory failure (pH < 7.35, PaCO₂ > 45 mmHg), NIV is the first-line method.",
          },
          { id: "c", label: "Immediate invasive mechanical ventilation with endotracheal intubation" },
          { id: "d", label: "Stop all oxygen therapy" },
          { id: "e", label: "Humidified oxygen inhalations via sedation" },
        ],
      },
      {
        id: "t2",
        text: "What is the target oxygen saturation (SpO₂) during oxygen therapy in a patient with COPD at risk of hypercapnic coma?",
        correctId: "b",
        options: [
          { id: "a", label: "SpO₂ 95–100%" },
          { id: "b", label: "SpO₂ 88–92%", feedback: "Controlled oxygen therapy to prevent hypoventilation." },
          { id: "c", label: "SpO₂ < 85%" },
          { id: "d", label: "SpO₂ 93–96%" },
          { id: "e", label: "SpO₂ 98–100%" },
        ],
      },
      {
        id: "t3",
        text: "What dose and duration of systemic corticosteroids (SCS) are recommended for a hospitalised patient with a severe COPD exacerbation?",
        correctId: "a",
        options: [
          {
            id: "a",
            label: "Prednisolone 40 mg/day orally (or IV) for 5 days",
            feedback: "The optimal short course of systemic corticosteroids.",
          },
          { id: "b", label: "Prednisolone 5 mg/day orally for 6 months" },
          { id: "c", label: "Dexamethasone 8 mg/day for 30 days" },
          { id: "d", label: "Methylprednisolone pulse therapy 1000 mg IV for 3 days" },
          { id: "e", label: "Corticosteroids are not indicated in severe COPD" },
        ],
      },
      {
        id: "t4",
        text: "Which inhaled bronchodilator combination is the first-line nebuliser therapy to relieve acute bronchospasm in this patient?",
        correctId: "a",
        options: [
          {
            id: "a",
            label: "Salbutamol + ipratropium bromide",
            feedback: "Short-acting inhaled bronchodilators via nebuliser.",
          },
          { id: "b", label: "Budesonide + formoterol" },
          { id: "c", label: "Fluticasone + salmeterol" },
          { id: "d", label: "Theophylline + papaverine" },
          { id: "e", label: "Berotec + IV aminophylline" },
        ],
      },
      {
        id: "t5",
        text: "What long-term maintenance therapy is indicated for Mrs Sadykova after the exacerbation resolves (COPD, GOLD 4, a history of frequent severe exacerbations)?",
        correctId: "b",
        options: [
          { id: "a", label: "A long-acting β₂-agonist as monotherapy" },
          {
            id: "b",
            label: "Combination therapy LAMA + LABA (or LAMA + LABA + ICS if eosinophils are high)",
            feedback:
              "Maintenance therapy is LAMA/LABA; with blood eosinophilia (≥ 300 cells/µL) an ICS is added (triple therapy).",
          },
          { id: "c", label: "Inhaled corticosteroid monotherapy" },
          { id: "d", label: "Continuous mucolytics without bronchodilators" },
          { id: "e", label: "Continuous oral corticosteroids" },
        ],
      },
    ]),
  ],
  takeaway:
    "COPD, GOLD 4, severe exacerbation. Acute-on-chronic hypercapnic respiratory failure. Pulmonary emphysema.",
};
