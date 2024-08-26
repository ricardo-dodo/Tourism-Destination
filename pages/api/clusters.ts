import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_FLASK_URL}/clusters`);
      res.status(200).json(response.data);
    } catch (error) {
      console.error('Error fetching clusters:', error);
      res.status(500).json({ error: 'Failed to fetch clusters' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}