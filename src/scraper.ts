import { getTodayRaceUrls, launchBrowser } from './libs';

(async () => {
  const { browser, page } = await launchBrowser();

  const todayRaceUrls = await getTodayRaceUrls(page);

  // ブラウザを閉じる
  await browser.close();
})();
