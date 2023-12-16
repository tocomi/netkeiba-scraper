import { ElementHandle, Page } from 'puppeteer';
import {
  getHref,
  getRaceClassFromElementClass,
  getRaceClassFromRaceName,
  getRaceTypeFromTypeName,
  getTextContent,
} from './utils';
import { RaceClass, Race, Horse } from '@/types';
import { sleep } from './utils/sleep';

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

  const raceClass = getRaceClassFromElementClass(className.split(' ')[1]);
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

export const getRaceOtherInfo = async (
  raceElement: ElementHandle<Element>
): Promise<
  Pick<Race, 'startTime' | 'type' | 'distance' | 'horseCount'> | undefined
> => {
  const startTimeElement = await raceElement.$('.RaceList_Itemtime');
  if (!startTimeElement) return;
  const rawStartTime = await getTextContent(startTimeElement);
  if (!rawStartTime) return;
  const startTime = rawStartTime.trim();

  const typeAndDistanceElement = await raceElement.$('.RaceList_ItemLong');
  if (!typeAndDistanceElement) return;
  // ex. 芝1200m
  const rawTypeAndDistance = await getTextContent(typeAndDistanceElement);
  if (!rawTypeAndDistance) return;
  const type = getRaceTypeFromTypeName(rawTypeAndDistance[0]);

  const distancePattern = /(\d+)m/;
  const distanceMatch = rawTypeAndDistance.match(distancePattern);
  if (!distanceMatch) return;
  const distance = Number(distanceMatch[1]);

  const horseCountElement = await raceElement.$('.RaceList_Itemnumber');
  if (!horseCountElement) return;
  const rawHorseCount = await getTextContent(horseCountElement);
  if (!rawHorseCount) return;
  const horseCount = Number(rawHorseCount.replace(/頭 /, ''));

  return { startTime, type, distance, horseCount };
};

const DUMMY_HORSES: Horse[] = [];
export const getTodayRaces = async (page: Page): Promise<Race[]> => {
  console.log('🏇 Getting today races...');

  /**
   * 開催レース一覧
   * レース情報に関係ない一部のコンテンツの読み込みが終わらない場合がありタイムアウトしてしまうので、
   * DOMの読み込みが終わったら処理を進めてしまう
   */
  await page.goto('https://race.netkeiba.com/top/', {
    waitUntil: 'domcontentloaded',
  });

  /**
   * レースの情報は非同期で取得されるので、取得が完了するまでポーリングする
   */
  const getElements = async (): Promise<ElementHandle<Element>[]> => {
    const elements = await page.$$('.RaceList_DataItem');
    if (elements.length === 0) {
      await sleep(1000);
      return getElements();
    }
    return elements;
  };

  const elements = await getElements();
  const places = await getPlaces(page);
  const races: Race[] = [];
  let currentPlaceIndex = 0;
  let beforeRaceRound = 0;
  for (const element of elements) {
    const id = await getId(element);
    if (!id) continue;

    const round = await getRound(element);
    if (!round) continue;

    // NOTE: 前のレースのラウンドが今のラウンド以上の場合は開催地が移ったとみなす
    if (round <= beforeRaceRound) currentPlaceIndex++;
    beforeRaceRound = round;

    const place = places[currentPlaceIndex];
    if (!place) continue;

    const name = await getName(element);
    if (!name) continue;

    const raceClass = await getClass(element, name);

    const otherInfo = await getRaceOtherInfo(element);
    if (!otherInfo) continue;

    races.push({
      id,
      place,
      round,
      name,
      class: raceClass,
      horses: DUMMY_HORSES,
      ...otherInfo,
    });
  }

  return races;
};
