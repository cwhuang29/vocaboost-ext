import styled, { css } from 'styled-components';

export const Text = styled.div`
  ${props => {
    const {
      width = 'unset',
      height = 'unset',
      fontSize = '16px',
      fontWeight = 'normal',
      fontStyle = 'normal',
      fontStretch = 'normal',
      lineHeight = 'normal',
      letterSpacing = 'normal',
      textAlign = 'center',
      color = '#40485a',
      cursor = 'unset',
      margin = 'unset',
    } = props;

    return css`
      width: ${width};
      height: ${height};
      font-size: ${fontSize};
      font-weight: ${fontWeight};
      font-style: ${fontStyle};
      font-stretch: ${fontStretch};
      line-height: ${lineHeight};
      letter-spacing: ${letterSpacing};
      text-align: ${textAlign};
      color: ${color};
      cursor: ${cursor};
      margin: ${margin};
    `;
  }};
`;

export const TitleText = styled(Text)`
  margin-top: ${props => (props.marginTop ? props.marginTop : null)};
  width: ${props => (props.width ? props.width : null)};
  height: ${props => (props.height ? props.height : '22px')};
  font-size: ${props => (props.fontSize ? props.fontSize : '1.8em')};
  font-weight: bold;
  text-align: center;
  white-space: pre;
  line-height: ${props => (props.lineHeight ? props.lineHeight : '1.5')} !important;
  color: #40485a;
`;
