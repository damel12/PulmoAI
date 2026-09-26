// Перевод кейса №1 (английский). Оригинал — ../ru/case-1.ts.
// Сгенерирован из оригинала: структура, ответы и снимки совпадают. Текст проверяет врач заказчика.
import { diagnosisAndTreatmentStep } from "../diagnoses";
import type { ClinicalCase } from "../types";

export const case1: ClinicalCase = {
  slug: "case-1",
  number: 1,
  title: "Fever and productive cough",
  topic: "Fever, cough",
  summary:
    "54 years old. Five days of fever after getting chilled, cough with yellow-green sputum, right-sided chest pain, SpO₂ 92%.",
  difficulty: "basic",
  minutes: 10,
  patient: {
    name: "Elena Sergeevna Ivanova",
    age: 54,
    sex: "female",
    admission: "Hospital admission",
    photo: { src: "/cases/case-1/patient.jpg", width: 1408, height: 768 },
  },
  cover: { src: "/cases/case-1/xray.jpg", width: 675, height: 618 },
  steps: [
    {
      kind: "history",
      title: "History and examination",
      vitals: [
        { label: "BP", value: "128/78", unit: "mmHg" },
        { label: "Pulse", value: "96", unit: "/min" },
        { label: "SpO₂", value: "92", unit: "% on room air" },
        { label: "Temperature", value: "38.4", unit: "°C" },
        { label: "RR", value: "24", unit: "/min" },
      ],
      complaints: [
        "Fever up to 38.8 °C, chills, productive cough with yellowish-green sputum, shortness of breath on moderate exertion, general weakness, pain in the right side of the chest that worsens on deep breathing and coughing.",
      ],
      anamnesis:
        "Acute onset 5 days ago after getting chilled: weakness, chills, fever up to 38 °C. On day 2 a cough with sputum developed, and on day 4 her shortness of breath worsened. She took paracetamol on her own without significant improvement. Admitted because of persistent fever and hypoxaemia.",
      lifeHistory:
        "Chronic conditions: grade I arterial hypertension. Non-smoker. No previous surgery. Denies contact with tuberculosis patients. Vaccinations up to date for age.",
      allergy: "Denies drug and food allergies.",
      exam: [
        "Moderately severe condition. Alert and oriented. Skin slightly pale, moderately moist. Normal chest shape. RR 24/min. Percussion: dullness over the lower right lung fields. Auscultation over the right lower lobe: diminished breath sounds, fine moist crackles and crepitations. Heart sounds clear, regular rhythm.",
      ],
    },
    {
      kind: "findings",
      title: "Investigations",
      labs: [
        "CBC: WBC 14.8 ×10⁹/L, neutrophils 86%, lymphocytes 9%, Hb 126 g/L, platelets 382 ×10⁹/L.",
        "CRP — 168 mg/L.",
        "Procalcitonin — 0.72 ng/mL.",
        "Creatinine — 78 µmol/L.",
        "Urea — 6.1 mmol/L.",
      ],
      studies: [
        "Chest X-ray: infiltration of the lung tissue in the right lower lobe, mainly projected over S9–S10. The right hilum is enlarged. No pleural effusion.",
      ],
      photos: [
        {
          kind: "ecg",
          caption: "12-lead ECG",
          alt: "12-lead electrocardiogram",
          image: { src: "/cases/case-1/ecg.jpg", width: 1205, height: 657 },
          audio: "/cases/case-1/auscultation.mp3",
        },
        {
          kind: "xray",
          caption: "Chest X-ray, PA view",
          alt: "Chest radiograph, frontal view",
          image: { src: "/cases/case-1/xray.jpg", width: 675, height: 618 },
          annotated: { src: "/cases/case-1/xray-annotated.jpg", width: 725, height: 619 },
        },
      ],
    },
    diagnosisAndTreatmentStep(1, "en", [
      {
        id: "t1",
        text: "Which antibiotic regimen is the most appropriate initial empirical therapy for this patient on admission to a general ward?",
        correctId: "b",
        options: [
          { id: "a", label: "Amoxicillin/clavulanate 1.2 g IV three times daily as monotherapy" },
          {
            id: "b",
            label: "Ceftriaxone 2.0 g IV once daily + azithromycin 500 mg/day orally",
            feedback:
              "For moderately severe community-acquired pneumonia in hospital, the standard is a third-generation cephalosporin / protected penicillin combined with a macrolide.",
          },
          { id: "c", label: "Ciprofloxacin 400 mg IV twice daily + vancomycin 1.0 g IV twice daily" },
          { id: "d", label: "Levofloxacin 500 mg IV once daily as monotherapy" },
          { id: "e", label: "Amikacin 15 mg/kg/day IV + metronidazole 500 mg IV three times daily" },
        ],
      },
      {
        id: "t2",
        text: "The patient has been started on supplemental oxygen via nasal cannula because her baseline SpO₂ was 92% on room air. What target oxygen saturation (SpO₂) should be maintained in this patient, who has no severe COPD?",
        correctId: "c",
        options: [
          { id: "a", label: "SpO₂ 88–92%" },
          { id: "b", label: "SpO₂ 90–92%" },
          {
            id: "c",
            label: "SpO₂ ≥ 94%",
            feedback: "For patients without COPD or a risk of hypercapnia, the target oxygenation level is 94% or higher.",
          },
          { id: "d", label: "SpO₂ strictly 100%" },
          { id: "e", label: "SpO₂ ≥ 98%" },
        ],
      },
      {
        id: "t3",
        text: "Why has a macrolide (azithromycin) been added to the β-lactam antibiotic (ceftriaxone) in this patient's regimen?",
        correctId: "b",
        options: [
          { id: "a", label: "To enhance the activity of ceftriaxone against Staphylococcus aureus (S. aureus)" },
          {
            id: "b",
            label:
              "To cover atypical pathogens (Legionella spp., Mycoplasma pneumoniae, Chlamydia pneumoniae) and for its anti-inflammatory/immunomodulatory effect",
            feedback:
              "The macrolide covers intracellular (atypical) pathogens (Legionella, Mycoplasma, Chlamydia) and has an immunomodulatory effect.",
          },
          { id: "c", label: "To prevent fungal superinfection (Candida spp.)" },
          { id: "d", label: "To reduce the risk of anaerobic lung infection" },
          { id: "e", label: "To speed up the renal elimination of ceftriaxone" },
        ],
      },
      {
        id: "t4",
        text: "How long after starting initial antibiotic therapy is the mandatory first clinical assessment of its effectiveness performed?",
        correctId: "c",
        options: [
          { id: "a", label: "After 12–24 hours" },
          { id: "b", label: "After 24–36 hours" },
          { id: "c", label: "After 48–72 hours", feedback: "The effectiveness of initial antibiotic therapy is assessed after 2–3 days." },
          { id: "d", label: "On days 5–7" },
          { id: "e", label: "After the whole course of antibiotics is completed" },
        ],
      },
      {
        id: "t5",
        text: "Which decision about step-down therapy (switching from IV ceftriaxone to an oral antibiotic) is the most appropriate?",
        correctId: "b",
        options: [
          { id: "a", label: "Switching to an oral antibiotic is possible only after exactly 10 days of IV therapy" },
          {
            id: "b",
            label:
              "Switch to oral therapy once the temperature has stably normalised (< 37.5 °C for 24–48 h), shortness of breath and cough have decreased and the patient is haemodynamically stable",
            feedback:
              "Switching to oral therapy (step-down therapy) is done once clinical stability is reached and the temperature has normalised (< 37.5 °C).",
          },
          { id: "c", label: "Switching to oral therapy is possible right after the first fever-free day, regardless of symptoms" },
          { id: "d", label: "Step-down therapy is not used in hospitalised patients" },
          { id: "e", label: "Switching to oral therapy is possible only after the ESR and the X-ray picture have normalised" },
        ],
      },
    ]),
  ],
  takeaway:
    "Community-acquired right lower lobe pneumonia, moderate severity, bacterial etiology, grade I respiratory failure.",
};
