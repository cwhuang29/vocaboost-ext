import React from 'react';
import PropTypes from 'prop-types';

import Menu from '@components/Menu';

const NavBar = ({ auth }) => (
  <div style={{ display: 'block', height: '64px' }}>
    <Menu auth={auth} />
  </div>
);

NavBar.defaultProps = {
  auth: {},
};

NavBar.propTypes = {
  auth: PropTypes.object,
};

export default NavBar;
