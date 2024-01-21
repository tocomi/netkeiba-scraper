import { ElementHandle, Page } from 'puppeteer';
import { getHorseRecords } from './getHorseRecords';
import { getHref, getTextContent } from './utils';
import { getHorseSexFromText } from './utils/getHorseSexFromText';
import { Horse } from '@/types';

/**
 * レース詳細ページから出走馬の情報を取得する
 */
export const getHorseData = async ({
  page,
}: {
  page: Page;
}): Promise<Horse[]> => {
  const horseElements = await page.$$('#sort_table .HorseList');

  const horses: Horse[] = [];
  const _getHorseData = async (
    horseElement: ElementHandle<Element>
  ): Promise<void> => {
    const horseInfo = await horseElement.$('#Horse_Info_Data');
    if (!horseInfo) return;

    const horseLink = await horseInfo.$('.Horse02 a');
    if (!horseLink) return;
    const url = await getHref(horseLink);

    const rawName = await getTextContent(horseLink);
    if (!rawName) return;
    const name = rawName.trim();

    const horseNumberElement = await horseElement.$('.Waku');
    if (!horseNumberElement) return;
    const horseNumber = Number(await getTextContent(horseNumberElement));

    const gateNumberElement = await horseElement.$$('td');
    if (!gateNumberElement.length) return;
    const gateNumber = Number(await getTextContent(gateNumberElement[0]));

    const oddsAndRankElements = await horseElement.$$('.Popular span');
    if (!oddsAndRankElements.length) return;
    const rawOdds = await getTextContent(oddsAndRankElements[0]);
    if (!rawOdds) return;
    const odds = Number(rawOdds);

    // ex. (12人気)
    const rawOddsRank = await getTextContent(oddsAndRankElements[1]);
    if (!rawOddsRank) return;
    const oddsRankMatch = rawOddsRank.match(/(\d+)人気/);
    if (!oddsRankMatch) return;
    const oddsRank = Number(oddsRankMatch[1]);

    const sexAndAgeElement = await horseElement.$('.Barei');
    if (!sexAndAgeElement) return;
    // ex. 牡3青鹿
    const rawSexAndAge = await getTextContent(sexAndAgeElement);
    if (!rawSexAndAge) return;
    const sex = getHorseSexFromText(rawSexAndAge[0]);

    const ageMatch = rawSexAndAge.match(/(\d+)/);
    if (!ageMatch) return;
    const age = Number(ageMatch[1]);

    const jockeyElement = await horseElement.$('.Jockey a');
    if (!jockeyElement) return;
    const jockey = await getTextContent(jockeyElement);
    if (!jockey) return;

    const handiElement = await horseElement.$$('.Jockey span');
    if (!handiElement.length) return;
    const rawHandi = await getTextContent(handiElement[1]);
    if (!rawHandi) return;
    const handi = Number(rawHandi);

    const records = await getHorseRecords({ horseElement });

    horses.push({
      name,
      url,
      horseNumber,
      gateNumber,
      odds,
      sex,
      age,
      oddsRank,
      jockey,
      handi,
      records,
    });
  };

  const promises = horseElements.map(_getHorseData);
  await Promise.all(promises);

  return horses.sort((a, b) => a.horseNumber - b.horseNumber);
};
