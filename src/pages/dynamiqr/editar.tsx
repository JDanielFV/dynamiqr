import { useState, useEffect } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { QRCode, Folder } from '@/types';

// --- Styled Components ---
const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  position: relative;
`;

const NavLink = styled.a`
  position: absolute;
  top: 2rem;
  right: 2rem;
  background: ${({ theme }) => theme.colors.secondary};
  color: #000;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: bold;
  text-decoration: none;
  &:hover {
    opacity: 0.9;
  }
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 2rem;
`;

const ContentWrapper = styled.div`
    width: 100%;
    max-width: 800px;
`;

const FolderContainer = styled.section`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  margin-bottom: 1.5rem;
  overflow: hidden;
`;

const FolderHeader = styled.div`
  padding: 1rem 1.5rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  user-select: none;

  &:hover {
    background: #2a2a2a;
  }
`;

const FolderTitle = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.2rem;
`;

const FolderControls = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
`;

const FolderActionButton = styled.button`
    background: none;
    border: none;
    color: ${({ theme }) => theme.colors.textSecondary};
    cursor: pointer;
    font-size: 0.8rem;
    &:hover { color: ${({ theme }) => theme.colors.text}; }
`;

const QRList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.5rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const QRCard = styled.div`
  background: ${({ theme }) => theme.colors.background};
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: #333;
  color: ${({ theme }) => theme.colors.text};
  border-radius: 4px;
  font-size: 1rem;
  width: 100%;
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: #333;
  color: ${({ theme }) => theme.colors.text};
  border-radius: 4px;
  font-size: 1rem;
  width: 100%;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  color: #000;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s;
`;

const SaveButton = styled(Button)`
  background-color: ${({ theme }) => theme.colors.primary};
  &:hover { opacity: 0.9; }
`;

const DeleteButton = styled(Button)`
  background-color: ${({ theme }) => theme.colors.error};
  &:hover { opacity: 0.9; }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
`;

const DownloadButton = styled(Button)`
  background-color: ${({ theme }) => theme.colors.secondary};
`;

const ShortUrl = styled.p`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  word-break: break-all;
`;

const InputGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

// --- Sub-Components ---
function QRCodeRow({ qr, folders, onUpdate }: { qr: QRCode; folders: Folder[]; onUpdate: () => void }) {
  // Descargar SVG vectorial
  const handleDownloadSvg = async () => {
    const QRCodeStyling = (await import('qr-code-styling')).default;
    const qrCodeInstance = new QRCodeStyling({
      width: 256,
      height: 256,
      data: `tuqr.com.mx/qr/index.php?id=${qr.id}`,
      dotsOptions: { color: '#000000', type: 'extra-rounded' },
      backgroundOptions: { color: '#FFFFFF' },
    });
    const svgBlob = await qrCodeInstance.getRawData('svg');
    if (!svgBlob) return;
    const url = URL.createObjectURL(svgBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${qr.name || 'QRCode'}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  // Descargar QR como PDF
  const handleDownload = async () => {
    // Importar dinámicamente para evitar problemas SSR
    const QRCodeStyling = (await import('qr-code-styling')).default;
    const jsPDF = (await import('jspdf')).default;
    const qrCodeInstance = new QRCodeStyling({
      width: 256,
      height: 256,
      data: `tuqr.com.mx/qr/index.php?id=${qr.id}`,
      dotsOptions: { color: '#000000', type: 'extra-rounded' },
      backgroundOptions: { color: '#1E1E1E' },
    });
    const blob = await qrCodeInstance.getRawData('png');
    if (!blob) return;
    const doc = new jsPDF();
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      const base64data = reader.result as string;
      doc.addImage(base64data, 'PNG', 15, 40, 180, 180);
      doc.save(`${qr.name || 'QRCode'}.pdf`);
    };
  };
  const [name, setName] = useState(qr.name);
  const [destinationUrl, setDestinationUrl] = useState(qr.destinationUrl);
  const [folderId, setFolderId] = useState(qr.folderId || '');

  const handleSave = async () => {
    await fetch(`/api/qr/${qr.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, destinationUrl, folderId: folderId || undefined }),
    });
    alert('¡Guardado!');
    onUpdate();
  };

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este QR?')) {
      await fetch(`/api/qr/${qr.id}`, { method: 'DELETE' });
      alert('¡Eliminado!');
      onUpdate();
    }
  };

  return (
    <QRCard>
        <InputGroup>
            <label>Nombre:</label>
            <Input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </InputGroup>
        <InputGroup>
            <label>URL de Destino:</label>
            <Input type="url" value={destinationUrl} onChange={(e) => setDestinationUrl(e.target.value)} />
        </InputGroup>
        <InputGroup>
            <label>Carpeta:</label>
            <Select value={folderId} onChange={(e) => setFolderId(e.target.value)}>
                <option value="">Sin carpeta</option>
                {folders.map(folder => (
                    <option key={folder.id} value={folder.id}>{folder.name}</option>
                ))}
            </Select>
        </InputGroup>
      <ShortUrl>URL corta: tuqr.com.mx/qr/index.php?id={qr.id}</ShortUrl>
      <ButtonGroup>
        <SaveButton onClick={handleSave}>Guardar</SaveButton>
        <DeleteButton onClick={handleDelete}>Eliminar</DeleteButton>
        <DownloadButton onClick={handleDownload}>Descargar</DownloadButton>
        <DownloadButton onClick={handleDownloadSvg}>Descargar SVG</DownloadButton>
      </ButtonGroup>
    </QRCard>
  );
}

function FolderSection({ folder, qrs, allFolders, onUpdate, defaultExpanded = true }: {
    folder: Folder | {id: string, name: string}; // Can be a real folder or a fake one for "Sin Carpeta"
    qrs: QRCode[];
    allFolders: Folder[];
    onUpdate: () => void;
    defaultExpanded?: boolean;
}) {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);

    const handleRename = async (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent toggling the accordion
        const newName = window.prompt('Nuevo nombre para la carpeta:', folder.name);
        if (newName && newName !== folder.name) {
            await fetch(`/api/folders/${folder.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newName })
            });
            onUpdate();
        }
    };

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm(`¿Seguro que quieres eliminar la carpeta "${folder.name}"? Los QRs dentro no se borrarán.`)) {
            await fetch(`/api/folders/${folder.id}`, { method: 'DELETE' });
            onUpdate();
        }
    };

    return (
        <FolderContainer>
            <FolderHeader onClick={() => setIsExpanded(!isExpanded)}>
                <FolderTitle>{folder.name}</FolderTitle>
                <FolderControls>
                    {folder.id !== 'unassigned' && (
                        <>
                            <FolderActionButton onClick={handleRename}>Editar nombre</FolderActionButton>
                            <FolderActionButton onClick={handleDelete}>Eliminar</FolderActionButton>
                        </>
                    )}
                    <span>{isExpanded ? '▼' : '►'}</span>
                </FolderControls>
            </FolderHeader>
            {isExpanded && (
                <QRList>
                    {qrs.length > 0 ? (
                        qrs.map(qr => (
                            <QRCodeRow key={qr.id} qr={qr} folders={allFolders} onUpdate={onUpdate} />
                        ))
                    ) : (
                        <p style={{padding: '0 1.5rem'}}>Esta carpeta está vacía.</p>
                    )}
                </QRList>
            )}
        </FolderContainer>
    );
}

// --- Main Page Component ---
export default function EditarPage() {
  const [qrCodes, setQrCodes] = useState<QRCode[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    const [qrRes, foldersRes] = await Promise.all([
        fetch('/api/qr'),
        fetch('/api/folders')
    ]);
    const [qrData, foldersData] = await Promise.all([
        qrRes.json(),
        foldersRes.json()
    ]);

    // Transform snake_case to camelCase
    const transformedQrData = qrData.map((qr: QRCode & { destination_url: string, folder_id: string }) => ({
        id: qr.id,
        name: qr.name,
        destinationUrl: qr.destination_url,
        createdAt: qr.created_at,
        folderId: qr.folder_id,
    }));

    setQrCodes(transformedQrData);
    setFolders(foldersData); // Folders table already uses 'name' and 'id', so no transformation needed.
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const sortedFolders = [...folders].sort((a, b) => a.name.localeCompare(b.name));
  const qrsWithoutFolder = qrCodes.filter(qr => !qr.folderId);

  if (isLoading) {
    return <PageWrapper><Title>Cargando QRs...</Title></PageWrapper>;
  }

  return (
    <PageWrapper>
      <Link href="/dynamiqr/generar" passHref>
        <NavLink>Generar</NavLink>
      </Link>
      <Title>Editar Códigos QR</Title>
      <ContentWrapper>
        {sortedFolders.map(folder => (
            <FolderSection 
                key={folder.id} 
                folder={folder} 
                qrs={qrCodes.filter(qr => qr.folderId === folder.id)}
                allFolders={folders}
                onUpdate={fetchData}
            />
        ))}

        <FolderSection 
            folder={{id: 'unassigned', name: 'Sin Carpeta'}}
            qrs={qrsWithoutFolder}
            allFolders={folders}
            onUpdate={fetchData}
        />

        {qrCodes.length === 0 && (
            <p>No has generado ningún código QR todavía.</p>
        )}
      </ContentWrapper>
    </PageWrapper>
  );
}