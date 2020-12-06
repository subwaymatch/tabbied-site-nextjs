import type { NextApiRequest, NextApiResponse } from 'next';
import * as playwright from 'playwright-aws-lambda';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const browser = await playwright.launchChromium();

  const page = await browser.newPage({
    deviceScaleFactor: 10,
  });

  await page.goto(
    'https://tabbied.vercel.app/artwork-screenshot/mixtape?seed=0000&id=mixtape&palette=%23C7C7C7&palette=%23232529&palette=%233E8BFF&palette=%233FFFB2&palette=%233EECFF&palette=%233FFFB2&grid=8x12&frequency=0.8&shadow=true'
  );

  const imageData = await page.screenshot({
    type: 'png',
    clip: {
      x: 0,
      y: 0,
      width: 360,
      height: 540,
    },
  });

  await browser.close();

  res.setHeader('Cache-Control', 's-maxage=31536000, stale-while-revalidate');
  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Content-Disposition', 'attachment');

  res.end(imageData);
};
