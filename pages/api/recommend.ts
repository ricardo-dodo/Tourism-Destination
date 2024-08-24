import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { place_id } = req.body;
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_FLASK_URL}/recommend`, { place_id }, { timeout: 5000 });
      res.status(200).json(response.data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      if (axios.isAxiosError(error) && error.code === 'ECONNREFUSED') {
        res.status(503).json({ error: 'Flask server is not running. Please start the Flask server and try again.' });
      } else {
        res.status(500).json({ error: 'Failed to fetch recommendations. Please try again later.' });
      }
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};