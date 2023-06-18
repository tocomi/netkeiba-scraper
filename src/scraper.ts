import { getTodayRaces, launchBrowser, getRaceData } from './libs';
import { Race, RaceSummary } from './types';

export const getRaceSummaries = async (): Promise<RaceSummary[]> => {
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

// (async () => {
//   await getRaceSummaries();
//   await getRaceDetail(202305030607);
// })();
