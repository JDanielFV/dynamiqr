import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const Menu = styled.div<{
  top: number;
  left: number;
}>`
  position: absolute;
  top: ${({ top }) => top}px;
  left: ${({ left }) => left}px;
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 0.5rem;
  z-index: 1000;
  display: flex;
  flex-direction: column;
`;

const MenuItemContainer = styled.div`
  position: relative;
`;

const MenuItem = styled.div`
  padding: 0.5rem 1rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;

  &:hover {
    background-color: ${({ theme }) => theme.colors.border};
  }
`;

const SubMenu = styled.div`
  position: absolute;
  top: 0;
  left: 100%;
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 0.5rem;
  z-index: 1001;
  display: flex;
  flex-direction: column;
`;

interface MenuOption {
  label: string;
  onClick?: () => void;
  subItems?: MenuOption[];
}

interface ContextMenuProps {
  top: number;
  left: number;
  onClose: () => void;
  options: MenuOption[];
}

const ContextMenuItem = ({ option, onClose }: { option: MenuOption; onClose: () => void; }) => {
  const [showSubMenu, setShowSubMenu] = useState(false);

  const handleMouseEnter = () => {
    if (option.subItems) {
      setShowSubMenu(true);
    }
  };

  const handleMouseLeave = () => {
    setShowSubMenu(false);
  };

  const handleClick = () => {
    if (option.onClick) {
      option.onClick();
      onClose();
    }
  };

  return (
    <MenuItemContainer onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <MenuItem onClick={handleClick}>
        {option.label}
        {option.subItems && <span>▶</span>}
      </MenuItem>
      {showSubMenu && option.subItems && (
        <SubMenu>
          {option.subItems.map((subItem, index) => (
            <ContextMenuItem key={index} option={subItem} onClose={onClose} />
          ))}
        </SubMenu>
      )}
    </MenuItemContainer>
  );
};

const ContextMenu = ({ top, left, onClose, options }: ContextMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <Menu top={top} left={left} ref={menuRef}>
      {options.map((option, index) => (
        <ContextMenuItem key={index} option={option} onClose={onClose} />
      ))}
    </Menu>
  );
};

export default ContextMenu;
