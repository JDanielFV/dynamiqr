import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import Link from 'next/link';
import { QRCode, Folder } from '@/types';
import ContextMenu from '@/components/ContextMenu';
import Modal from '@/components/Modal';
import QRCodeComponent from '@/components/QRCode'; // Assuming this component is for display, not generation

// --- Styled Components ---

const PageWrapper = styled.div`
  padding: 2rem;
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 2rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1.5rem;
`;

const FolderItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 1rem;
  border-radius: 8px;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.surface};
  }
`;

const FolderIcon = styled.div`
  font-size: 4rem; // Placeholder for a real icon
`;

const FolderName = styled.span`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.primary};
  text-align: center;
`;

const BackButton = styled.button`
  background: none;
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.primary};
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 2rem;

  &:hover {
    background-color: ${({ theme }) => theme.colors.border};
  }
`;

const Button = styled.button`
  background: rgba(187, 134, 252, 0.2); // theme.colors.primary
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px); // For Safari
  border: 1px solid rgba(187, 134, 252, 0.5);
  border-radius: 12px;
  color: ${({ theme }) => theme.colors.text};
  padding: 0.75rem 1.25rem;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    background: rgba(187, 134, 252, 0.3);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }

  &:disabled {
    background: rgba(255, 255, 255, 0.05);
    color: ${({ theme }) => theme.colors.textSecondary};
    cursor: not-allowed;
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
    transform: none;
    box-shadow: none;
    border-color: rgba(255, 255, 255, 0.1);
  }
`;

// Download button style, extending the primary Button.
const DownloadButton = styled(Button)`
  background: rgba(3, 218, 198, 0.2); // theme.colors.secondary
  border-color: rgba(3, 218, 198, 0.5);
  &:hover {
    background: rgba(3, 218, 198, 0.3);
  }
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.background};
  color: white; /* Changed from theme.colors.text to white */
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

const QRItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 1rem;
  border-radius: 8px;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.surface};
  }
`;

const QRPreview = styled.div`
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  overflow: hidden;

  svg {
    width: 90%;
    height: 90%;
  }
`;

const QRName = styled.span`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.primary};
  text-align: center;
`;

const QRGrid = ({ qrs, onSelectQR, onBack }: { qrs: QRCode[]; onSelectQR: (qr: QRCode) => void; onBack: () => void; }) => {
  return (
    <div>
      <BackButton onClick={onBack}>← Volver a Carpetas</BackButton>
      <Grid>
        {qrs.map(qr => (
          <QRItem key={qr.id} onClick={() => onSelectQR(qr)}>
            <QRPreview>
              <QRCodeComponent data={`tuqr.com.mx/qr/index.php?id=${qr.id}`} />
            </QRPreview>
            <QRName>{qr.name}</QRName>
          </QRItem>
        ))}
      </Grid>
    </div>
  );
};

const QREditView = ({ qr, folders, onUpdate, archiveFolderId, onBack }: { qr: QRCode; folders: Folder[]; onUpdate: () => void; archiveFolderId: string | null; onBack: () => void; }) => {
  const [name, setName] = useState(qr.name);
  const [destinationUrl, setDestinationUrl] = useState(qr.destinationUrl);
  const [folderId, setFolderId] = useState(qr.folderId || '');
  const [nfcLink, setNfcLink] = useState(qr.nfcLink || '');

  // State and refs for QR code rendering and download
  const [QRCodeStylingModule, setQRCodeStylingModule] = useState<any>(null);
  const qrRef = useRef<HTMLDivElement>(null);
  const qrCodeInstanceRef = useRef<any>(null);

  // Dynamic import of qr-code-styling
  useEffect(() => {
    import('qr-code-styling').then((mod) => {
      setQRCodeStylingModule(() => mod.default);
    });
  }, []);

  // Fixed QR code styling options (color and dot style).
  const qrColor = '#000000';
  const dotStyle = 'extra-rounded';

  // Generates the full short URL for the QR code based on its ID.
  const getFullShortUrl = () => {
    return `tuqr.com.mx/qr/index.php?id=${qr.id}`;
  };

  // Effect hook to render the QR code when 'qr' or 'QRCodeStylingModule' changes.
  useEffect(() => {
    if (!QRCodeStylingModule || !qrRef.current) return;

    // Clear previous QR code
    qrRef.current.innerHTML = '';

    qrCodeInstanceRef.current = new QRCodeStylingModule({
      width: 200, // Smaller size for edit view
      height: 200,
      data: getFullShortUrl(),
      dotsOptions: { color: qrColor, type: dotStyle },
      backgroundOptions: { color: '#FFFFFF' },
      qrOptions: {
        version: 1,
        errorCorrectionLevel: 'L',
      },
    });
    qrCodeInstanceRef.current.append(qrRef.current);
  }, [qr, QRCodeStylingModule]);

  // Handles downloading the generated QR code as an SVG file.
  const handleDownloadSvg = async () => {
    if (!qrCodeInstanceRef.current) return;
    const svgBlob = await qrCodeInstanceRef.current.getRawData('svg');
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

  const handleSave = async () => {
    await fetch(`/api/qr/${qr.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, destinationUrl, folderId: folderId || undefined, nfcLink }),
    });
    alert('¡Guardado!');
    onUpdate();
  };

  const handleArchive = async () => {
    if (!archiveFolderId) return;
    await fetch(`/api/qr/${qr.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folderId: archiveFolderId }),
    });
    alert('¡Archivado!');
    onUpdate();
    onBack();
  }

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este QR permanentemente? Esta acción no se puede deshacer.')) {
      await fetch(`/api/qr/${qr.id}`, { method: 'DELETE' });
      alert('¡Eliminado!');
      onUpdate();
      onBack();
    }
  };

  return (
    <div>
      <BackButton onClick={onBack}>← Volver</BackButton>
      <h2>Editando: {qr.name}</h2>
      <div ref={qrRef} style={{ marginBottom: '1rem' }} /> {/* QR code display */}
      <Input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      <Input type="url" value={destinationUrl} onChange={(e) => setDestinationUrl(e.target.value)} />
      <Input type="url" placeholder="Enlace NFC (opcional)" value={nfcLink} onChange={(e) => setNfcLink(e.target.value)} />
      <Select value={folderId} onChange={(e) => setFolderId(e.target.value)}>
        <option value="">Sin carpeta</option>
        {folders.filter(f => f.id !== archiveFolderId).map(folder => (
            <option key={folder.id} value={folder.id}>{folder.name}</option>
        ))}
      </Select>
      <button onClick={handleSave}>Guardar</button>
      <button onClick={handleArchive}>Archivar</button>
      <button onClick={handleDelete}>Eliminar</button>
      <DownloadButton onClick={handleDownloadSvg}>Descargar SVG</DownloadButton> {/* Download button */}
    </div>
  );
};

const FolderGrid = ({ folders, onSelectFolder, onUpdate }: { folders: (Folder | { id: string; name: string })[]; onSelectFolder: (folderId: string) => void; onUpdate: () => void; }) => {
  const [contextMenu, setContextMenu] = useState<{ top: number; left: number; folder: Folder | { id: string; name: string } } | null>(null);
  const [modal, setModal] = useState<{ type: 'rename' | 'delete' | 'create-subfolder'; folder?: Folder | { id: string; name: string } } | null>(null);
  const [newName, setNewName] = useState('');

  const handleContextMenu = (e: React.MouseEvent, folder: Folder | { id: string; name: string }) => {
    e.preventDefault();
    setContextMenu({ top: e.clientY, left: e.clientX, folder });
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  const handleRename = async () => {
    if (newName && newName !== modal?.folder?.name) {
        await fetch(`/api/folders/${modal?.folder?.id}`,
            {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newName })
            });
        onUpdate();
        setModal(null);
    }
  };

  const handleCreateSubfolder = async () => {
    if (newName) {
        await fetch(`/api/folders`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newName, parentId: modal?.folder?.id })
            });
        onUpdate();
        setModal(null);
    }
  };

  const handleDelete = async (deleteQRs: boolean) => {
    if (deleteQRs) {
      await fetch(`/api/folders/${modal?.folder?.id}/with-qrs`, { method: 'DELETE' });
    } else {
      await fetch(`/api/folders/${modal?.folder?.id}`, { method: 'DELETE' });
    }
    onUpdate();
    setModal(null);
  };

  const contextMenuOptions = contextMenu ? [
    {
      label: 'Renombrar',
      onClick: () => setModal({ type: 'rename', folder: contextMenu.folder }),
    },
    {
      label: 'Crear subcarpeta',
      onClick: () => setModal({ type: 'create-subfolder', folder: contextMenu.folder }),
    },
    {
      label: 'Eliminar',
      onClick: () => setModal({ type: 'delete', folder: contextMenu.folder }),
    },
  ] : [];

  return (
    <>
      <Grid>
        {folders.map(folder => (
          <FolderItem key={folder.id} onClick={() => onSelectFolder(folder.id)} onContextMenu={(e) => handleContextMenu(e, folder)}>
            <FolderIcon>📁</FolderIcon>
            <FolderName>{folder.name}</FolderName>
          </FolderItem>
        ))}
      </Grid>
      {contextMenu && <ContextMenu top={contextMenu.top} left={contextMenu.left} onClose={handleCloseContextMenu} options={contextMenuOptions} />}
      {modal && (
        <Modal onClose={() => setModal(null)}>
          {modal.type === 'rename' && (
            <>
              <h2>Renombrar Carpeta</h2>
              <Input type="text" defaultValue={modal.folder?.name} onChange={(e) => setNewName(e.target.value)} />
              <button onClick={handleRename}>Guardar</button>
            </>
          )}
          {modal.type === 'create-subfolder' && (
            <>
              <h2>Crear Subcarpeta en "{modal.folder?.name}"</h2>
              <Input type="text" placeholder="Nombre de la subcarpeta" onChange={(e) => setNewName(e.target.value)} />
              <button onClick={handleCreateSubfolder}>Crear</button>
            </>
          )}
          {modal.type === 'delete' && (
            <>
              <h2>Eliminar Carpeta</h2>
              <p>¿Estás seguro de que quieres eliminar la carpeta "{modal.folder?.name}"?</p>
              <button onClick={() => handleDelete(false)}>Eliminar solo la carpeta</button>
              <button onClick={() => handleDelete(true)}>Eliminar carpeta y QRs</button>
            </>
          )}
        </Modal>
      )}
    </>
  );
};

export default function EditarPage() {
  const [view, setView] = useState('folders'); // 'folders', 'qrs', 'edit-qr'
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [selectedQR, setSelectedQR] = useState<QRCode | null>(null);

  const [qrCodes, setQrCodes] = useState<QRCode[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [archiveFolderId, setArchiveFolderId] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [qrRes, foldersRes] = await Promise.all([
          fetch('/api/qr'),
          fetch('/api/folders')
      ]);
      let [qrData, foldersData] = await Promise.all([
          qrRes.json(),
          foldersRes.json()
      ]);
      console.log("Fetched QR Data:", qrData);
      console.log("Fetched Folders Data:", foldersData);

      // Find or create archive folder
      let archiveFolder = foldersData.find((f: Folder) => f.name === 'Archivo');
      if (!archiveFolder) {
          console.log("Archive folder not found, creating...");
          const res = await fetch('/api/folders', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name: 'Archivo' })
          });
          archiveFolder = await res.json();
          foldersData.push(archiveFolder);
          console.log("Archive folder created:", archiveFolder);
      }
      setArchiveFolderId(archiveFolder.id);
      console.log("Archive Folder ID:", archiveFolder.id);

      // Transform snake_case to camelCase
      const transformedQrData = qrData.map((qr: any) => ({
          id: qr.id,
          name: qr.name,
          destinationUrl: qr.destination_url,
          nfcLink: qr.nfc_link,
          createdAt: qr.created_at,
          folderId: qr.folder_id,
      }));
      console.log("Transformed QR Data:", transformedQrData);

      setQrCodes(transformedQrData);
      setFolders(foldersData);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Optionally, set an error state to display a message to the user
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSelectFolder = (folderId: string) => {
    setView('qrs');
    setCurrentFolderId(folderId);
  };

  const handleSelectQR = (qr: QRCode) => {
    setSelectedQR(qr);
    setView('edit-qr');
  };

  const handleBackToFolders = () => {
    const currentFolder = folders.find(f => f.id === currentFolderId);
    if (currentFolder?.parentId) {
      setCurrentFolderId(currentFolder.parentId);
    } else {
      setCurrentFolderId(null);
      setView('folders');
    }
  };

  const handleBackToQRs = () => {
    setView('qrs');
    setSelectedQR(null);
  };

  const renderContent = () => {
    console.log("Current View:", view);
    console.log("Current Folder ID:", currentFolderId);
    if (isLoading) {
      return <Title>Cargando...</Title>;
    }

    switch (view) {
      case 'qrs':
        const qrsInFolder = currentFolderId === 'unassigned'
          ? qrCodes.filter(qr => !qr.folderId)
          : qrCodes.filter(qr => qr.folderId === currentFolderId);
        console.log("QRs in Folder:", qrsInFolder);
        return <QRGrid qrs={qrsInFolder} onSelectQR={handleSelectQR} onBack={handleBackToFolders} />;
      case 'edit-qr':
        if (!selectedQR) return null;
        console.log("Selected QR:", selectedQR);
        return <QREditView qr={selectedQR} folders={folders} onUpdate={fetchData} archiveFolderId={archiveFolderId} onBack={handleBackToQRs} />; 
      case 'folders':
      default:
        const foldersToShow = folders.filter(f => ((currentFolderId === null && !f.parentId) || (f.parentId === currentFolderId)) && f.name !== 'Archivo');
        const allFoldersForGrid = currentFolderId === null ? [{ id: 'unassigned', name: 'Sin Carpeta' }, ...foldersToShow] : foldersToShow;
        console.log("Folders to Show:", foldersToShow);
        console.log("All Folders for Grid:", allFoldersForGrid);
        return (
          <>
            {currentFolderId && <BackButton onClick={handleBackToFolders}>← Volver</BackButton>}
            <FolderGrid folders={allFoldersForGrid} onSelectFolder={handleSelectFolder} onUpdate={fetchData} />
          </>
        );
    }
  };

  return (
    <PageWrapper>
      <Title>Editar Códigos QR</Title>
      {renderContent()}
      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
        <Link href="/dynamiqr/generar"><Button>Generar</Button></Link>
        <Link href="/dashboard"><Button>Dashboard</Button></Link>
      </div>
    </PageWrapper>
  );
}