import styled from 'styled-components';

import Badge from '@mui/material/Badge';

// eslint-disable-next-line no-unused-vars
const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: 6,
    top: 4.2,
    padding: '0 1px',
    // backgroundColor: '#FBDC30',
    backgroundColor: '#7A9EDA',
  },
}));

export default StyledBadge;
