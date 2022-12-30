import { X } from 'react-feather';
import styled from 'styled-components';

export const CrossButton = styled.a`
  position: absolute;
  right: 11.5px;
  top: 4px;
  opacity: 0.55;
  :hover {
    opacity: 1;
  }
  &::before,
  &::after {
    position: absolute;
    content: ' ';
    height: 13px;
    width: 3.3px;
    background-color: #fff;
  }
  &::before {
    transform: rotate(45deg);
  }
  &::after {
    transform: rotate(-45deg);
  }
`;

// See https://feathericons.com/
// <StyledClose color={color} onClick={onClose} />
export const StyledCrossButton = styled(X)`
  position: absolute;
  right: 10px;
  top: 10px;
  :hover {
    cursor: pointer;
  }
`;
