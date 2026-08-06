/** Русские названия программ для админ-панели (в заявках хранится id цели с сайта). */

export const PROGRAM_LABEL: Record<string, string> = {
  hsk1: "HSK1 за 3 месяца",
  hsk2: "HSK2 за 4 месяца",
  individual: "Индивидуальный китайский",
  group: "Групповые занятия для начинающих",
  ege: "ЕГЭ по китайскому",
  kids: "Китайский для школьников",
  consultation: "Консультация",
  other: "Другое",
};

export const programLabel = (value: string | undefined | null): string => {
  if (!value) return "Не указано";
  return PROGRAM_LABEL[value] ?? value;
};
