import { ElementHandle } from 'puppeteer';

export const getHref = async (element: ElementHandle<HTMLAnchorElement>) => {
  return await (await element.getProperty('href')).jsonValue();
};
