import { GetServerSideProps } from 'next';
import path from 'path';
import { promises as fs } from 'fs';

// We can reuse the types, but for self-containment, we define them here.
interface QRCode {
  id: string;
  destinationUrl: string;
  createdAt: string;
}

interface Database {
  qrcodes: Record<string, QRCode>;
}

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
    const dbPath = path.resolve(process.cwd(), 'db.json');
    const fileContent = await fs.readFile(dbPath, 'utf-8');
    const db = JSON.parse(fileContent) as Database;

    const qrCode = db.qrcodes[id];

    if (qrCode && qrCode.destinationUrl) {
      // If the QR code is found, issue a redirect.
      return {
        redirect: {
          destination: qrCode.destinationUrl,
          permanent: false, // Use 307 Temporary Redirect
        },
      };
    } else {
      // If the QR code is not found, show a 404 page.
      return { notFound: true };
    }
  } catch (error) {
    console.error('Error reading database for redirect:', error);
    // If there's any error (e.g., db.json not found), show a 404.
    return { notFound: true };
  }
};
