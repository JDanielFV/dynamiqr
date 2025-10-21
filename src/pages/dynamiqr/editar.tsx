import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
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
  background: rgba(3, 218, 198, 0.2); // theme.colors.secondary
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(3, 218, 198, 0.5);
  border-radius: 12px;
  color: ${({ theme }) => theme.colors.text};
  padding: 0.5rem 1rem;
  font-weight: bold;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    background: rgba(3, 218, 198, 0.3);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
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
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px); // For Safari
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: ${({ theme }) => theme.colors.text};
  padding: 0.5rem 1rem;
  font-weight: bold;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    background: rgba(255, 255, 255, 0.2);
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
  }
`;

const SaveButton = styled(Button)`
  background: rgba(187, 134, 252, 0.2); // theme.colors.primary
  border-color: rgba(187, 134, 252, 0.5);
  &:hover {
    background: rgba(187, 134, 252, 0.3);
  }
`;

const DeleteButton = styled(Button)`
  background: rgba(207, 102, 121, 0.2); // theme.colors.error
  border-color: rgba(207, 102, 121, 0.5);
  &:hover {
    background: rgba(207, 102, 121, 0.3);
  }
`;

const SecondaryButton = styled(Button)`
  background: rgba(179, 179, 179, 0.2); // theme.colors.textSecondary
  border-color: rgba(179, 179, 179, 0.5);
  color: ${({ theme }) => theme.colors.text};
  &:hover {
    background: rgba(179, 179, 179, 0.3);
  }
`;

const DownloadButton = styled(Button)`
  background: rgba(3, 218, 198, 0.2); // theme.colors.secondary
  border-color: rgba(3, 218, 198, 0.5);
  &:hover {
    background: rgba(3, 218, 198, 0.3);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
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

const QRListItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  transition: all 0.2s;
  
  span {
    cursor: pointer;
    flex-grow: 1;
  }

  &:hover {
    background: #2a2a2a;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

// --- Sub-Components ---
function QRCodeRow({ qr, folders, onUpdate, archiveFolderId }: { qr: QRCode; folders: Folder[]; onUpdate: () => void; archiveFolderId: string | null }) {
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

  const [name, setName] = useState(qr.name);
  const [destinationUrl, setDestinationUrl] = useState(qr.destinationUrl);
  const [folderId, setFolderId] = useState(qr.folderId || '');
  const [isRecovering, setIsRecovering] = useState(false);
  const [recoveryFolderId, setRecoveryFolderId] = useState('');

  const isArchived = qr.folderId === archiveFolderId;

  const handleSave = async () => {
    await fetch(`/api/qr/${qr.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, destinationUrl, folderId: folderId || undefined }),
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
  }

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este QR permanentemente? Esta acción no se puede deshacer.')) {
      await fetch(`/api/qr/${qr.id}`, { method: 'DELETE' });
      alert('¡Eliminado!');
      onUpdate();
    }
  };

  const handleRecover = async () => {
    await fetch(`/api/qr/${qr.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folderId: recoveryFolderId || null }),
    });
    alert('¡Recuperado!');
    onUpdate();
    setIsRecovering(false);
  };

  if (isRecovering) {
    return (
        <QRCard>
            <p>Mover "{qr.name}" a:</p>
            <Select value={recoveryFolderId} onChange={(e) => setRecoveryFolderId(e.target.value)}>
                <option value="">Sin carpeta</option>
                {folders.filter(f => f.id !== archiveFolderId).map(folder => (
                    <option key={folder.id} value={folder.id}>{folder.name}</option>
                ))}
            </Select>
            <ButtonGroup>
                <Button onClick={() => setIsRecovering(false)}>Cancelar</Button>
                <SaveButton onClick={handleRecover}>Confirmar</SaveButton>
            </ButtonGroup>
        </QRCard>
    )
  }

  return (
    <QRCard>
        <InputGroup>
            <label>Nombre:</label>
            <Input type="text" value={name} onChange={(e) => setName(e.target.value)} disabled={isArchived} />
        </InputGroup>
        <InputGroup>
            <label>URL de Destino:</label>
            <Input type="url" value={destinationUrl} onChange={(e) => setDestinationUrl(e.target.value)} disabled={isArchived} />
        </InputGroup>
        <InputGroup>
            <label>Carpeta:</label>
            <Select value={folderId} onChange={(e) => setFolderId(e.target.value)} disabled={isArchived}>
                <option value="">Sin carpeta</option>
                {folders.filter(f => f.id !== archiveFolderId).map(folder => (
                    <option key={folder.id} value={folder.id}>{folder.name}</option>
                ))}
            </Select>
        </InputGroup>
      <ShortUrl>URL corta: tuqr.com.mx/qr/index.php?id={qr.id}</ShortUrl>
      <ButtonGroup>
        {isArchived ? (
            <>
                <DeleteButton onClick={handleDelete}>Eliminar Definitivamente</DeleteButton>
                <SecondaryButton onClick={() => setIsRecovering(true)}>Recuperar</SecondaryButton>
            </>
        ) : (
            <>
                <SaveButton onClick={handleSave}>Guardar</SaveButton>
                <SecondaryButton onClick={handleArchive}>Archivar</SecondaryButton>
                <DownloadButton onClick={handleDownloadSvg}>Descargar SVG</DownloadButton>
            </>
        )}
      </ButtonGroup>
    </QRCard>
  );
}

function FolderSection({ folder, qrs, allFolders, onUpdate, defaultExpanded = true, archiveFolderId, open }: {
    folder: Folder | {id: string, name: string};
    qrs: QRCode[];
    allFolders: Folder[];
    onUpdate: () => void;
    defaultExpanded?: boolean;
    archiveFolderId: string | null;
    open?: boolean;
}) {
    const [isExpanded, setIsExpanded] = useState(open || defaultExpanded);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingQrId, setEditingQrId] = useState<string | null>(null);
    const [selectedQrIds, setSelectedQrIds] = useState<string[]>([]);

    const handleRename = async (e: React.MouseEvent) => {
        e.stopPropagation();
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

    const filteredQrs = qrs.filter(qr =>
        qr.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleQrUpdate = () => {
        onUpdate();
        setEditingQrId(null);
    }

    const editingQr = qrs.find(qr => qr.id === editingQrId);

    const handleSelect = (qrId: string) => {
        setSelectedQrIds(prev =>
            prev.includes(qrId) ? prev.filter(id => id !== qrId) : [...prev, qrId]
        );
    };

    const handleSelectAll = () => {
        if (selectedQrIds.length === filteredQrs.length) {
            setSelectedQrIds([]);
        } else {
            setSelectedQrIds(filteredQrs.map(qr => qr.id));
        }
    };

    const handleBulkArchive = async () => {
        if (window.confirm(`¿Estás seguro de que quieres archivar ${selectedQrIds.length} códigos QR?`)) {
            await Promise.all(selectedQrIds.map(id =>
                fetch(`/api/qr/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ folderId: archiveFolderId }),
                })
            ));
            setSelectedQrIds([]);
            onUpdate();
        }
    };

    const handleBulkDelete = async () => {
        if (window.confirm(`¿Estás seguro de que quieres eliminar ${selectedQrIds.length} códigos QR permanentemente?`)) {
            await Promise.all(selectedQrIds.map(id =>
                fetch(`/api/qr/${id}`, { method: 'DELETE' })
            ));
            setSelectedQrIds([]);
            onUpdate();
        }
    };

    const isArchiveFolder = folder.id === archiveFolderId;

    return (
        <FolderContainer>
            <FolderHeader onClick={() => { setIsExpanded(!isExpanded); setEditingQrId(null); }}>
                <FolderTitle>{folder.name}</FolderTitle>
                <FolderControls>
                    {folder.id !== 'unassigned' && folder.name !== 'Archivo' && (
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
                    {editingQrId && editingQr ? (
                        <>
                            <Button onClick={() => setEditingQrId(null)} style={{ marginBottom: '1rem', alignSelf: 'flex-start' }}>← Volver a la lista</Button>
                            <QRCodeRow
                                key={editingQr.id}
                                qr={editingQr}
                                folders={allFolders}
                                onUpdate={handleQrUpdate}
                                archiveFolderId={archiveFolderId}
                            />
                        </>
                    ) : (
                        <>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <Input
                                    type="search"
                                    placeholder="Buscar en esta carpeta..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onClick={(e) => e.stopPropagation()}
                                    style={{ width: '50%' }}
                                />
                                {selectedQrIds.length > 0 && (
                                    <div>
                                        {isArchiveFolder ? (
                                            <DeleteButton onClick={handleBulkDelete}>Eliminar seleccionados ({selectedQrIds.length})</DeleteButton>
                                        ) : (
                                            <SecondaryButton onClick={handleBulkArchive}>Archivar seleccionados ({selectedQrIds.length})</SecondaryButton>
                                        )}
                                    </div>
                                )}
                            </div>
                            <QRListItem>
                                <input
                                    type="checkbox"
                                    checked={selectedQrIds.length === filteredQrs.length && filteredQrs.length > 0}
                                    onChange={handleSelectAll}
                                    style={{ marginRight: '1rem', transform: 'scale(1.5)' }}
                                />
                                <label>Seleccionar todo</label>
                            </QRListItem>
                            {filteredQrs.length > 0 ? (
                                filteredQrs.map(qr => (
                                    <QRListItem key={qr.id}>
                                        <input
                                            type="checkbox"
                                            checked={selectedQrIds.includes(qr.id)}
                                            onChange={() => handleSelect(qr.id)}
                                            style={{ marginRight: '1rem', transform: 'scale(1.5)' }}
                                        />
                                        <span onClick={() => setEditingQrId(qr.id)}>{qr.name}</span>
                                    </QRListItem>
                                ))
                            ) : (
                                <p style={{padding: '0 1.5rem'}}>
                                    {qrs.length > 0 ? 'No hay resultados para tu búsqueda.' : 'Esta carpeta está vacía.'}
                                </p>
                            )}
                        </>
                    )}
                </QRList>
            )}
        </FolderContainer>
    );
}

// --- Main Page Component ---
export default function EditarPage() {
  const router = useRouter();
  const { folderId: queryFolderId } = router.query;

  const [qrCodes, setQrCodes] = useState<QRCode[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [archiveFolderId, setArchiveFolderId] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    const [qrRes, foldersRes] = await Promise.all([
        fetch('/api/qr'),
        fetch('/api/folders')
    ]);
    let [qrData, foldersData] = await Promise.all([
        qrRes.json(),
        foldersRes.json()
    ]);

    // Find or create archive folder
    let archiveFolder = foldersData.find((f: Folder) => f.name === 'Archivo');
    if (!archiveFolder) {
        const res = await fetch('/api/folders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'Archivo' })
        });
        archiveFolder = await res.json();
        foldersData.push(archiveFolder);
    }
    setArchiveFolderId(archiveFolder.id);

    // Transform snake_case to camelCase
    const transformedQrData = qrData.map((qr: QRCode & { destination_url: string, folder_id: string }) => ({
        id: qr.id,
        name: qr.name,
        destinationUrl: qr.destination_url,
        createdAt: qr.created_at,
        folderId: qr.folder_id,
    }));

    setQrCodes(transformedQrData);
    setFolders(foldersData);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const sortedFolders = [...folders].sort((a, b) => {
    if (a.name === 'Archivo') return 1;
    if (b.name === 'Archivo') return -1;
    return a.name.localeCompare(b.name);
  });
  const qrsWithoutFolder = qrCodes.filter(qr => !qr.folderId);
  const archivedQrs = qrCodes.filter(qr => qr.folderId === archiveFolderId);
  const regularFolders = sortedFolders.filter(f => f.name !== 'Archivo');


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
        {regularFolders.map(folder => (
            <FolderSection 
                key={folder.id} 
                folder={folder} 
                qrs={qrCodes.filter(qr => qr.folderId === folder.id)}
                allFolders={folders}
                onUpdate={fetchData}
                archiveFolderId={archiveFolderId}
                open={folder.id === queryFolderId}
            />
        ))}

        <FolderSection 
            folder={{id: 'unassigned', name: 'Sin Carpeta'}}
            qrs={qrsWithoutFolder}
            allFolders={folders}
            onUpdate={fetchData}
            archiveFolderId={archiveFolderId}
            open={queryFolderId === 'unassigned'}
        />

        {archiveFolderId && folders.find(f => f.id === archiveFolderId) && (
            <FolderSection 
                key={archiveFolderId} 
                folder={folders.find(f => f.id === archiveFolderId)!}
                qrs={archivedQrs}
                allFolders={folders}
                onUpdate={fetchData}
                archiveFolderId={archiveFolderId}
                defaultExpanded={false}
                open={archiveFolderId === queryFolderId}
            />
        )}

        {qrCodes.length === 0 && (
            <p>No has generado ningún código QR todavía.</p>
        )}
      </ContentWrapper>
    </PageWrapper>
  );
}