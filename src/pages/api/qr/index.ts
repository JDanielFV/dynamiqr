import type { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import { promises as fs } from 'fs';
import { nanoid } from 'nanoid';

import { QRCode } from '@/types';

// Define the structure of our database file
interface Database {
  qrcodes: Record<string, QRCode>;
}

// Resolve the path to the database file
const dbPath = path.resolve(process.cwd(), 'db.json');

// Helper function to read the database
async function readDb(): Promise<Database> {
  try {
    const fileContent = await fs.readFile(dbPath, 'utf-8');
    return JSON.parse(fileContent) as Database;
  } catch (error) {
    // If the file doesn't exist or is empty, return a default structure
    return { qrcodes: {} };
  }
}

// Helper function to write to the database
async function writeDb(data: Database): Promise<void> {
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2));
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'GET':
      try {
        const db = await readDb();
        // Return an array of QR codes
        res.status(200).json(Object.values(db.qrcodes));
      } catch (error) {
        res.status(500).json({ message: 'Error reading database' });
      }
      break;

    case 'POST':
      try {
        const { destinationUrl } = req.body;

        if (!destinationUrl) {
          return res.status(400).json({ message: 'destinationUrl is required' });
        }

        const db = await readDb();
        
        const newQRCode: QRCode = {
          id: nanoid(8), // Generate a short 8-character ID
          destinationUrl,
          createdAt: new Date().toISOString(),
        };

        db.qrcodes[newQRCode.id] = newQRCode;
        await writeDb(db);

        res.status(201).json(newQRCode);
      } catch (error) {
        res.status(500).json({ message: 'Error writing to database' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
