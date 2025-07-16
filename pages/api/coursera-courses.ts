import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { start = '0', limit = '24', fields = 'name,description,photoUrl,partnerLogo,startDate,primaryLanguages' } = req.query;
  const params = new URLSearchParams({
    start: String(start),
    limit: String(limit),
    fields: String(fields),
  });
  const url = `https://api.coursera.org/api/courses.v1?${params.toString()}`;
  try {
    const courseraRes = await fetch(url);
    const data = await courseraRes.json();
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch from Coursera API' });
  }
} 