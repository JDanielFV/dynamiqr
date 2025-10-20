import { createGlobalStyle } from 'styled-components';
import { ThemeType } from './theme';

 export const GlobalStyle = createGlobalStyle<{
   theme: ThemeType;
 }>`
   body {
     background-color: ${({ theme }) => theme.colors.background};
     color: ${({ theme }) => theme.colors.text};
     font-family: sans-serif;
     margin: 0;
     padding: 0;
     box-sizing: border-box;
   }

   *, *::before, *::after {
     box-sizing: inherit;
   }
 `;
