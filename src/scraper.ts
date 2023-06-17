import { getRaceData, getTodayRaceUrls, launchBrowser } from './libs';

(async () => {
  console.log('🏇 Launching browser...');
  const { browser, page } = await launchBrowser();

  console.log('🏇 Getting today races url...');
  const todayRaceUrls = await getTodayRaceUrls(page);

  console.log('🏇 Getting race data...');
  for (const raceUrl of todayRaceUrls) {
    await getRaceData({ page, raceUrl });
  }

  // ブラウザを閉じる
  await browser.close();
})();
