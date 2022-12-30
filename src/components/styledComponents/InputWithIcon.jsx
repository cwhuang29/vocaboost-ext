import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const InputWithIconWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 0.64em 0;
  background: #f3f3f3;
  border: solid 2px #f3f3f3;
  border-radius: 10px;
  :hover {
    border: solid 2px #3d3e3e;
  }
`;

const InputWrapper = styled.input`
  width: 80%;
  font-size: 18px;
  background: inherit;
  border: none;
  :focus {
    outline: none;
  }
`;

const Input = ({ value, onChange }) => (
  <InputWrapper
    value={value}
    onChange={onChange}
    type='text'
    // onKeyPress={(evt) => {
    //   if (!/[0-9\.]/.test(evt.key)) {
    //     evt.preventDefault();
    //   }
    // }}
  />
);

export const InputWithIcon = ({ value, onChange, src }) => (
  <InputWithIconWrapper>
    <Input value={value} onChange={onChange} />
    <img src={src} width='32' alt='' />
  </InputWithIconWrapper>
);

Input.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func,
};

Input.defaultProps = {
  onChange: null,
};

InputWithIcon.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  src: PropTypes.string.isRequired,
};

InputWithIcon.defaultProps = {
  onChange: null,
};
