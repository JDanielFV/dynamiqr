import type { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import { promises as fs } from 'fs';

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
  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid ID' });
  }

  const db = await readDb();
  const qrCode = db.qrcodes[id];

  if (!qrCode) {
    return res.status(404).json({ message: `QR Code with id ${id} not found` });
  }

  switch (req.method) {
    case 'PUT':
      try {
        const { destinationUrl } = req.body;
        if (!destinationUrl) {
          return res.status(400).json({ message: 'destinationUrl is required' });
        }

        qrCode.destinationUrl = destinationUrl;
        db.qrcodes[id] = qrCode;
        await writeDb(db);

        res.status(200).json(qrCode);
      } catch (error) {
        res.status(500).json({ message: 'Error writing to database' });
      }
      break;

    case 'DELETE':
      try {
        delete db.qrcodes[id];
        await writeDb(db);
        res.status(204).end(); // No Content
      } catch (error) {
        res.status(500).json({ message: 'Error writing to database' });
      }
      break;

    default:
      res.setHeader('Allow', ['PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
