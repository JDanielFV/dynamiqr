import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabaseClient';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (req.method !== 'DELETE') {
    res.setHeader('Allow', ['DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  if (typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid ID' });
  }

  try {
    // First, delete all QRs in the folder
    const { error: qrError } = await supabase
      .from('qrcodes')
      .delete()
      .eq('folder_id', id);

    if (qrError) throw qrError;

    // Then, delete the folder itself
    const { error: folderError } = await supabase
      .from('folders')
      .delete()
      .eq('id', id);

    if (folderError) throw folderError;

    res.status(204).end(); // No Content
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}
