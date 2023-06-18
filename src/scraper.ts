import { get } from 'http';
import { getRaceData, getTodayRaces, launchBrowser } from './libs';
import { RaceSummary } from './types';

export const getRaceSummaries = async (): Promise<RaceSummary[]> => {
  console.log('🏇 Launching browser...');
  const { browser, page } = await launchBrowser();

  console.log('🏇 Getting today races...');
  const todayRaces = await getTodayRaces(page);

  await browser.close();

  return todayRaces;
};

(async () => {
  // console.log('🏇 Launching browser...');
  // const { browser, page } = await launchBrowser();
  // console.log('🏇 Getting today races url...');
  // const todayRaceUrls = await getTodayRaceUrls(page);
  // console.log('🏇 Getting race data...');
  // for (const raceUrl of todayRaceUrls) {
  //   await getRaceData({ page, raceUrl });
  // }
  // // ブラウザを閉じる
  // await browser.close();
  await getRaceSummaries();
})();
