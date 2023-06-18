import { ElementHandle, Page } from 'puppeteer';
import { RaceSummary } from '../types';
import { getHref, getTextContent } from './utils';

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

  // 開催レースの詳細 URL を取得
  const elements = await page.$$('.RaceList_DataItem');
  const races = [];
  for (const element of elements) {
    const round = await getRound(element);
    if (!round) continue;

    const name = await getName(element);
    if (!name) continue;

    const id = await getId(element);
    if (!id) continue;

    races.push({ round, name, id });
  }

  return races;
};
