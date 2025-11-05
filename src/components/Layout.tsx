import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Main = styled.main`
  flex: 1;
`;

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Container>
      <Main>{children}</Main>
    </Container>
  );
};

export default Layout;
