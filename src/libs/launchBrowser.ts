import puppeteer from 'puppeteer';

export const launchBrowser = async () => {
  console.log('🏇 Launching browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--disable-setuid-sandbox',
      '--no-first-run',
      '--no-sandbox',
      '--no-zygote',
      '--single-process',
    ],
  });
  const page = await browser.newPage();
  return { browser, page };
};
