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
    case 'PUT': // Rename folder
      try {
        const { name } = req.body;
        if (!name) {
          return res.status(400).json({ message: 'name is required' });
        }
        
        const { data, error } = await supabase
          .from('folders')
          .update({ name })
          .eq('id', id)
          .select();

        if (error) throw error;
        if (!data || data.length === 0) {
          return res.status(404).json({ message: `Folder with id ${id} not found` });
        }

        res.status(200).json(data[0]);
      } catch (error: any) {
        res.status(500).json({ message: error.message });
      }
      break;

    case 'DELETE': // Delete folder
      try {
        // Supabase handles unlinking via foreign key constraints (set to null)
        const { error } = await supabase.from('folders').delete().eq('id', id);

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
