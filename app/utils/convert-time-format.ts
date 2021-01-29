import { translate } from "../i18n";

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
