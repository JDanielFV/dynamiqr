import { useState, useEffect } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { Folder } from '@/types';

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

const FolderList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 600px;
`;

const FolderItem = styled.a`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 1.5rem;
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
  font-size: 1.2rem;
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: translateY(-2px);
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

export default function CarpetasPage() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchFolders() {
      setIsLoading(true);
      const res = await fetch('/api/folders');
      const data = await res.json();
      setFolders(data);
      setIsLoading(false);
    }
    fetchFolders();
  }, []);

  if (isLoading) {
    return <PageWrapper><Title>Cargando carpetas...</Title></PageWrapper>;
  }

  return (
    <PageWrapper>
      <Title>Carpetas</Title>
      <FolderList>
        {folders.map(folder => (
          <Link key={folder.id} href={`/dynamiqr/editar?folderId=${folder.id}`} passHref>
            <FolderItem>{folder.name}</FolderItem>
          </Link>
        ))}
        {folders.length === 0 && <p>No has creado ninguna carpeta todavía.</p>}
      </FolderList>
    </PageWrapper>
  );
}