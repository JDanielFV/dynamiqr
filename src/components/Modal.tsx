import styled from 'styled-components';

const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1001;
`;

const ModalContent = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
}

const Modal = ({ onClose, children }: ModalProps) => {
  return (
    <ModalWrapper onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        {children}
      </ModalContent>
    </ModalWrapper>
  );
};

export default Modal;
