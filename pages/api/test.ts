import type { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  console.log(`req.query`);
  console.log(req.query);

  res.json(req.query);
};
