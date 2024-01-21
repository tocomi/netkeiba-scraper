import { ElementHandle } from 'puppeteer';
import { getRaceClassFromRaceName, getTextContent } from './utils';
import { getRaceClassFromClassBadge } from './utils/getRaceClassFromClassBadge';
import { RaceClass, Record } from '@/types';

const dummyRecord: Record = {
  date: '-',
  place: '-',
  name: '-',
  class: 'OTHER',
  diff: 0,
};

const getClass = async (
  recordElement: ElementHandle<Element>,
  raceName: string
): Promise<RaceClass> => {
  const classFromRaceName = getRaceClassFromRaceName(raceName);
  if (classFromRaceName) return classFromRaceName;

  const classElement = await recordElement.$('.Icon_GradeType');
  if (!classElement) return 'OTHER';
  // ex. GIII
  const rawClass = await getTextContent(classElement);
  if (!rawClass) return 'OTHER';

  return getRaceClassFromClassBadge(rawClass);
};

/**
 * レース詳細ページから過去の成績を取得する
 * @param horseElement 出走馬の情報を持っている tr 要素を想定
 */
export const getHorseRecords = async ({
  horseElement,
}: {
  horseElement: ElementHandle<Element>;
}): Promise<Record[]> => {
  const recordElements = await horseElement.$$('.Past, .Rest');

  const records: Record[] = [];
  const _getHorseRecords = async (
    recordElement: ElementHandle<Element>
  ): Promise<void> => {
    const dateAndPlaceElements = await recordElement.$$('.Data01 span');
    if (!dateAndPlaceElements) return;
    // 休養期間 or 出走記録なし
    if (dateAndPlaceElements.length === 0) {
      // TODO: 休養期間をデータに入れておく？
      records.push(dummyRecord);
      return;
    }
    // ex. 2022.11.27 東京
    const dateAndPlace = await getTextContent(dateAndPlaceElements[0]);
    if (!dateAndPlace) return;
    const [date, place] = dateAndPlace.split(/\s/);

    const nameElement = await recordElement.$('.Data02 a');
    if (!nameElement) return;
    // ex. 袖ケ浦特別\n\n\n\n\n\n\n\n\n\n\n\n\n\n2勝
    const rawName = await getTextContent(nameElement);
    if (!rawName) return;
    const name = rawName.split('\n')[0].trim();

    const raceClass = await getClass(recordElement, name);

    const diffElement = await recordElement.$('.Data07');
    if (!diffElement) return;
    // ex. ロードトゥフェイム(3.1)
    const rawDiff = await getTextContent(diffElement);
    if (!rawDiff) return;
    const diff = Number(rawDiff.split('(')[1].split(')')[0]);

    records.push({
      date,
      place,
      name,
      class: raceClass,
      diff,
    });
  };

  const promises = recordElements.map(_getHorseRecords);
  await Promise.all(promises);

  return records.sort((a, b) => {
    if (a.date > b.date) return -1;
    if (a.date < b.date) return 1;
    return 0;
  });
};
