import puppeteer from 'puppeteer';

export const launchBrowser = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  return { browser, page };
};
