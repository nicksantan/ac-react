import { createGlobalStyle } from 'styled-components';

const TimelineGlobalStyle = createGlobalStyle`
  .drag-active {
    user-select: none;
    cursor: ew-resize !important;
  }
`;

export default TimelineGlobalStyle;
