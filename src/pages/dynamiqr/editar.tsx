import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { QRCode } from '@/types'; // Import the shared type

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

const QRList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  max-width: 800px;
`;

const QRCard = styled.div`
  background: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  width: 100%;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s;
`;

const SaveButton = styled(Button)`
  background-color: #0070f3;
  &:hover { background-color: #005bb5; }
`;

const DeleteButton = styled(Button)`
  background-color: #d32f2f;
  &:hover { background-color: #b71c1c; }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
`;

const ShortUrl = styled.p`
  font-weight: bold;
  color: #555;
  word-break: break-all;
`;

// --- React Sub-Component for each Row ---
function QRCodeRow({ qr, onUpdate }: { qr: QRCode; onUpdate: () => void }) {
  const [destinationUrl, setDestinationUrl] = useState(qr.destinationUrl);

  const handleSave = async () => {
    await fetch(`/api/qr/${qr.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ destinationUrl }),
    });
    alert('¡Guardado!');
    onUpdate(); // Trigger a refresh
  };

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este QR?')) {
      await fetch(`/api/qr/${qr.id}`, { method: 'DELETE' });
      alert('¡Eliminado!');
      onUpdate(); // Trigger a refresh
    }
  };

  return (
    <QRCard>
      <ShortUrl>URL corta: tuqr.com.mx/dynamiqr/{qr.id}</ShortUrl>
      <Input
        type="url"
        value={destinationUrl}
        onChange={(e) => setDestinationUrl(e.target.value)}
      />
      <ButtonGroup>
        <SaveButton onClick={handleSave}>Guardar</SaveButton>
        <DeleteButton onClick={handleDelete}>Eliminar</DeleteButton>
      </ButtonGroup>
    </QRCard>
  );
}

// --- Main Page Component ---
export default function EditarPage() {
  const [qrCodes, setQrCodes] = useState<QRCode[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchQRCodes = async () => {
    setIsLoading(true);
    const response = await fetch('/api/qr');
    const data = await response.json();
    setQrCodes(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchQRCodes();
  }, []);

  if (isLoading && qrCodes.length === 0) {
    return <PageWrapper><Title>Cargando QRs...</Title></PageWrapper>;
  }

  return (
    <PageWrapper>
      <Title>Editar Códigos QR</Title>
      {qrCodes.length > 0 ? (
        <QRList>
          {qrCodes.map((qr) => (
            <QRCodeRow key={qr.id} qr={qr} onUpdate={fetchQRCodes} />
          ))}
        </QRList>
      ) : (
        <p>No has generado ningún código QR todavía.</p>
      )}
    </PageWrapper>
  );
}
