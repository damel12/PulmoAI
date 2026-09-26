// Перевод кейса №5 (английский). Оригинал — ../ru/case-5.ts.
// Сгенерирован из оригинала: структура, ответы и снимки совпадают. Текст проверяет врач заказчика.
import { diagnosisAndTreatmentStep } from "../diagnoses";
import type { ClinicalCase } from "../types";

export const case5: ClinicalCase = {
  slug: "case-5",
  number: 5,
  title: "Prolonged cough and weight loss",
  topic: "Cough for over 4 weeks",
  summary:
    "39 years old, a driver. Cough for over a month, low-grade evening fever, night sweats, 5 kg weight loss in 2 months. Shared a dormitory with someone treated for tuberculosis.",
  difficulty: "medium",
  minutes: 10,
  patient: {
    name: "Ermek Bauyrzhanovich Kasymov",
    age: 39,
    sex: "male",
    occupation: "Driver",
    admission: "Hospital admission",
    photo: { src: "/cases/case-5/patient.jpg", width: 1408, height: 768 },
  },
  cover: { src: "/cases/case-5/ct-afb.jpg", width: 1377, height: 751 },
  steps: [
    {
      kind: "history",
      title: "History and examination",
      vitals: [
        { label: "BP", value: "118/75", unit: "mmHg" },
        { label: "Pulse", value: "92", unit: "/min" },
        { label: "SpO₂", value: "95", unit: "% on room air" },
        { label: "Temperature", value: "37.5", unit: "°C" },
        { label: "RR", value: "20", unit: "/min" },
      ],
      complaints: [
        "Cough for more than 4 weeks, mostly with a small amount of mucoid sputum, low-grade fever mainly in the evenings, night sweats, weakness, reduced appetite, weight loss of about 5 kg in 2 months.",
      ],
      anamnesis:
        "About a month ago a dry cough appeared and gradually became productive. For the last two weeks he has had evening temperature rises and night sweats. He took cough medicines on his own without effect. Changes on a chest X-ray were found during a check-up at his local clinic.",
      lifeHistory:
        "Works as a driver. Has smoked for about 15 years. Frequent acute respiratory viral infections in the past. Contact with a tuberculosis patient cannot be ruled out — a few months ago he lived in the same dormitory as a person being treated for tuberculosis.",
      allergy: "No significant allergy history.",
      exam: [
        "Relatively satisfactory condition. Pale skin. No peripheral oedema. Diminished breath sounds over the right upper zone, occasional fine moist crackles.",
      ],
    },
    {
      kind: "findings",
      title: "Investigations",
      labs: [
        "CBC: Hb 118 g/L, WBC 9.8 ×10⁹/L, lymphocytes 19%, ESR 48 mm/h.",
        "CRP — 32 mg/L.",
        "ALT — 29 U/L, AST — 27 U/L.",
      ],
      studies: [
        "Chest CT: infiltrative changes with areas of cavitation in the right upper lobe, multiple small foci of bronchogenic dissemination.",
        "Sputum smear microscopy — AFB positive.",
        "Molecular genetic testing of sputum — M. tuberculosis detected, no rifampicin resistance detected.",
      ],
      photos: [
        {
          kind: "ct",
          caption: "Chest CT and sputum smear for AFB",
          alt: "Chest CT slice and sputum smear microscopy",
          image: { src: "/cases/case-5/ct-afb.jpg", width: 1377, height: 751 },
          audio: "/cases/case-5/auscultation.mp3",
        },
      ],
    },
    diagnosisAndTreatmentStep(5, "en", [
      {
        id: "t1",
        text: "Which combination of first-line anti-tuberculosis drugs is standard in the intensive phase for this patient with newly diagnosed drug-susceptible pulmonary tuberculosis?",
        correctId: "b",
        options: [
          { id: "a", label: "Isoniazid + rifampicin + levofloxacin + amikacin" },
          {
            id: "b",
            label: "Isoniazid + rifampicin + pyrazinamide + ethambutol",
            feedback:
              "The standard intensive-phase regimen for newly diagnosed drug-susceptible pulmonary tuberculosis includes the 4 core first-line drugs: isoniazid (H), rifampicin (R), pyrazinamide (Z) and ethambutol (E) (the HRZE regimen).",
          },
          { id: "c", label: "Isoniazid + rifampicin + streptomycin + capreomycin" },
          { id: "d", label: "Pyrazinamide + ethambutol + moxifloxacin + bedaquiline" },
          { id: "e", label: "Isoniazid + pyrazinamide + ofloxacin + linezolid" },
        ],
      },
      {
        id: "t2",
        text: "Which sense organ or system must be monitored when ethambutol is included in the regimen?",
        correctId: "b",
        options: [
          { id: "a", label: "Hearing and the vestibular system (audiometry)" },
          {
            id: "b",
            label: "Vision (visual acuity and colour vision)",
            feedback:
              "Ethambutol can cause a specific complication — retrobulbar optic neuritis, which reduces visual acuity and impairs colour perception (especially green and red). An ophthalmologist's examination is required before and during treatment.",
          },
          { id: "c", label: "Tactile sensation in the lower limbs" },
          { id: "d", label: "Smell and taste" },
          { id: "e", label: "Electrocardiogram (QTc interval)" },
        ],
      },
      {
        id: "t3",
        text: "When combined anti-tuberculosis therapy is prescribed (particularly isoniazid, rifampicin and pyrazinamide), which laboratory monitoring is critical for early detection of the most common specific adverse effect?",
        correctId: "b",
        options: [
          { id: "a", label: "Serum total protein and albumin" },
          {
            id: "b",
            label: "Liver enzymes (ALT, AST) and bilirubin",
            feedback:
              "Isoniazid, rifampicin and pyrazinamide are hepatotoxic, so regular monitoring of ALT, AST and bilirubin is needed to detect drug-induced liver injury early.",
          },
          { id: "c", label: "Blood amylase and lipase" },
          { id: "d", label: "Glucose and glycated haemoglobin" },
          { id: "e", label: "Electrolytes (potassium, sodium)" },
        ],
      },
      {
        id: "t4",
        text: "To prevent peripheral neuropathy caused by isoniazid, the patient should also receive:",
        correctId: "b",
        options: [
          { id: "a", label: "Vitamin B1 (thiamine)" },
          {
            id: "b",
            label: "Vitamin B6 (pyridoxine)",
            feedback:
              "Isoniazid interferes with the metabolism of pyridoxine (vitamin B6), which can lead to neurotoxicity and peripheral polyneuropathy. Pyridoxine is given for prevention.",
          },
          { id: "c", label: "Vitamin C (ascorbic acid)" },
          { id: "d", label: "Vitamin B12 (cyanocobalamin)" },
          { id: "e", label: "Vitamin E (tocopherol)" },
        ],
      },
      {
        id: "t5",
        text: "Which anti-tuberculosis regimen is usually prescribed in the continuation phase if the response to treatment is good and the drug susceptibility of M. tuberculosis is confirmed?",
        correctId: "b",
        options: [
          { id: "a", label: "Isoniazid + ethambutol" },
          {
            id: "b",
            label: "Isoniazid + rifampicin",
            feedback:
              "In newly diagnosed drug-susceptible pulmonary tuberculosis, the continuation phase uses two drugs — isoniazid and rifampicin (HR).",
          },
          { id: "c", label: "Rifampicin + pyrazinamide" },
          { id: "d", label: "Pyrazinamide + ethambutol" },
          { id: "e", label: "Isoniazid + levofloxacin" },
        ],
      },
    ]),
  ],
  takeaway:
    "Newly diagnosed pulmonary tuberculosis: infiltrative tuberculosis of the right upper lobe, cavitation and bronchogenic dissemination phase, bacterial excretion MTB(+), no rifampicin resistance detected.",
};
