import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import QRCodeStyling, { DotType } from 'qr-code-styling';
import jsPDF from 'jspdf';
import { QRCode as QRCodeType, Folder } from '@/types';

// --- Styled Components ---
const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 500px;
  background: ${({ theme }) => theme.colors.surface};
  padding: 2rem;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: 2rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  border-radius: 4px;
  font-size: 1rem;
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  border-radius: 4px;
  font-size: 1rem;
  width: 100%;
`;

const OptionsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
`;

const ColorInputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const DotStyleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Button = styled.button`
  padding: 0.75rem;
  background-color: ${({ theme }) => theme.colors.primary};
  color: #000;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.border};
    color: ${({ theme }) => theme.colors.textSecondary};
    cursor: not-allowed;
  }
`;

const SecondaryButton = styled(Button)`
    background-color: ${({ theme }) => theme.colors.textSecondary};
    color: ${({ theme }) => theme.colors.background};
`;

const DownloadButton = styled(Button)`
    background-color: ${({ theme }) => theme.colors.secondary};
`;

const QRResultWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${({ theme }) => theme.colors.surface};
  padding: 2rem;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const ShortUrl = styled.p`
  font-size: 1.1rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
  margin-top: 1rem;
`;

// --- React Component ---
export default function GenerarPage() {
  // Descargar SVG vectorial
  const handleDownloadSvg = async () => {
    if (!qrCodeInstanceRef.current) return;
    const svgBlob = await qrCodeInstanceRef.current.getRawData('svg');
    if (!svgBlob) return;
    const url = URL.createObjectURL(svgBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'QRCode.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  const [name, setName] = useState('');
  const [destinationUrl, setDestinationUrl] = useState('');
  // QR siempre negro y redondeado
  const qrColor = '#000000';
  const dotStyle: DotType = 'extra-rounded';
  const [generatedQR, setGeneratedQR] = useState<QRCodeType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedFolder, setSelectedFolder] = useState('');

  const qrRef = useRef<HTMLDivElement>(null);
  const qrCodeInstanceRef = useRef<QRCodeStyling | null>(null);

  useEffect(() => {
    fetch('/api/folders').then(res => res.json()).then(setFolders);
  }, []);

  const getFullShortUrl = () => {
    if (!generatedQR) return '';
    // Use the actual ID from the database, which is now a UUID
    return `tuqr.com.mx/dynamiqr/${generatedQR.id}`;
  };

  useEffect(() => {
    if (generatedQR && qrRef.current) {
      qrRef.current.innerHTML = '';
      qrCodeInstanceRef.current = new QRCodeStyling({
        width: 256,
        height: 256,
        data: getFullShortUrl(),
        dotsOptions: { color: qrColor, type: dotStyle },
        backgroundOptions: { color: '#FFFFFF' },
        qrOptions: {
          version: 1,
          errorCorrectionLevel: 'L',
        },
      });
      qrCodeInstanceRef.current.append(qrRef.current);
    }
  }, [generatedQR]);

  const handleDownloadPdf = async () => {
    if (!qrCodeInstanceRef.current) return;
    const svgBlob = await qrCodeInstanceRef.current.getRawData('svg');
    if (!svgBlob) return;
    const doc = new jsPDF();
    // Leer el SVG como texto
    const reader = new FileReader();
    reader.readAsText(svgBlob);
    reader.onloadend = () => {
      const svgText = reader.result as string;
      // jsPDF v2.5+ soporta SVG directamente
      // El método addSvgAsImage puede requerir el plugin svg de jsPDF
      // Si no tienes el plugin, puedes usar doc.addSvg(svgText, x, y, w, h)
      // Aquí usamos addSvg
      // @ts-ignore
      doc.addSvg(svgText, 15, 40, 180, 180);
      doc.save('QRCode.pdf');
    };
  };

  const handleCreateFolder = async () => {
    const newFolderName = window.prompt('Nombre de la nueva carpeta:');
    if (newFolderName) {
        const res = await fetch('/api/folders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newFolderName })
        });
        const newFolder = await res.json();
        const updatedFolders = [...folders, newFolder];
        setFolders(updatedFolders);
        setSelectedFolder(newFolder.id);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setGeneratedQR(null);
    qrCodeInstanceRef.current = null;

    try {
      const response = await fetch('/api/qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, destinationUrl, folderId: selectedFolder || undefined }),
      });
      if (!response.ok) throw new Error('Failed to generate QR code.');
      const newQR = await response.json();
      setGeneratedQR(newQR);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageWrapper>
      <Title>Generador de QR Dinámicos</Title>
      <Form onSubmit={handleSubmit}>
        <Input type="text" placeholder="Nombre del QR" value={name} onChange={(e) => setName(e.target.value)} required />
        <Input type="url" placeholder="https://tu-url-de-destino.com" value={destinationUrl} onChange={(e) => setDestinationUrl(e.target.value)} required />
        
        <label htmlFor="folder">Carpeta:</label>
        <div style={{display: 'flex', gap: '10px'}}>
            <Select id="folder" value={selectedFolder} onChange={(e) => setSelectedFolder(e.target.value)}>
                <option value="">Sin carpeta</option>
                {folders.map(folder => (
                    <option key={folder.id} value={folder.id}>{folder.name}</option>
                ))}
            </Select>
            <SecondaryButton type="button" onClick={handleCreateFolder}>Crear</SecondaryButton>
        </div>

        {/* Opciones de color y estilo eliminadas, QR siempre negro y redondeado */}
        <Button type="submit" disabled={isLoading}>{isLoading ? 'Generando...' : 'Generar QR'}</Button>
      </Form>

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {generatedQR && (
        <QRResultWrapper>
          <div ref={qrRef} />
          <ShortUrl>URL corta: <strong>{getFullShortUrl()}</strong></ShortUrl>
          <DownloadButton onClick={handleDownloadPdf} style={{marginTop: '1rem'}}>Descargar PDF</DownloadButton>
          <DownloadButton onClick={handleDownloadSvg} style={{marginTop: '1rem'}}>Descargar SVG</DownloadButton>
        </QRResultWrapper>
      )}
    </PageWrapper>
  );
}