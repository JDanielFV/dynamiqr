import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabaseClient';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid ID' });
  }

  switch (req.method) {
    case 'PUT':
      try {
        const { destinationUrl, name, folderId, nfcLink } = req.body;

        const updateData: { [key: string]: any } = {};
        if (destinationUrl) updateData.destination_url = destinationUrl;
        if (name) updateData.name = name;
        if (req.body.hasOwnProperty('folderId')) {
          updateData.folder_id = folderId || null;
        }
        if (nfcLink) updateData.nfc_link = nfcLink;

        const { data, error } = await supabase
          .from('qrcodes')
          .update(updateData)
          .eq('id', id)
          .select();

        if (error) throw error;
        if (!data || data.length === 0) {
            return res.status(404).json({ message: `QR Code with id ${id} not found` });
        }

        res.status(200).json(data[0]);
      } catch (error: any) {
        res.status(500).json({ message: error.message });
      }
      break;

    case 'DELETE':
      try {
        const { error } = await supabase.from('qrcodes').delete().eq('id', id);
        if (error) throw error;
        res.status(204).end(); // No Content
      } catch (error: any) {
        res.status(500).json({ message: error.message });
      }
      break;

    default:
      res.setHeader('Allow', ['PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
