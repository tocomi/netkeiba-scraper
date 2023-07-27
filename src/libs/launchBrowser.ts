import puppeteer from 'puppeteer';

export const launchBrowser = async () => {
  console.log('🏇 Launching browser...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--single-process'],
  });
  const page = await browser.newPage();
  return { browser, page };
};
