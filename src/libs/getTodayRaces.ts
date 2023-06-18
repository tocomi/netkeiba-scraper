import { ElementHandle, Page } from 'puppeteer';
import { RaceClass, RaceSummary } from '../types';
import {
  getHref,
  getRaceClassFromElementClass,
  getRaceClassFromRaceName,
  getTextContent,
} from './utils';

/**
 * 開催地の一覧を取得する
 */
const getPlaces = async (page: Page): Promise<string[]> => {
  const places: string[] = [];
  const placeElements = await page.$$('.RaceList_DataTitle');

  for (const placeElement of placeElements) {
    // ex. 3回 東京 6日目
    const rawPlace = await getTextContent(placeElement);
    if (!rawPlace) continue;

    const place = rawPlace.split(' ')[1];
    places.push(place);
  }

  return places;
};

const getRound = async (
  raceElement: ElementHandle<Element>
): Promise<number | undefined> => {
  const roundElement = await raceElement.$('.Race_Num span');
  if (!roundElement) return;

  // ex.  1R (両端にスペースが入っている)
  const rawRound = await getTextContent(roundElement);
  if (!rawRound) return;

  const round = rawRound.trim().replace(/R/, '');
  return Number(round);
};

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

  const raceClass = getRaceClassFromElementClass(className);
  if (raceClass) return raceClass;

  return 'OTHER';
};

const getName = async (
  raceElement: ElementHandle<Element>
): Promise<string | undefined> => {
  const nameElement = await raceElement.$('.ItemTitle');
  if (!nameElement) return;

  const name = await getTextContent(nameElement);
  if (!name) return;

  return name;
};

const getId = async (
  raceElement: ElementHandle<Element>
): Promise<number | undefined> => {
  const idElement = await raceElement.$('a');
  if (!idElement) return;

  const url = await getHref(idElement);
  const idPattern = /race_id=(\d+)/;
  const idMatch = url.match(idPattern);
  if (!idMatch) return;

  return Number(idMatch[1]);
};

export const getTodayRaces = async (page: Page): Promise<RaceSummary[]> => {
  console.log('🏇 Getting today races...');

  // 開催レース一覧
  await page.goto('https://race.netkeiba.com/top/');

  const elements = await page.$$('.RaceList_DataItem');
  const places = await getPlaces(page);
  const races = [];
  let currentPlaceIndex = 0;
  let beforeRaceRound = 0;
  for (const element of elements) {
    const id = await getId(element);
    if (!id) continue;

    const round = await getRound(element);
    if (!round) continue;

    // NOTE: 前のレースのラウンドが今のラウンド以上の場合は開催地が移ったとみなす
    if (round <= beforeRaceRound) currentPlaceIndex++;
    const place = places[currentPlaceIndex];
    if (!place) continue;

    const name = await getName(element);
    if (!name) continue;

    const raceClass = await getClass(element, name);

    races.push({ id, place, round, name, class: raceClass });

    beforeRaceRound = round;
  }

  return races;
};
