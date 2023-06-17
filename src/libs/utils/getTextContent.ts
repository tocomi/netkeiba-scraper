import { ElementHandle } from 'puppeteer';

export const getTextContent = async (element: ElementHandle) => {
  return await (await element.getProperty('textContent')).jsonValue();
};
