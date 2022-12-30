import styled from 'styled-components';

// A full-width background
export const SectionWrapper = styled.section`
  padding: ${props => props.padding || '3em 0'};
  background: ${props => props.background || 'papayawhip'};
`;
