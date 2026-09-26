// Список диагнозов из материалов заказчика («Сайт пульмо айтишникке.docx»).
// На шаге «Диагноз» студент выбирает из всего списка: у первых пяти есть кейсы,
// остальные служат близкими по смыслу неверными вариантами.
// Русский — оригинал заказчика; казахский и английский — перевод, который проверяет врач.
import type { Locale } from "../i18n/config";
import type { QuestionsStep, SingleQuestion } from "./types";

export const DIAGNOSES: Record<Locale, readonly string[]> = {
  ru: [
    "Внебольничная правосторонняя нижнедолевая пневмония, средней степени тяжести, бактериальной этиологии, ДН I степени.",
    "Внебольничная левосторонняя нижнедолевая пневмония, тяжёлое течение, вероятно пневмококковой этиологии. ДН II степени. Сопутствующие: сахарный диабет 2 типа, артериальная гипертензия II степени.",
    "ХОБЛ, фенотип с частыми обострениями, GOLD 3, обострение инфекционного характера. ДН II степени. Эмфизема лёгких. Никотиновая зависимость.",
    "ХОБЛ, GOLD 4, обострение тяжёлой степени. Острая на фоне хронической гиперкапническая дыхательная недостаточность. Эмфизема лёгких.",
    "Впервые выявленный туберкулёз лёгких: инфильтративный туберкулёз верхней доли правого лёгкого, фаза распада и бронхогенного обсеменения, бактериовыделение МБТ(+), лекарственная устойчивость к рифампицину не выявлена.",
    "Внебольничная полисегментарная пневмония в нижней доле правого лёгкого (S8, S9, S10) и средней доле правого лёгкого, тяжёлое течение, бактериальной этиологии.",
    "Внебольничная субтотальная левосторонняя пневмония, тяжёлое течение, атипичной этиологии. ДН I степени.",
    "Нозокомиальная (госпитальная) правосторонняя нижнедолевая пневмония, вентилятор-ассоциированная, тяжёлое течение. ДН III степени.",
    "Внебольничная аспирационная пневмония нижней доли правого лёгкого, средней степени тяжести, смешанной (аэробно-анаэробной) этиологии. ДН I степени.",
    "ХОБЛ, выраженная бронхиальная обструкция (GOLD 3, группа E), обострение среднетяжёлой степени, вероятнее всего вирусной этиологии. Хроническая дыхательная недостаточность (ХДН) II степени. Диффузная эмфизема лёгких.",
    "ХОБЛ, крайне тяжёлая бронхиальная обструкция (GOLD 4, группа E), стабильное состояние. Хроническая гиперкапническая дыхательная недостаточность (ХДН III степени). Вторичная лёгочная гипертензия. Хроническое лёгочное сердце, стадия компенсации.",
    "ХОБЛ, умеренная бронхиальная обструкция (GOLD 2, группа B), стабильное состояние. ХДН I степени. Пневмосклероз. Никотиновая зависимость (индекс курящего человека — 25 пачко-лет).",
    "Бронхиальная астма, аллергическая форма, персистирующее течение средней тяжести, частично контролируемая. ДН 0 степени. Бытовая и пыльцевая сенсибилизация.",
    "Бронхиальная астма, неаллергическая (аспириновая), тяжёлое персистирующее течение, неконтролируемая, обострение тяжёлой степени. Острая дыхательная недостаточность II степени.",
    "Бронхиальная астма, смешанная форма, тяжёлое персистирующее течение, неконтролируемая. Острая дыхательная недостаточность III степени.",
    "Впервые выявленный туберкулёз лёгких: диссеминированный туберкулёз лёгких в фазе инфильтрации и распада, МБТ(+), МЛУ (множественная лекарственная устойчивость к изониазиду и рифампицину). ДН II степени.",
    "Впервые выявленный туберкулёз лёгких: очаговый туберкулёз S1 и S2 правого лёгкого, фаза инфильтрации, МБТ(-). ДН 0 степени.",
    "Впервые выявленный туберкулёз лёгких: кавернозный туберкулёз верхней доли левого лёгкого, фаза обсеменения, МБТ(+), ШЛУ (широкая лекарственная устойчивость). ДН I степени.",
    "Вторичный туберкулёз лёгких: фиброзно-кавернозный туберкулёз верхних долей обоих лёгких, фаза прогрессирования и бронхогенного обсеменения, МБТ(+), пре-ШЛУ. ХДН II степени.",
    "Впервые выявленный туберкулёз лёгких: туберкулёма S6 правого лёгкого, фаза уплотнения, МБТ(-). ДН 0 степени.",
    "Туберкулёз внелёгочной локализации: экссудативный туберкулёзный плеврит справа, фаза разгара, МБТ(-). ДН I степени.",
    "Идиопатический лёгочный фиброз, прогрессирующее течение. ХДН II степени.",
    "Саркоидоз органов дыхания: II стадия (лимфаденопатия внутригрудных лимфатических узлов и паренхиматозные изменения лёгких), активная фаза. ХДН I степени.",
    "Экзогенный аллергический альвеолит (гиперчувствительный пневмонит), острая форма, средней степени тяжести. ДН I степени.",
    "Тромбоэмболия мелких ветвей лёгочной артерии (ТЭЛА), умеренный риск. ДН II степени.",
    "Спонтанный пневмоторакс справа, напряжённый (первичный). Острая дыхательная недостаточность II степени.",
  ],
  kk: [
    "Ауруханадан тыс оң жақты төменгі үлесті пневмония, орташа ауырлықтағы, бактериялық этиологиялы, I дәрежелі ТЖ.",
    "Ауруханадан тыс сол жақты төменгі үлесті пневмония, ауыр ағымды, пневмококкты этиологиясы болуы ықтимал. II дәрежелі ТЖ. Қосарланған аурулар: 2 типті қант диабеті, II дәрежелі артериялық гипертензия.",
    "ӨСОА, жиі өршитін фенотип, GOLD 3, инфекциялық сипаттағы өршу. II дәрежелі ТЖ. Өкпе эмфиземасы. Никотинге тәуелділік.",
    "ӨСОА, GOLD 4, ауыр дәрежелі өршу. Созылмалы аясындағы жедел гиперкапниялық тыныс алу жеткіліксіздігі. Өкпе эмфиземасы.",
    "Алғаш анықталған өкпе туберкулезі: оң өкпенің жоғарғы үлесінің инфильтративті туберкулезі, ыдырау және бронхогенді себілу фазасы, бактерия бөлу МБТ(+), рифампицинге дәрілік төзімділік анықталмаған.",
    "Оң өкпенің төменгі үлесінің (S8, S9, S10) және ортаңғы үлесінің ауруханадан тыс полисегментарлы пневмониясы, ауыр ағымды, бактериялық этиологиялы.",
    "Ауруханадан тыс субтоталды сол жақты пневмония, ауыр ағымды, атипті этиологиялы. I дәрежелі ТЖ.",
    "Нозокомиальды (ауруханаішілік) оң жақты төменгі үлесті пневмония, өкпені жасанды желдетумен байланысты, ауыр ағымды. III дәрежелі ТЖ.",
    "Оң өкпенің төменгі үлесінің ауруханадан тыс аспирациялық пневмониясы, орташа ауырлықтағы, аралас (аэробты-анаэробты) этиологиялы. I дәрежелі ТЖ.",
    "ӨСОА, айқын бронх обструкциясы (GOLD 3, E тобы), орташа ауыр дәрежелі өршу, вирустық этиологиясы болуы ықтимал. II дәрежелі созылмалы тыныс алу жеткіліксіздігі (СТЖ). Өкпенің диффузды эмфиземасы.",
    "ӨСОА, өте ауыр бронх обструкциясы (GOLD 4, E тобы), тұрақты жағдай. Созылмалы гиперкапниялық тыныс алу жеткіліксіздігі (III дәрежелі СТЖ). Екіншілік өкпе гипертензиясы. Созылмалы өкпелік жүрек, компенсация сатысы.",
    "ӨСОА, орташа бронх обструкциясы (GOLD 2, B тобы), тұрақты жағдай. I дәрежелі СТЖ. Пневмосклероз. Никотинге тәуелділік (темекі шегу индексі — 25 қорап-жыл).",
    "Бронх демікпесі, аллергиялық түрі, орташа ауырлықтағы персистирлеуші ағым, ішінара бақыланатын. 0 дәрежелі ТЖ. Тұрмыстық және тозаңдық сенсибилизация.",
    "Бронх демікпесі, аллергиялық емес (аспириндік), ауыр персистирлеуші ағым, бақыланбайтын, ауыр дәрежелі өршу. II дәрежелі жедел тыныс алу жеткіліксіздігі.",
    "Бронх демікпесі, аралас түрі, ауыр персистирлеуші ағым, бақыланбайтын. III дәрежелі жедел тыныс алу жеткіліксіздігі.",
    "Алғаш анықталған өкпе туберкулезі: инфильтрация және ыдырау фазасындағы диссеминирленген өкпе туберкулезі, МБТ(+), КДТ (изониазид пен рифампицинге көптік дәрілік төзімділік). II дәрежелі ТЖ.",
    "Алғаш анықталған өкпе туберкулезі: оң өкпенің S1 және S2 ошақты туберкулезі, инфильтрация фазасы, МБТ(-). 0 дәрежелі ТЖ.",
    "Алғаш анықталған өкпе туберкулезі: сол өкпенің жоғарғы үлесінің кавернозды туберкулезі, себілу фазасы, МБТ(+), КЛТ (кең ауқымды дәрілік төзімділік). I дәрежелі ТЖ.",
    "Екіншілік өкпе туберкулезі: екі өкпенің жоғарғы үлестерінің фиброзды-кавернозды туберкулезі, өршу және бронхогенді себілу фазасы, МБТ(+), пре-КЛТ. II дәрежелі СТЖ.",
    "Алғаш анықталған өкпе туберкулезі: оң өкпенің S6 туберкулемасы, тығыздалу фазасы, МБТ(-). 0 дәрежелі ТЖ.",
    "Өкпеден тыс орналасқан туберкулез: оң жақты экссудативті туберкулездік плеврит, айқын көріністер фазасы, МБТ(-). I дәрежелі ТЖ.",
    "Идиопатиялық өкпе фиброзы, үдемелі ағым. II дәрежелі СТЖ.",
    "Тыныс алу ағзаларының саркоидозы: II саты (кеуде ішілік лимфа түйіндерінің лимфаденопатиясы және өкпенің паренхималық өзгерістері), белсенді фаза. I дәрежелі СТЖ.",
    "Экзогенді аллергиялық альвеолит (жоғары сезімталдық пневмониті), жедел түрі, орташа ауырлықтағы. I дәрежелі ТЖ.",
    "Өкпе артериясының ұсақ тармақтарының тромбоэмболиясы (ӨАТЭ), орташа қауіп. II дәрежелі ТЖ.",
    "Оң жақты спонтанды пневмоторакс, кернеулі (біріншілік). II дәрежелі жедел тыныс алу жеткіліксіздігі.",
  ],
  en: [
    "Community-acquired right lower lobe pneumonia, moderate severity, bacterial etiology, grade I respiratory failure.",
    "Community-acquired left lower lobe pneumonia, severe course, probably pneumococcal etiology. Grade II respiratory failure. Comorbidities: type 2 diabetes mellitus, grade II arterial hypertension.",
    "COPD, frequent-exacerbator phenotype, GOLD 3, infectious exacerbation. Grade II respiratory failure. Pulmonary emphysema. Nicotine dependence.",
    "COPD, GOLD 4, severe exacerbation. Acute-on-chronic hypercapnic respiratory failure. Pulmonary emphysema.",
    "Newly diagnosed pulmonary tuberculosis: infiltrative tuberculosis of the right upper lobe, cavitation and bronchogenic dissemination phase, bacterial excretion MTB(+), no rifampicin resistance detected.",
    "Community-acquired multisegmental pneumonia of the right lower lobe (S8, S9, S10) and the right middle lobe, severe course, bacterial etiology.",
    "Community-acquired subtotal left-sided pneumonia, severe course, atypical etiology. Grade I respiratory failure.",
    "Nosocomial (hospital-acquired) right lower lobe pneumonia, ventilator-associated, severe course. Grade III respiratory failure.",
    "Community-acquired aspiration pneumonia of the right lower lobe, moderate severity, mixed (aerobic–anaerobic) etiology. Grade I respiratory failure.",
    "COPD, severe airflow obstruction (GOLD 3, group E), moderate exacerbation, most likely viral. Grade II chronic respiratory failure. Diffuse pulmonary emphysema.",
    "COPD, very severe airflow obstruction (GOLD 4, group E), stable. Chronic hypercapnic respiratory failure (grade III). Secondary pulmonary hypertension. Chronic cor pulmonale, compensated.",
    "COPD, moderate airflow obstruction (GOLD 2, group B), stable. Grade I chronic respiratory failure. Pneumosclerosis. Nicotine dependence (smoking index 25 pack-years).",
    "Bronchial asthma, allergic, moderate persistent, partly controlled. Grade 0 respiratory failure. Sensitisation to household allergens and pollen.",
    "Bronchial asthma, non-allergic (aspirin-exacerbated), severe persistent, uncontrolled, severe exacerbation. Grade II acute respiratory failure.",
    "Bronchial asthma, mixed type, severe persistent, uncontrolled. Grade III acute respiratory failure.",
    "Newly diagnosed pulmonary tuberculosis: disseminated pulmonary tuberculosis in the infiltration and cavitation phase, MTB(+), MDR (multidrug resistance to isoniazid and rifampicin). Grade II respiratory failure.",
    "Newly diagnosed pulmonary tuberculosis: focal tuberculosis of right S1 and S2, infiltration phase, MTB(−). Grade 0 respiratory failure.",
    "Newly diagnosed pulmonary tuberculosis: cavitary tuberculosis of the left upper lobe, dissemination phase, MTB(+), XDR (extensive drug resistance). Grade I respiratory failure.",
    "Secondary pulmonary tuberculosis: fibrocavitary tuberculosis of both upper lobes, progression and bronchogenic dissemination phase, MTB(+), pre-XDR. Grade II chronic respiratory failure.",
    "Newly diagnosed pulmonary tuberculosis: tuberculoma of right S6, consolidation phase, MTB(−). Grade 0 respiratory failure.",
    "Extrapulmonary tuberculosis: right-sided exudative tuberculous pleurisy, active phase, MTB(−). Grade I respiratory failure.",
    "Idiopathic pulmonary fibrosis, progressive course. Grade II chronic respiratory failure.",
    "Pulmonary sarcoidosis: stage II (intrathoracic lymphadenopathy and parenchymal lung changes), active phase. Grade I chronic respiratory failure.",
    "Extrinsic allergic alveolitis (hypersensitivity pneumonitis), acute form, moderate severity. Grade I respiratory failure.",
    "Pulmonary embolism of small branches of the pulmonary artery, intermediate risk. Grade II respiratory failure.",
    "Right-sided spontaneous tension pneumothorax (primary). Grade II acute respiratory failure.",
  ],
};

/** Нозологии для Библиотеки: номера диагнозов из списка выше, с 1. */
export const DIAGNOSIS_GROUPS: { title: Record<Locale, string>; items: number[] }[] = [
  { title: { ru: "Пневмонии", kk: "Пневмониялар", en: "Pneumonia" }, items: [1, 2, 6, 7, 8, 9] },
  { title: { ru: "ХОБЛ", kk: "ӨСОА", en: "COPD" }, items: [3, 4, 10, 11, 12] },
  { title: { ru: "Бронхиальная астма", kk: "Бронх демікпесі", en: "Bronchial asthma" }, items: [13, 14, 15] },
  { title: { ru: "Туберкулёз", kk: "Туберкулез", en: "Tuberculosis" }, items: [5, 16, 17, 18, 19, 20, 21] },
  {
    title: {
      ru: "Интерстициальные заболевания и неотложные состояния",
      kk: "Интерстициалды аурулар және шұғыл жағдайлар",
      en: "Interstitial lung disease and emergencies",
    },
    items: [22, 23, 24, 25, 26],
  },
];

export interface DiagnosisTreatmentText {
  title: string;
  dxQuestion: string;
  dxIntro: string;
  txHeading: string;
  txIntro: string;
  txLocked: string;
}

const STEP_TEXT: Record<Locale, DiagnosisTreatmentText> = {
  ru: {
    title: "Диагноз и лечение",
    dxQuestion: "Сформулируйте полный клинический диагноз",
    dxIntro: "Выберите из списка диагноз, который полностью соответствует данным пациента: локализация, тяжесть, осложнения.",
    txHeading: "Лечение",
    txIntro: "Тест по лечению этого пациента: в каждом вопросе один правильный ответ. Пояснения — после завершения кейса.",
    txLocked: "Сначала выберите диагноз — после этого откроется тест по лечению.",
  },
  kk: {
    title: "Диагноз және ем",
    dxQuestion: "Толық клиникалық диагнозды тұжырымдаңыз",
    dxIntro: "Тізімнен науқастың деректеріне толық сәйкес келетін диагнозды таңдаңыз: орналасуы, ауырлығы, асқынулары.",
    txHeading: "Ем",
    txIntro: "Осы науқасты емдеу бойынша тест: әр сұрақта бір дұрыс жауап. Түсініктемелер — кейс аяқталғаннан кейін.",
    txLocked: "Алдымен диагнозды таңдаңыз — содан кейін емдеу бойынша тест ашылады.",
  },
  en: {
    title: "Diagnosis and treatment",
    dxQuestion: "State the full clinical diagnosis",
    dxIntro: "Choose the diagnosis that fully matches the patient's data: location, severity, complications.",
    txHeading: "Treatment",
    txIntro: "A treatment quiz for this patient: each question has one correct answer. Explanations come after you finish the case.",
    txLocked: "Choose the diagnosis first — the treatment quiz will unlock after that.",
  },
};

/** Тексты подраздела «Лечение» внутри шага — нужны компоненту, который решает, показывать его или нет. */
export function diagnosisTreatmentText(locale: Locale): DiagnosisTreatmentText {
  return STEP_TEXT[locale];
}

/**
 * Один шаг «Диагноз и лечение»: сначала вопрос со всем списком диагнозов, тест по лечению
 * (каждый вопрос весит 15, вместе с диагнозом — 100) показывается только после того, как
 * диагноз выбран — так студент не подсматривает лечение раньше времени. `correct` — номер
 * диагноза в списке, с 1.
 */
export function diagnosisAndTreatmentStep(
  correct: number,
  locale: Locale,
  questions: Omit<SingleQuestion, "type" | "weight">[],
): QuestionsStep {
  const text = STEP_TEXT[locale];
  const diagnosisQuestion: SingleQuestion = {
    id: "diagnosis",
    type: "single",
    text: text.dxQuestion,
    weight: 25,
    correctId: `dx-${correct}`,
    options: DIAGNOSES[locale].map((label, i) => ({ id: `dx-${i + 1}`, label })),
  };
  return {
    kind: "questions",
    title: text.title,
    intro: text.dxIntro,
    questions: [diagnosisQuestion, ...questions.map((q) => ({ ...q, type: "single" as const, weight: 15 }))],
  };
}
