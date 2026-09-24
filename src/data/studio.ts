// Настройки конструктора индивидуальной экспедиции («Студия»).
// Редактируются в админке (/admin → «Конструктор»), хранятся в src/content/studio.json.
// Тексты — сразу на двух языках; цены — в долларах.
import studio from '../content/studio.json';

type L = { ru: string; en: string };

/** Показывать ли расчёт стоимости. Пока выключено: индивидуальные туры считаются по запросу. */
export const showPrice: boolean = studio.showPrice;
/** Надбавка за каждый дополнительный регион (переезды), $ за гостя. */
export const transferPerRegion: number = studio.transferPerRegion;
export const studioRegions: { key: string; name: L; alt: number; photo: string }[] = studio.regions;
/** Ползунки: диапазон и метки под шкалой. */
export const studioDays: { min: number; max: number; ticks: number[] } = studio.days;
export const studioGuests: { min: number; max: number; ticks: number[] } = studio.guests;
export const studioComfort: { name: L; desc: L; rate: number; vip?: boolean }[] = studio.comfort;
/** Золотые точки на кадре: x/y — позиция в процентах. */
export const studioMoments: { title: L; desc: L; price: number; perGuest?: boolean; x: number; y: number }[] = studio.moments;
export const studioDefaults: { route: number[]; days: number; guests: number; comfort: number } = studio.defaults;
