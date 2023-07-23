import { getTodayRaces, launchBrowser, getRaceData } from './libs';
import { Race } from './types';

export const getRaceSummaries = async (): Promise<Race[]> => {
  const { browser, page } = await launchBrowser();

  const todayRaces = await getTodayRaces(page);

  await browser.close();

  return todayRaces;
};

export const getRaceDetail = async (raceId: number): Promise<Race> => {
  const { browser, page } = await launchBrowser();

  const raceDatial = await getRaceData({ page, raceId });
  if (!raceDatial) throw new Error(`Race data not found: ${raceId}`);

  await browser.close();

  return raceDatial;
};
