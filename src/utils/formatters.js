import { format } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";

export function capitalizeWord(word) {
  return word[0].toUpperCase() + word.slice(1, word.length);
}

export function formatToDate(date) {
  const generatedDate = new Date(date);

  return format(generatedDate, "dd/MM/yyyy");
}

export function formatToWeekDay(date) {
  const generatedDate = new Date(date);

  const weekDay = format(generatedDate, "eee", {
    locale: ptBR,
  });

  return capitalizeWord(weekDay);
}

export function formatToMoney(value) {
  return value.toLocaleString("pt-br", { style: "currency", currency: "BRL" });
}

export default function getDateParts(date) {
  let day, month, year;
  if (date.length === 8) {
    day = `${date[0]}${date[1]}`;
    month = `${date[2]}${date[3]}`;
    year = `${date[4]}${date[5]}${date[6]}${date[7]}`;
  } else {
    day = `${date[0]}${date[1]}`;
    month = `${date[3]}${date[4]}`;
    year = `${date[6]}${date[7]}${date[8]}${date[9]}`;
  }
  return { day, month, year };
}
