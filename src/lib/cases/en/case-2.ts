// Перевод кейса №2 (английский). Оригинал — ../ru/case-2.ts.
// Сгенерирован из оригинала: структура, ответы и снимки совпадают. Текст проверяет врач заказчика.
import { diagnosisAndTreatmentStep } from "../diagnoses";
import type { ClinicalCase } from "../types";

export const case2: ClinicalCase = {
  slug: "case-2",
  number: 2,
  title: "High fever and rusty sputum",
  topic: "Fever, shortness of breath",
  summary:
    "67 years old, type 2 diabetes. Four days of fever up to 39 °C, cough with rusty sputum, shortness of breath at rest. Amoxicillin at home didn't help.",
  difficulty: "medium",
  minutes: 10,
  patient: {
    name: "Nurlan Erlanovich Akhmetov",
    age: 67,
    sex: "male",
    admission: "Hospital admission",
    photo: { src: "/cases/case-2/patient.jpg", width: 1408, height: 768 },
  },
  cover: { src: "/cases/case-2/xray.jpg", width: 835, height: 556 },
  steps: [
    {
      kind: "history",
      title: "History and examination",
      vitals: [
        { label: "BP", value: "145/85", unit: "mmHg" },
        { label: "Pulse", value: "108", unit: "/min" },
        { label: "SpO₂", value: "89", unit: "% on room air" },
        { label: "Temperature", value: "39.1", unit: "°C" },
        { label: "RR", value: "28", unit: "/min" },
      ],
      complaints: [
        "High fever, chills, marked weakness, cough with rusty sputum, shortness of breath at rest, pain in the left side of the chest on breathing.",
      ],
      anamnesis:
        "Ill for 4 days. The illness began with chills and fever up to 39 °C. The next day a cough with sputum developed. Over the last 24 hours his shortness of breath has been increasing. He took paracetamol and amoxicillin 500 mg twice daily on his own without significant effect.",
      lifeHistory:
        "Grade II arterial hypertension. Type 2 diabetes mellitus on oral glucose-lowering therapy. Former smoker — about 25 pack-years. Denies chronic lung disease.",
      allergy: "Reports no drug allergies.",
      exam: [
        "Moderately severe condition, bordering on severe. Semi-sitting position. Pale skin. Acrocyanosis. RR 28/min. Auscultation over the lower left lung: bronchial breathing, crepitations, fine moist crackles. Muffled heart sounds, tachycardia.",
      ],
    },
    {
      kind: "findings",
      title: "Investigations",
      labs: [
        "WBC — 18.2 ×10⁹/L.",
        "Neutrophils — 91%.",
        "CRP — 286 mg/L.",
        "Procalcitonin — 3.2 ng/mL.",
        "Glucose — 10.4 mmol/L.",
        "Creatinine — 102 µmol/L.",
      ],
      studies: [
        "Chest X-ray: extensive infiltrative opacity of the left lower lobe with an air bronchogram. No pleural effusion.",
      ],
      photos: [
        {
          kind: "ecg",
          caption: "12-lead ECG",
          alt: "12-lead electrocardiogram",
          image: { src: "/cases/case-2/ecg.jpg", width: 1270, height: 692 },
          audio: "/cases/case-2/auscultation.mp3",
        },
        {
          kind: "xray",
          caption: "Chest X-ray, PA and lateral views",
          alt: "Chest radiographs, frontal and lateral views",
          image: { src: "/cases/case-2/xray.jpg", width: 835, height: 556 },
          annotated: { src: "/cases/case-2/xray-annotated.jpg", width: 782, height: 668 },
        },
      ],
    },
    diagnosisAndTreatmentStep(2, "en", [
      {
        id: "t1",
        text: "Which initial empirical antibiotic regimen is indicated for a 67-year-old patient admitted with severe community-acquired pneumonia and concomitant diabetes?",
        correctId: "b",
        options: [
          { id: "a", label: "Amoxicillin 500 mg orally three times daily" },
          {
            id: "b",
            label: "Ceftriaxone 2 g IV once daily + azithromycin 500 mg IV once daily",
            feedback:
              "Severe community-acquired pneumonia in an elderly patient with diabetes calls for combined parenteral antibiotic therapy.",
          },
          { id: "c", label: "Gentamicin 80 mg IM twice daily" },
          { id: "d", label: "Metronidazole 500 mg IV three times daily" },
          { id: "e", label: "Doxycycline 100 mg orally twice daily" },
        ],
      },
      {
        id: "t2",
        text: "What target oxygen saturation (SpO₂) should be maintained during oxygen therapy in this patient with SpO₂ 89% and grade II respiratory failure?",
        correctId: "c",
        options: [
          { id: "a", label: "SpO₂ 85–88%" },
          { id: "b", label: "SpO₂ 88–92%" },
          {
            id: "c",
            label: "SpO₂ ≥ 94%",
            feedback: "In a patient with severe pneumonia and no severe COPD, the target saturation is ≥ 94%.",
          },
          { id: "d", label: "SpO₂ strictly 100%" },
          { id: "e", label: "SpO₂ 90–91%" },
        ],
      },
      {
        id: "t3",
        text: "What is the most appropriate way to correct the blood glucose level (10.4 mmol/L) in a patient admitted with severe pneumonia and type 2 diabetes?",
        correctId: "b",
        options: [
          { id: "a", label: "Increase the dose of oral glucose-lowering drugs" },
          {
            id: "b",
            label: "Temporary switch to insulin therapy (or short-acting insulin on a schedule) with glucose monitoring",
            feedback: "During an acute severe infection with hyperglycaemia, temporary insulin therapy is preferred.",
          },
          { id: "c", label: "Stop all glucose-lowering drugs until discharge" },
          { id: "d", label: "Prescribe a strict protein diet without medication" },
          { id: "e", label: "Prescribe biguanides (metformin) at the maximum dose" },
        ],
      },
      {
        id: "t4",
        text: "Which measure to prevent thromboembolic complications is best justified in this hospitalised 67-year-old patient with severe pneumonia and limited mobility?",
        correctId: "a",
        options: [
          {
            id: "a",
            label: "Low-molecular-weight heparin (LMWH) at a prophylactic dose",
            feedback:
              "All patients with severe infection, immobilisation and age over 60 should receive LMWH to prevent DVT/PE.",
          },
          { id: "b", label: "Acetylsalicylic acid 500 mg/day" },
          { id: "c", label: "Warfarin with INR monitoring" },
          { id: "d", label: "No prophylaxis is needed because the patient has not had surgery" },
          { id: "e", label: "Strict bed rest without medication" },
        ],
      },
      {
        id: "t5",
        text: "At what interval after starting initial antibiotic therapy is the mandatory first assessment of its clinical effectiveness performed?",
        correctId: "c",
        options: [
          { id: "a", label: "After 12 hours" },
          { id: "b", label: "After 24 hours" },
          { id: "c", label: "After 48–72 hours", feedback: "The standard time to assess the effect of antibiotic therapy." },
          { id: "d", label: "After 7 days" },
          { id: "e", label: "At the end of a 14-day course" },
        ],
      },
    ]),
  ],
  takeaway:
    "Community-acquired left lower lobe pneumonia, severe course, probably pneumococcal etiology. Grade II respiratory failure. Comorbidities: type 2 diabetes mellitus, grade II arterial hypertension.",
};
