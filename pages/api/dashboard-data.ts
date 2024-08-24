import { NextApiRequest, NextApiResponse } from 'next';
import { readFileSync } from 'fs';
import { parse } from 'csv-parse/sync';

interface TourismData {
  Category: string;
  Price: number;
  Place_Id: string;
  Place_Name: string;
  Lat: string;
  Long: string;
}

interface RatingData {
  Place_Id: string;
  Place_Ratings: string;
}

interface UserData {
  Age: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // Read and parse CSV files
      const tourismData = parseCsv('public/tourism_with_id.csv');
      const ratingData = parseCsv('public/tourism_rating.csv');
      const userData = parseCsv('public/user.csv');

      // Calculate data for dashboard
      const categories = calculateCategories(tourismData);
      const priceRanges = calculatePriceRanges(tourismData);
      const mapData = calculateMapData(tourismData);
      const topRatedPlaces = calculateTopRatedPlaces(tourismData, ratingData);
      const ageDistribution = calculateAgeDistribution(userData);

      res.status(200).json({
        categories,
        priceRanges,
        mapData,
        topRatedPlaces,
        ageDistribution,
      });
    } catch (error) {
      console.error('Error processing dashboard data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}

function parseCsv(filePath: string) {
  const fileContent = readFileSync(filePath, 'utf-8');
  return parse(fileContent, { columns: true, skip_empty_lines: true });
}

function calculateCategories(tourismData: TourismData[]) {
  const categoryCount = tourismData.reduce<Record<string, number>>((acc, item) => {
    acc[item.Category] = (acc[item.Category] || 0) + 1;
    return acc;
  }, {});
  return Object.entries(categoryCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([category, count]) => ({ category, count }));
}

function calculatePriceRanges(tourismData: TourismData[]) {
  const priceRanges = [
    { min: 0, max: 50000 },
    { min: 50001, max: 100000 },
    { min: 100001, max: 200000 },
    { min: 200001, max: Infinity },
  ];
  const rangeCounts = priceRanges.map(range => ({
    ...range,
    count: tourismData.filter(item => item.Price >= range.min && item.Price <= range.max).length,
  }));
  return rangeCounts;
}

function calculateMapData(tourismData: TourismData[]) {
  return tourismData.map(item => ({
    id: item.Place_Id,
    name: item.Place_Name,
    lat: parseFloat(item.Lat),
    lng: parseFloat(item.Long),
    category: item.Category,
  }));
}

function calculateTopRatedPlaces(tourismData: TourismData[], ratingData: RatingData[]) {
  interface RatingAccumulator {
    [key: string]: { sum: number; count: number };
  }

  const placeRatings = ratingData.reduce<RatingAccumulator>((acc, item) => {
    if (!acc[item.Place_Id]) {
      acc[item.Place_Id] = { sum: 0, count: 0 };
    }
    acc[item.Place_Id].sum += parseInt(item.Place_Ratings);
    acc[item.Place_Id].count += 1;
    return acc;
  }, {});

  const averageRatings = Object.entries(placeRatings).map(([placeId, data]) => ({
    placeId,
    averageRating: data.sum / data.count,
  }));

  return averageRatings
    .sort((a, b) => b.averageRating - a.averageRating)
    .slice(0, 10)
    .map(item => {
      const place = tourismData.find(p => p.Place_Id === item.placeId);
      return {
        name: place ? place.Place_Name : `Place ${item.placeId}`,
        rating: item.averageRating,
      };
    });
}

function calculateAgeDistribution(userData: UserData[]) {
  const ageDistribution = {
    '18-24': 0,
    '25-34': 0,
    '35-44': 0,
    '45-54': 0,
    '55-64': 0,
    '65+': 0,
  };

  userData.forEach(item => {
    const ageRange = getAgeRange(item.Age);
    ageDistribution[ageRange]++;
  });

  return ageDistribution;
}

function getAgeRange(age: string) {
  const ageValue = parseInt(age);
  if (ageValue >= 18 && ageValue <= 24) return '18-24';
  if (ageValue >= 25 && ageValue <= 34) return '25-34';
  if (ageValue >= 35 && ageValue <= 44) return '35-44';
  if (ageValue >= 45 && ageValue <= 54) return '45-54';
  if (ageValue >= 55 && ageValue <= 64) return '55-64';
  return '65+';
}