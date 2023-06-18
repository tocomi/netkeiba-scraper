import { Page } from 'puppeteer';
import { Race } from '../types';
import { getTextContent } from './utils';
import { getHorseData } from './getHorseData';

export const getRaceData = async ({
  page,
  raceId,
}: {
  page: Page;
  raceId: number;
}): Promise<Race | undefined> => {
  // 過去 5 走成績のページ
  const url = `https://race.netkeiba.com/race/shutuba_past.html?race_id=${raceId}&rf=shutuba_submenu`;
  await page.goto(url);

  const raceElement = await page.$('.RaceList_NameBox');
  if (!raceElement) return;

  const raceRoundElement = await raceElement.$('.RaceNum');
  if (!raceRoundElement) return;
  const rawRaceRound = await getTextContent(raceRoundElement);
  if (!rawRaceRound) return;
  // textContent から R とスペースを取り除く
  const raceRound = Number(rawRaceRound.replace(/R/g, '').trim());

  const raceNameElement = await raceElement.$('.RaceName');
  if (!raceNameElement) return;
  const rawRaceName = await getTextContent(raceNameElement);
  if (!rawRaceName) return;
  const raceName = rawRaceName.trim();

  const racePlaceElement = await raceElement.$$('.RaceData02 span');
  if (!racePlaceElement) return;
  const racePlace = await getTextContent(racePlaceElement[1]);
  if (!racePlace) return;

  console.log(`🏇 Target race: ${racePlace} ${raceRound}R ${raceName}`);

  const horses = await getHorseData({ page });

  return {
    round: raceRound,
    name: raceName,
    place: racePlace,
    horses,
    // FIXME: エラー回避のためのダミー
    class: 'OTHER',
  };
};
