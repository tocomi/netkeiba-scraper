import puppeteer from 'puppeteer';

(async () => {
  // ブラウザを起動
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // 対象のURLに遷移
  await page.goto(
    'https://race.netkeiba.com/race/shutuba_past.html?race_id=202306030811&rf=shutuba_submenu'
  );

  // JavaScriptが実行された後のHTMLを取得
  await page.content();

  // 任意の要素をスクレイピング
  const elements = await page.$$('.Popular');
  const results = [];
  for (const element of elements) {
    const odds = await element.$('span');
    if (!odds) continue;
    results.push({
      text: await (await odds.getProperty('textContent')).jsonValue(),
    });
  }

  console.log(results);

  // ブラウザを閉じる
  await browser.close();
})();
