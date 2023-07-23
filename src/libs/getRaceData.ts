import { ElementHandle, Page } from 'puppeteer';
import { getHorseData } from './getHorseData';
import {
  getRaceClassFromElementClass,
  getRaceClassFromRaceName,
  getRaceTypeFromTypeName,
  getTextContent,
} from './utils';
import { Race, RaceClass } from '@/types';

const getClass = async (
  raceElement: ElementHandle<Element>,
  raceName: string
): Promise<RaceClass> => {
  const classFromRaceName = getRaceClassFromRaceName(raceName);
  if (classFromRaceName) return classFromRaceName;

  const classElement = await raceElement.$('.Icon_GradeType');
  if (!classElement) return 'OTHER';

  // ex. Icon_GradeType Icon_GradeType17 Icon_GradePos01
  const className = await classElement.evaluate(
    (el) => el.className,
    classElement
  );
  if (className === '') return 'OTHER';

  const raceClass = getRaceClassFromElementClass(className.split(' ')[1]);
  if (raceClass) return raceClass;

  return 'OTHER';
};

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

  const raceClass = await getClass(raceElement, raceName);

  const startTimeElement = await raceElement.$('.RaceData01');
  if (!startTimeElement) return;
  // ex. 15:45発走 /
  const rawStartTime = await getTextContent(startTimeElement);
  if (!rawStartTime) return;
  const startTimeMatch = rawStartTime.match(/(\d{2}:\d{2})/);
  if (!startTimeMatch) return;
  const startTime = startTimeMatch[1];

  const typeAndDistanceElements = await raceElement.$$('.RaceData01 span');
  if (!typeAndDistanceElements) return;
  // ex. 芝1200m
  const rawTypeAndDistance = await getTextContent(typeAndDistanceElements[0]);
  if (!rawTypeAndDistance) return;
  const type = getRaceTypeFromTypeName(rawTypeAndDistance[0]);

  const distancePattern = /(\d+)m/;
  const distanceMatch = rawTypeAndDistance.match(distancePattern);
  if (!distanceMatch) return;
  const distance = Number(distanceMatch[1]);

  const horseCountElement = await raceElement.$('.RaceData02');
  if (!horseCountElement) return;
  // ex. 2回 函館 ... 16頭
  const rawHorseCount = await getTextContent(horseCountElement);
  if (!rawHorseCount) return;
  const horseCountMatch = rawHorseCount.match(/(\d+)頭/);
  if (!horseCountMatch) return;
  const horseCount = Number(horseCountMatch[1]);

  console.log(
    `🏇 Target race: ${racePlace} ${raceRound}R ${raceName} ${raceClass}`
  );

  const horses = await getHorseData({ page });

  return {
    id: raceId,
    round: raceRound,
    name: raceName,
    place: racePlace,
    class: raceClass,
    startTime,
    type,
    distance,
    horseCount,
    horses,
  };
};
