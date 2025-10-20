import { GetServerSideProps } from 'next';
import { supabase } from '@/lib/supabaseClient';

// This page will almost never be rendered. 
// Its sole purpose is to run server-side logic and redirect.
export default function QRRedirectPage() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params || {};

  if (typeof id !== 'string') {
    return { notFound: true };
  }

  try {
    const { data, error } = await supabase
      .from('qrcodes')
      .select('destination_url')
      .eq('id', id)
      .single();

    if (error || !data) {
      console.error('Error fetching QR code for redirect:', error?.message);
      return { notFound: true };
    }

    if (data.destination_url) {
      // If the QR code is found, issue a redirect.
      return {
        redirect: {
          destination: data.destination_url,
          permanent: false, // Use 307 Temporary Redirect
        },
      };
    } else {
      // If the destination URL is empty, show a 404.
      return { notFound: true };
    }
  } catch (error: any) {
    console.error('Error in redirect logic:', error.message);
    return { notFound: true };
  }
};
