import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabaseClient';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'GET':
      try {
        const { data: folders, error } = await supabase
          .from('folders')
          .select('*')
          .order('created_at', { ascending: true });

        if (error) throw error;

        res.status(200).json(folders);
      } catch (error: any) {
        res.status(500).json({ message: error.message });
      }
      break;

    case 'POST':
      try {
        const { name, parentId } = req.body;

        if (!name) {
          return res.status(400).json({ message: 'name is required' });
        }

        const { data: newFolder, error } = await supabase
          .from('folders')
          .insert([{ name, parent_id: parentId }])
          .select()
          .single(); // .single() returns a single object instead of an array

        if (error) throw error;

        res.status(201).json(newFolder);
      } catch (error: any) {
        res.status(500).json({ message: error.message });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}