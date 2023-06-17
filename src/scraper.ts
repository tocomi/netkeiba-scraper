import puppeteer, { Page } from 'puppeteer';

const launchBrowser = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  return { browser, page };
};

const getTodayRaceUrls = async (page: Page): Promise<string[]> => {
  // 開催レース一覧
  await page.goto('https://race.netkeiba.com/top/');

  await page.content();

  // 開催レースの詳細 URL を取得
  const elements = await page.$$('.RaceList_DataItem');
  const urls = [];
  for (const element of elements) {
    const raceLink = await element.$('a');
    if (!raceLink) continue;

    // URL を過去 5 走ページのものに変換
    const convertedUrl = (
      await (await raceLink.getProperty('href')).jsonValue()
    )
      .replace(/(result|shutuba)/, 'shutuba_past')
      .replace(/(race_list|race_submenu)/, 'shutuba_submenu');
    urls.push(convertedUrl);
  }

  return urls;
};

(async () => {
  const { browser, page } = await launchBrowser();

  const todayRaceUrls = await getTodayRaceUrls(page);

  // ブラウザを閉じる
  await browser.close();
})();
