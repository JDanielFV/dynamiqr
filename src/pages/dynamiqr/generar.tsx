import { useState } from 'react';
import styled from 'styled-components';
import QRCode from 'react-qr-code';
import { QRCode as QRCodeType } from '@/types'; // Import the shared type

// --- Styled Components ---
const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: sans-serif;
  padding: 2rem;
  background-color: #f0f2f5;
  min-height: 100vh;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 500px;
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
`;

const ColorInputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Button = styled.button`
  padding: 0.75rem;
  background-color: #0070f3;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #005bb5;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const QRResultWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const ShortUrl = styled.p`
  font-size: 1.1rem;
  font-weight: bold;
  color: #0070f3;
  margin-top: 1rem;
`;

// --- React Component ---
export default function GenerarPage() {
  const [destinationUrl, setDestinationUrl] = useState('');
  const [qrColor, setQrColor] = useState('#000000');
  const [generatedQR, setGeneratedQR] = useState<QRCodeType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setGeneratedQR(null);

    try {
      const response = await fetch('/api/qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destinationUrl }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate QR code.');
      }

      const newQR = await response.json();
      setGeneratedQR(newQR);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getFullShortUrl = () => {
    if (!generatedQR) return '';
    // In a real app, this would be your domain
    return `tuqr.com.mx/dynamiqr/${generatedQR.id}`;
  };

  return (
    <PageWrapper>
      <Title>Generador de QR Dinámicos</Title>
      <Form onSubmit={handleSubmit}>
        <Input
          type="url"
          placeholder="https://tu-url-de-destino.com"
          value={destinationUrl}
          onChange={(e) => setDestinationUrl(e.target.value)}
          required
        />
        <ColorInputWrapper>
          <label htmlFor="qrColor">Color del QR:</label>
          <input
            id="qrColor"
            type="color"
            value={qrColor}
            onChange={(e) => setQrColor(e.target.value)}
          />
        </ColorInputWrapper>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Generando...' : 'Generar QR'}
        </Button>
      </Form>

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {generatedQR && (
        <QRResultWrapper>
          <QRCode value={getFullShortUrl()} fgColor={qrColor} />
          <ShortUrl>
            URL corta: <strong>{getFullShortUrl()}</strong>
          </ShortUrl>
        </QRResultWrapper>
      )}
    </PageWrapper>
  );
}
