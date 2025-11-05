import { createGlobalStyle } from 'styled-components';
import { ThemeType } from './theme';

export const GlobalStyle = createGlobalStyle<{
  theme: ThemeType;
}>`
  html,
  body {
    padding: 0;
    margin: 0;
    font-family: 'Outfit', sans-serif;
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.primary}; /* Should be white from theme */
    line-height: 1.6;
    font-size: 18px;
  }

  * {
    box-sizing: border-box;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  p {
    margin-bottom: 10px;
  }
`;
