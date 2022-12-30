import styled from 'styled-components';

export const RoundButton = styled.button`
  display: ${props => (props.isShow ? 'block' : 'none')};
  background-color: ${props => (props.warning ? '#FF3960' : 'palevioletred')};
  color: ${props => (props.warning ? '#FF3960' : 'palevioletred')};
  width: ${props => props.width || '21px'};
  height: ${props => props.height || '21px'};
  top: ${props => props.top || '7px'};
  right: ${props => props.right || '7px'};
  border-radius: 50%;
  font-size: 0.7em;
  text-align: center;
  position: absolute;
  border: 0;
  box-shadow: 1px 1px 1px 1px #777777;
`;
