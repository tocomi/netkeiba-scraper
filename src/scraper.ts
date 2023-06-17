import { getRaceData, getTodayRaceUrls, launchBrowser } from './libs';

(async () => {
  const { browser, page } = await launchBrowser();

  const todayRaceUrls = await getTodayRaceUrls(page);

  const raceData = await getRaceData({ page, raceUrl: todayRaceUrls[0] });
  console.log('👾 -> raceData:', raceData);

  // ブラウザを閉じる
  await browser.close();
})();
