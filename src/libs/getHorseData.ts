import { Page } from 'puppeteer';
import { Horse } from '../types';
import { getHref, getTextContent } from './utils';
import { getHorseRecords } from './getHorseRecords';

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

    const horseUrl = await getHref(horseLink);
    const horseName = await getTextContent(horseLink);
    if (!horseName) continue;

    const records = await getHorseRecords({ horseElement });

    horses.push({ name: horseName, url: horseUrl, records });
  }

  return horses;
};
