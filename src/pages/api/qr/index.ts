import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabaseClient';
import { nanoid } from 'nanoid';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const userId = req.headers['x-user-id'] as string;
  const userRole = req.headers['x-user-role'] as string;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized: User ID missing' });
  }

  switch (req.method) {
    case 'GET':
      try {
        let query = supabase.from('qrcodes').select('*').is('deleted_at', null);

        if (userRole !== 'admin') {
          query = query.eq('user_id', userId);
        }

        const { data, error } = await query;

        if (error) throw error;
        res.status(200).json(data);
      } catch (error: any) {
        res.status(500).json({ message: error.message });
      }
      break;

    case 'POST':
      try {
        const { destinationUrl, name, folderId } = req.body;

        if (!destinationUrl || !name) {
          return res.status(400).json({ message: 'destinationUrl and name are required' });
        }

        const shortId = nanoid(6);
        const insertData = {
          id: shortId,
          name,
          destination_url: destinationUrl,
          folder_id: folderId || null,
          user_id: userId, // Associate QR with the user
        };

        const { data, error } = await supabase
          .from('qrcodes')
          .insert([insertData])
          .select();

        if (error) throw error;

        res.status(201).json(data[0]);
      } catch (error: any) {
        res.status(500).json({ message: error.message });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
