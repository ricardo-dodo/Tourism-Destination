import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const filePath = path.join(process.cwd(), 'public', 'tourism_with_id.csv');
      const fileContent = fs.readFileSync(filePath, 'utf8');
      
      Papa.parse(fileContent, {
        header: true,
        complete: (results) => {
          const places = results.data.map((place: any) => ({
            Place_Id: place.Place_Id,
            Place_Name: place.Place_Name
          }));
          res.status(200).json(places);
        },
        error: (error: Error) => {
          throw error;
        }
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch places' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}