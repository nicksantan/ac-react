import styled from 'styled-components';

// Layout constants
export const CONTENT_MAX_WIDTH = '1200px';

// Breakpoints for media queries
export const BREAKPOINTS = {
  mobile: '480px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1200px',
} as const;

// Media query helpers
export const media = {
  mobile: `@media (max-width: ${BREAKPOINTS.mobile})`,
  tablet: `@media (max-width: ${BREAKPOINTS.tablet})`,
  desktop: `@media (max-width: ${BREAKPOINTS.desktop})`,
  wide: `@media (max-width: ${BREAKPOINTS.wide})`,
} as const;

// Shared styled components
export const PageHeader = styled.h1`
  font-weight: bold;
  font-size: 46px;
  margin-bottom: 5px;
  text-transform: uppercase;

  @media (max-width: ${BREAKPOINTS.tablet}) {
    font-size: 36px;
    text-align: center;
  }
`;
