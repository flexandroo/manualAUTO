import type { StickerData } from './types';
import { newId } from '../utils/id';

// Sample data based on the FERRO ZMVA230 sticker — used as the default
// when the user first opens the stickers tab so they have something to
// edit instead of a blank form.
export function makeInitialSticker(): StickerData {
  return {
    id: newId('stk'),
    brand: 'FERRO',
    productLabelPrefix: 'symbol',
    productCode: 'ZMVA230',
    quantity: 1,
    dzCode: 'DZ: 0002',
    specs: [
      { key: 'P', value: '5 W' },
      { key: 'U', value: '~230 V AC – 50 Hz' },
      { key: 'IP', value: 'IP42, s: 1 m, 3×0,75 mm²' },
    ],
    ceMark: true,
    barcodeEan13: '5903738245901',
    translations: [
      { langCode: 'PL', text: 'Siłownik elektryczny do zaworów mieszających' },
      { langCode: 'CZ', text: 'Servopohon směšovacího ventilu' },
      { langCode: 'SK', text: 'Servopohon zmiešavacieho ventilu' },
      { langCode: 'EN', text: 'Electric actuator for mixing valves' },
      { langCode: 'RO', text: 'Servomotor electric (actuator) pentru vane de amestec' },
      { langCode: 'RU', text: 'Электропривод для смесительных клапанов' },
      { langCode: 'HU', text: 'Elektromos meghajómotormotor keverőszelepekhez' },
      { langCode: 'BG', text: 'Електрическо задвижване за смесителни вентили' },
      { langCode: 'LT', text: 'Elektrinė pavara maišymo vožtuvams' },
      { langCode: 'LV', text: 'Maisītājvārstu elektriskais aktuators' },
      { langCode: 'EE', text: 'Elektriline ajam seguventiilidele' },
      { langCode: 'UA', text: 'Електричний привід для змішувальних клапанів' },
      { langCode: 'HR', text: 'Električni pokretač za miješanje ventila' },
      { langCode: 'SRB', text: 'Električni aktuator ventila' },
      { langCode: 'GR', text: 'Ηλεκτρικός ενεργοποιητής για βαλβίδες ανάμιξης' },
    ],
    distributorInfo:
      'PL Producent: FERRO S.A., ul. Przemysłowa 7, 32-050 Skawina, +48122562100, www.ferro.pl. ' +
      'RO Importator/Distribuitor: NOVASERVIS FERRO GROUP SRL, +40264522524, Cluj-Napoca, www.ferro.ro. ' +
      'CZ Importer/Distributor: NOVASERVIS spol. s r.o., Merhautova 208, Brno, www.novaservis.cz. ' +
      'LT Platintojas: FERRO BALTICS UAB, +37063777749, ferrobaltics@ferro.pl, www.ferro.lt. ' +
      'BG Дистрибутор: НОВАСЕРВИЗ ФЕРРО БЪЛГАРИЯ ЕООД, +35932310347, www.ferro.bg. ' +
      'HU Forgalmazó: FERRO HUNGARY Kft., +3617913045, www.ferrohungary.hu. ' +
      'HR DISTRIBUTER: FERRO ADRIATICA d.o.o., +38543550033, www.ferrocroatia.hr.',
    widthMm: 150,
    heightMm: 90,
  };
}
