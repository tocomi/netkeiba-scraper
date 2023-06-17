import { Page } from 'puppeteer';
import { Race } from '../types';
import { getTextContent } from './utils';
import { getHorseData } from './getHorseData';

export const getRaceData = async ({
  page,
  raceUrl,
}: {
  page: Page;
  raceUrl: string;
}): Promise<Race | undefined> => {
  await page.goto(raceUrl);

  const raceElement = await page.$('.RaceList_NameBox');
  if (!raceElement) return;

  const raceRoundElement = await raceElement.$('.RaceNum');
  if (!raceRoundElement) return;
  const rawRaceRound = await getTextContent(raceRoundElement);
  if (!rawRaceRound) return;
  // textContent から R とスペースを取り除く
  const raceRound = Number(rawRaceRound.replace(/R/g, '').trim());

  const raceNameElement = await raceElement.$('.RaceName');
  console.log('👾 -> raceNameElement:', raceNameElement);
  if (!raceNameElement) return;
  const rawRaceName = await getTextContent(raceNameElement);
  if (!rawRaceName) return;
  const raceName = rawRaceName.trim();

  const horses = await getHorseData({ page });

  return {
    round: raceRound,
    name: raceName,
    horses,
  };
};
