import { useState, useEffect } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { QRCode, Folder } from '@/types';

const PageWrapper = styled.div`
  padding: 2rem;
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 2rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
`;

const StatLabel = styled.div`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.secondary};
`;

const RecentQRsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const QRListItem = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const QRName = styled.div`
  font-weight: 500;
`;

const QRDate = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.secondary};
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

const Dashboard = () => {
  const [qrCodes, setQrCodes] = useState<QRCode[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const [qrRes, foldersRes] = await Promise.all([
        fetch('/api/qr'),
        fetch('/api/folders'),
      ]);
      const [qrData, foldersData] = await Promise.all([
        qrRes.json(),
        foldersRes.json(),
      ]);

      const transformedQrData = qrData.map((qr: any) => ({
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

    fetchData();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const recentQRs = qrCodes
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  if (isLoading) {
    return <PageWrapper><Title>Cargando Dashboard...</Title></PageWrapper>;
  }

  return (
    <PageWrapper>
      <Title>Dashboard</Title>
      <StatsGrid>
        <StatCard>
          <StatValue>{qrCodes.length}</StatValue>
          <StatLabel>Total de Códigos QR</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{folders.length}</StatValue>
          <StatLabel>Total de Carpetas</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>15</StatValue>
          <StatLabel>QRs Activos</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>85</StatValue>
          <StatLabel>QRs Restantes del Paquete</StatLabel>
        </StatCard>
      </StatsGrid>

      <h2>QRs Recientes</h2>
      <RecentQRsList>
        {recentQRs.map(qr => (
          <QRListItem key={qr.id}>
            <QRName>{qr.name}</QRName>
            <QRDate>{formatDate(qr.createdAt)}</QRDate>
          </QRListItem>
        ))}
      </RecentQRsList>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
        <Link href="/dynamiqr/generar"><Button>Generar</Button></Link>
        <Link href="/dynamiqr/editar"><Button>Editar</Button></Link>
      </div>
    </PageWrapper>
  );
};

export default Dashboard;
