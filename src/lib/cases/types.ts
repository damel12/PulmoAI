// Кейс — это данные. Движок (CasePlayer) и оценка (scoring.ts) работают с любым
// кейсом этой формы, поэтому новый кейс добавляется файлом, а не новой вёрсткой.

export interface Vital {
  label: string;
  value: string;
  unit?: string;
}

export interface Patient {
  name: string;
  age: number;
  sex: "male" | "female";
  occupation?: string;
  admission: string;
  /** Фото пациента для карточки в кейсе. Сгенерированное лицо, не настоящий человек. */
  photo?: Picture;
}

export interface ChoiceOption {
  id: string;
  label: string;
  /** Объяснение, которое студент видит в разборе. У неверных вариантов может отсутствовать. */
  feedback?: string;
}

interface QuestionBase {
  id: string;
  text: string;
  /** Вес вопроса в итоговом балле. Сумма весов по кейсу не обязана быть 100 — балл нормируется. */
  weight: number;
  options: ChoiceOption[];
}

/** Один правильный ответ. */
export interface SingleQuestion extends QuestionBase {
  type: "single";
  correctId: string;
}

/**
 * Выбор нескольких вариантов (например, назначение обследований).
 * Балл пропорционален доле выбранных обязательных вариантов; лишние,
 * но безвредные назначения не штрафуются — только комментируются.
 */
export interface MultiQuestion extends QuestionBase {
  type: "multi";
  requiredIds: string[];
}

export type Question = SingleQuestion | MultiQuestion;

/** Файл изображения из public/. Размеры нужны, чтобы страница не прыгала при загрузке. */
export interface Picture {
  src: string;
  width: number;
  height: number;
}

export type PhotoKind = "xray" | "ct" | "ecg" | "scheme";

/** Настоящий снимок, ЭКГ или препарат. */
export interface Photo {
  kind: PhotoKind;
  caption: string;
  alt: string;
  image: Picture;
  /** Тот же снимок с разметкой находок — студент открывает его сам. */
  annotated?: Picture;
  /** Запись аускультации этого пациента (mp3), звуковой плеер под карточкой ЭКГ. */
  audio?: string;
}

export interface HistoryStep {
  kind: "history";
  title: string;
  complaints: string[];
  anamnesis: string;
  lifeHistory?: string;
  allergy?: string;
  exam: string[];
  vitals: Vital[];
}

export interface QuestionsStep {
  kind: "questions";
  title: string;
  intro: string;
  questions: Question[];
}

export interface FindingsStep {
  kind: "findings";
  title: string;
  intro?: string;
  /** Строки дословно как в материалах заказчика. */
  labs?: string[];
  photos: Photo[];
  /** Инструментальные данные, дословно. */
  studies?: string[];
  hint?: string;
}

export type CaseStep = HistoryStep | QuestionsStep | FindingsStep;

export interface ClinicalCase {
  slug: string;
  number: number;
  title: string;
  topic: string;
  summary: string;
  difficulty: "basic" | "medium" | "hard";
  minutes: number;
  patient: Patient;
  /** Картинка для главной страницы. */
  cover: Picture;
  steps: CaseStep[];
  /** Итоговый разбор эталонного решения. */
  takeaway: string;
}

export type Answers = Record<string, string | string[]>;
