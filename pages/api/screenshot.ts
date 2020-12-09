import type { NextApiRequest, NextApiResponse } from 'next';
import * as playwright from 'playwright-aws-lambda';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (!req.query.hasOwnProperty('url')) {
    res.json({
      message: 'Missing URL',
    });
  }

  const screenshotUrl = req.query.url as string;

  const browser = await playwright.launchChromium({
    headless: true,
  });
  const context = await browser.newContext({
    deviceScaleFactor: req.query.hasOwnProperty('deviceScaleFactor')
      ? Number(req.query.deviceScaleFactor)
      : 5,
  });

  const page = await context.newPage();

  await page.goto(screenshotUrl, {
    waitUntil: 'load',
  });

  await page.waitForTimeout(300);

  const imageData = await page.screenshot({
    type: 'png',
    clip: {
      x: 0,
      y: 0,
      width: Number.parseInt(req.query.width as string),
      height: Number.parseInt(req.query.height as string),
    },
  });

  await browser.close();

  res.setHeader('Cache-Control', 's-maxage=31536000, stale-while-revalidate');
  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Content-Disposition', 'attachment');

  res.end(imageData);
};
