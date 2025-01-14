import { format, getTime, formatDistanceToNow, addDays, isPast, addYears, parseISO } from 'date-fns';
import ptLocale from 'date-fns/locale/pt-BR';


export function fDate(date, newFormat) {
  const fm = newFormat || "dd 'de' MMMM 'de' yyyy";


  return date ? format(parseISO(date), fm, { locale: ptLocale }) : '';
}

export function fTimestamp(date) {
  return date ? getTime(new Date(date)) : '';
}

export function fToNow(date) {
  return date
    ? formatDistanceToNow(new Date(date), {
        addSuffix: true,
        locale: ptLocale,
      })
    : '';
}

export function isExpired(date, frequency, timeUnit ) {
  if (timeUnit && timeUnit === "year") {
    return date ? isPast(addYears(new Date(date), frequency)) : false;
  }
  return date ? isPast(addDays(new Date(date), frequency)) : false;
}

export function isPastFromToday(date) {
  return isPast(new Date(date))
}