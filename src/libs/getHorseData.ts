import { Page } from 'puppeteer';
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
  for (const horseElement of horseElements) {
    const horseInfo = await horseElement.$('#Horse_Info_Data');
    if (!horseInfo) continue;

    const horseLink = await horseInfo.$('.Horse02 a');
    if (!horseLink) continue;
    const url = await getHref(horseLink);

    const rawName = await getTextContent(horseLink);
    if (!rawName) continue;
    const name = rawName.trim();

    const horseNumberElement = await horseElement.$('.Waku');
    if (!horseNumberElement) continue;
    const horseNumber = Number(await getTextContent(horseNumberElement));

    const gateNumberElement = await horseElement.$$('td');
    if (!gateNumberElement.length) continue;
    const gateNumber = Number(await getTextContent(gateNumberElement[0]));

    const oddsAndRankElements = await horseElement.$$('.Popular span');
    if (!oddsAndRankElements.length) continue;
    const rawOdds = await getTextContent(oddsAndRankElements[0]);
    if (!rawOdds) continue;
    const odds = Number(rawOdds);

    // ex. (12人気)
    const rawOddsRank = await getTextContent(oddsAndRankElements[1]);
    if (!rawOddsRank) continue;
    const oddsRankMatch = rawOddsRank.match(/(\d+)人気/);
    if (!oddsRankMatch) continue;
    const oddsRank = Number(oddsRankMatch[1]);

    const sexAndAgeElement = await horseElement.$('.Barei');
    if (!sexAndAgeElement) continue;
    // ex. 牡3青鹿
    const rawSexAndAge = await getTextContent(sexAndAgeElement);
    if (!rawSexAndAge) continue;
    const sex = getHorseSexFromText(rawSexAndAge[0]);

    const ageMatch = rawSexAndAge.match(/(\d+)/);
    if (!ageMatch) continue;
    const age = Number(ageMatch[1]);

    const jockeyElement = await horseElement.$('.Jockey a');
    if (!jockeyElement) continue;
    const jockey = await getTextContent(jockeyElement);
    if (!jockey) continue;

    const handiElement = await horseElement.$$('.Jockey span');
    if (!handiElement.length) continue;
    const rawHandi = await getTextContent(handiElement[1]);
    if (!rawHandi) continue;
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
  }

  return horses;
};
