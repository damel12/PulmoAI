// Перевод кейса №3 (английский). Оригинал — ../ru/case-3.ts.
// Сгенерирован из оригинала: структура, ответы и снимки совпадают. Текст проверяет врач заказчика.
import { diagnosisAndTreatmentStep } from "../diagnoses";
import type { ClinicalCase } from "../types";

export const case3: ClinicalCase = {
  slug: "case-3",
  number: 3,
  title: "Worsening breathlessness in a smoker",
  topic: "Breathlessness, sputum",
  summary:
    "62 years old, 40 pack-years, a former welder. Breathlessness has been getting worse for three days, and his sputum is more abundant and purulent. Salbutamol helps only briefly.",
  difficulty: "medium",
  minutes: 10,
  patient: {
    name: "Viktor Ivanovich Petrov",
    age: 62,
    sex: "male",
    occupation: "Welder",
    admission: "Hospital admission",
    photo: { src: "/cases/case-3/patient.jpg", width: 1408, height: 768 },
  },
  cover: { src: "/cases/case-3/xray-1.jpg", width: 695, height: 753 },
  steps: [
    {
      kind: "history",
      title: "History and examination",
      vitals: [
        { label: "BP", value: "135/80", unit: "mmHg" },
        { label: "Pulse", value: "94", unit: "/min" },
        { label: "SpO₂", value: "88", unit: "% on room air" },
        { label: "Temperature", value: "37.3", unit: "°C" },
        { label: "RR", value: "25", unit: "/min" },
      ],
      complaints: [
        "Increasing breathlessness, cough with a larger amount of sputum, purulent sputum, wheezing, reduced exercise tolerance.",
      ],
      anamnesis:
        "COPD was diagnosed 7 years ago. Over the last 3 days he has noticed increasing breathlessness, more sputum and a change in its colour to yellow-green. He used salbutamol more often than usual; the effect was short-lived.",
      lifeHistory:
        "Has smoked 1 pack a day for 40 years — about 40 pack-years. Worked as a welder. Arterial hypertension. Two COPD exacerbations in the past year, one of which required hospitalisation.",
      allergy: "Denies allergies.",
      exam: [
        "Moderately severe condition. Forced position. Emphysematous (barrel) chest. Harsh breath sounds, markedly diminished in the lower zones. Scattered dry wheezes on both sides. Prolonged expiration. RR 25/min.",
      ],
    },
    {
      kind: "findings",
      title: "Investigations",
      labs: [
        "WBC — 12.4 ×10⁹/L.",
        "Neutrophils — 79%.",
        "CRP — 64 mg/L.",
        "Haemoglobin — 168 g/L.",
      ],
      studies: [
        "Spirometry after stabilisation: FEV1 — 48% of predicted, FEV1/FVC — 0.55.",
        "Chest X-ray: signs of emphysema, increased lucency of the lung fields, no focal or infiltrative changes.",
      ],
      photos: [
        {
          kind: "ecg",
          caption: "12-lead ECG",
          alt: "12-lead electrocardiogram",
          image: { src: "/cases/case-3/ecg.jpg", width: 1291, height: 704 },
          audio: "/cases/case-3/auscultation.mp3",
        },
        {
          kind: "xray",
          caption: "Chest X-ray, PA view",
          alt: "Chest radiograph, frontal view",
          image: { src: "/cases/case-3/xray-1.jpg", width: 695, height: 753 },
        },
        {
          kind: "xray",
          caption: "Chest X-ray",
          alt: "Two chest radiographs",
          image: { src: "/cases/case-3/xray-2.jpg", width: 1377, height: 751 },
        },
      ],
    },
    diagnosisAndTreatmentStep(3, "en", [
      {
        id: "t1",
        text: "What is the target saturation (SpO₂) during low-flow oxygen therapy in Mr Petrov, who has a COPD exacerbation and grade II respiratory failure?",
        correctId: "c",
        options: [
          { id: "a", label: "SpO₂ ≥ 98%" },
          { id: "b", label: "SpO₂ 95–98%" },
          {
            id: "c",
            label: "SpO₂ 88–92%",
            feedback:
              "In COPD, excess oxygen can depress the respiratory centre and lead to hypercapnia, so the target is 88–92%.",
          },
          { id: "d", label: "SpO₂ 80–85%" },
          { id: "e", label: "SpO₂ 100%" },
        ],
      },
      {
        id: "t2",
        text: "Which bronchodilator combination is preferred via nebuliser to relieve bronchial obstruction in this patient during the exacerbation?",
        correctId: "a",
        options: [
          {
            id: "a",
            label: "Salbutamol + ipratropium bromide",
            feedback: "A SABA + SAMA combination via nebuliser is the gold standard for COPD exacerbations.",
          },
          { id: "b", label: "Theophylline + aminophylline" },
          { id: "c", label: "Salmeterol + fluticasone" },
          { id: "d", label: "Formoterol + budesonide" },
          { id: "e", label: "IV aminophylline + atropine" },
        ],
      },
      {
        id: "t3",
        text: "What dose and duration of systemic corticosteroids (SCS) are recommended for a patient with a COPD exacerbation requiring hospital care?",
        correctId: "b",
        options: [
          { id: "a", label: "Prednisolone 120 mg/day IV for 30 days" },
          {
            id: "b",
            label: "Prednisolone 40 mg/day orally (or IV equivalent) for 5 days",
            feedback: "A short course of systemic corticosteroids shortens recovery and reduces the risk of early relapse.",
          },
          { id: "c", label: "Dexamethasone 24 mg/day for 14 days" },
          { id: "d", label: "Hydrocortisone 500 mg/day for 21 days" },
          { id: "e", label: "Systemic corticosteroids are contraindicated in COPD" },
        ],
      },
      {
        id: "t4",
        text: "What was the key indication for prescribing antibiotic therapy (amoxicillin/clavulanate) to Mr Petrov?",
        correctId: "b",
        options: [
          { id: "a", label: "Dry cough" },
          {
            id: "b",
            label: "Purulent sputum and increased breathlessness (Anthonisen criteria)",
            feedback:
              "Purulent sputum plus increased breathlessness/sputum volume (Anthonisen criteria) is a direct indication for antibiotic therapy.",
          },
          { id: "c", label: "Blood pressure rising to 135/80 mmHg" },
          { id: "d", label: "FEV1 recovering to 48%" },
          { id: "e", label: "A smoking history of more than 40 pack-years" },
        ],
      },
      {
        id: "t5",
        text: "What maintenance therapy is indicated for Mr Petrov after the exacerbation resolves (COPD, GOLD 3, frequent exacerbations)?",
        correctId: "b",
        options: [
          { id: "a", label: "Short-acting β₂-agonists as needed, as monotherapy" },
          {
            id: "b",
            label: "A long-acting antimuscarinic + a long-acting β₂-agonist (LAMA + LABA)",
            feedback:
              "Patients with GOLD 3 and frequent exacerbations need dual long-acting bronchodilator therapy.",
          },
          { id: "c", label: "Inhaled corticosteroid monotherapy" },
          { id: "d", label: "Continuous low-dose systemic steroids" },
          { id: "e", label: "Short courses of antibiotics every 2 months" },
        ],
      },
    ]),
  ],
  takeaway:
    "COPD, frequent-exacerbator phenotype, GOLD 3, infectious exacerbation. Grade II respiratory failure. Pulmonary emphysema. Nicotine dependence.",
};
