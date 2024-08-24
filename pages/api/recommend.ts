import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { user_id } = req.body;
    try {
      const response = await axios.post('http://localhost:5000/recommend', { user_id });
      res.status(200).json(response.data);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch recommendations' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};