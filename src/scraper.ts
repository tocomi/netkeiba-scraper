import { getRaceData, getTodayRaceUrls, launchBrowser } from './libs';

(async () => {
  console.log('🏇 Launching browser...');
  const { browser, page } = await launchBrowser();

  console.log('🏇 Getting today races url...');
  const todayRaceUrls = await getTodayRaceUrls(page);

  console.log('🏇 Getting race data...');
  const raceData = await getRaceData({ page, raceUrl: todayRaceUrls[0] });
  console.log('👾 -> raceData:', raceData);

  // ブラウザを閉じる
  await browser.close();
})();
