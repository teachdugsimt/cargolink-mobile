import { translate } from "../i18n";
import dateAndTime from 'date-and-time'

export const ConverTimeFormat = (duration: number, format: 'HHmmssms' | 'HHmmss' | 'HHmm' | 'HH' | 'mmssms' | 'mmss' | 'mm' | 'ssms' | 'ss' | 'ms') => {
  const time = {
    ms: (duration % 1000) / 100,
    ss: Math.floor((duration / 1000) % 60),
    mm: Math.floor((duration / (1000 * 60)) % 60),
    HH: Math.floor((duration / (1000 * 60 * 60)) % 24),
  }

  let timeStr = ''
  const arrFormat = format.match(/.{1,2}/g)

  arrFormat.forEach(f => {
    timeStr += `${time[f]} ${translate(`common.${f}`)} `
  })

  return timeStr.trim()
}

export const convertTime12to24 = (date: string) => {
  try {
    if (!date) return ''
    const pattern = dateAndTime.compile('DD-MM-YYYY HH:mm');
    const tzoffset = (new Date(date)).getTimezoneOffset() * 60000;
    // const localISOTime = (new Date(1613125980000 + (Math.abs(tzoffset)) * 2)).toISOString().slice(0, -1);
    const localISOTime = (new Date(Date.parse(date) + Math.abs(tzoffset))).toISOString()
    const dateWithTimeZone = dateAndTime.format(new Date(localISOTime), pattern);

    return dateWithTimeZone
  } catch (err) {
    return ''
  }
}
