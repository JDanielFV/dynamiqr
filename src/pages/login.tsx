import { useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';

const PageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
`;

const LoginContainer = styled.div`
  padding: 3rem;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  text-align: center;
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 2rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  margin-bottom: 1.5rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  font-size: 1rem;

  &::placeholder {
    color: ${({ theme }) => theme.colors.secondary};
  }
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
  width: 100%;

  &:hover {
    background: rgba(187, 134, 252, 0.3);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }
`;

const ErrorMessage = styled.p`
  color: red;
  margin-top: 1rem;
`;

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('/users.json');
      const users = await response.json();
      const user = users.find(
        (u: any) => u.email === email && u.password === password
      );

      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        router.push('/dashboard');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('Failed to load user data. Please try again later.');
    }
  };

  return (
    <PageWrapper>
      <LoginContainer>
        <Title>Iniciar Sesión</Title>
        <Input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
        <Input 
          type="password" 
          placeholder="Contraseña" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />
        <Button onClick={handleLogin}>Entrar</Button>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </LoginContainer>
    </PageWrapper>
  );
};

export default LoginPage;
