import { useState, useEffect } from 'react';
import styled from 'styled-components';
import withAuth from '@/components/withAuth';

const PageWrapper = styled.div`
  padding: 2rem;
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 2rem;
`;

const Button = styled.button`
  background: rgba(187, 134, 252, 0.2);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(187, 134, 252, 0.5);
  border-radius: 12px;
  color: ${({ theme }) => theme.colors.text};
  padding: 0.75rem 1.25rem;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;

  &:hover {
    background: rgba(187, 134, 252, 0.3);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }
`;

const UserTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 2rem;
`;

const Th = styled.th`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding: 1rem;
  text-align: left;
  color: ${({ theme }) => theme.colors.primary};
`;

const Td = styled.td`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding: 1rem;
`;

const ActionButton = styled.button`
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.primary};
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  margin-right: 0.5rem;

  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.background};
  }
`;

const Input = styled.input`
  padding: 0.5rem;
  margin-right: 0.5rem;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
`;

const Select = styled.select`
  padding: 0.5rem;
  margin-right: 0.5rem;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
`;

const ManageUsersPage = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState('user');
  const [newUserLimit, setNewUserLimit] = useState(50);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const getAuthHeaders = () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      return {
        'x-user-id': parsedUser.id,
        'x-user-role': parsedUser.role,
        'Content-Type': 'application/json',
      };
    }
    return {};
  };

  const fetchUsers = async () => {
    setError('');
    try {
      const response = await fetch('/api/users', {
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setUsers(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleAddUser = async () => {
    setError('');
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          email: newUserEmail,
          password: newUserPassword,
          role: newUserRole,
          limit: newUserLimit,
        }),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      setNewUserEmail('');
      setNewUserPassword('');
      setNewUserRole('user');
      setNewUserLimit(50);
      fetchUsers(); // Refresh the user list
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleChangeLimit = async (id: number) => {
    setError('');
    const newLimit = prompt('Enter new QR limit:');
    if (newLimit && !isNaN(Number(newLimit))) {
      try {
        const response = await fetch('/api/users', {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify({ id, limit: parseInt(newLimit) }),
        });
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        fetchUsers(); // Refresh the user list
      } catch (err: any) {
        setError(err.message);
      }
    } else if (newLimit !== null) {
      setError('Invalid limit. Please enter a number.');
    }
  };

  const handleDeleteUser = async (id: number) => {
    setError('');
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch(`/api/users?id=${id}`, {
          method: 'DELETE',
          headers: getAuthHeaders(),
        });
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        fetchUsers(); // Refresh the user list
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  return (
    <PageWrapper>
      <Title>Gestionar Usuarios</Title>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <h3>Añadir Nuevo Usuario</h3>
        <Input
          type="email"
          placeholder="Email"
          value={newUserEmail}
          onChange={(e) => setNewUserEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={newUserPassword}
          onChange={(e) => setNewUserPassword(e.target.value)}
        />
        <Select value={newUserRole} onChange={(e) => setNewUserRole(e.target.value)}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </Select>
        <Input
          type="number"
          placeholder="QR Limit"
          value={newUserLimit}
          onChange={(e) => setNewUserLimit(parseInt(e.target.value))}
        />
        <Button onClick={handleAddUser}>Añadir Usuario</Button>
      </div>
      <UserTable>
        <thead>
          <tr>
            <Th>ID</Th>
            <Th>Email</Th>
            <Th>Rol</Th>
            <Th>Límite de QRs</Th>
            <Th>Acciones</Th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <Td>{user.id}</Td>
              <Td>{user.email}</Td>
              <Td>{user.role}</Td>
              <Td>{user.limit}</Td>
              <Td>
                <ActionButton onClick={() => handleChangeLimit(user.id)}>Cambiar Límite</ActionButton>
                <ActionButton onClick={() => handleDeleteUser(user.id)}>Eliminar</ActionButton>
              </Td>
            </tr>
          ))}
        </tbody>
      </UserTable>
    </PageWrapper>
  );
};

export default withAuth(ManageUsersPage, ['admin']);
