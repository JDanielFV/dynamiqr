import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabaseClient';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'GET':
      try {
        const { data, error } = await supabase.from('folders').select('*');
        if (error) throw error;
        res.status(200).json(data);
      } catch (error: any) {
        res.status(500).json({ message: error.message });
      }
      break;

    case 'POST':
      try {
        const { name } = req.body;

        if (!name) {
          return res.status(400).json({ message: 'name is required' });
        }
        
        const { data, error } = await supabase
          .from('folders')
          .insert([{ name }])
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
