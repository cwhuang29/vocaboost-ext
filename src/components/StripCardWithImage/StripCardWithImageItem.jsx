import React from 'react';
import { useNavigate } from 'react-router-dom';
import Proptypes from 'prop-types';

import { Card, CardContent, CardMedia, Typography } from '@mui/material';

// https://mui.com/components/cards
const StripCardWithImageItem = ({ prop }) => {
  const navigate = useNavigate();

  return (
    <Card
      sx={{
        minWidth: 300,
        height: 140,
        color: 'white',
        display: 'flex',
        cursor: 'pointer',
        textAlign: 'left',
        backgroundColor: prop.backgroundColor,
      }}
      onClick={() => navigate(prop.redirectTo)}
    >
      <CardContent sx={{ margin: 'auto 0' }}>
        <Typography gutterBottom variant='h5' component='div' sx={{ fontWeight: 'bold' }}>
          {prop.title}
        </Typography>
        <Typography variant='body2' align='left' sx={{ fontWeight: 'bold' }}>
          {prop.content}
        </Typography>
      </CardContent>
      <CardMedia
        component='img'
        image={prop.img}
        sx={{
          maxWidth: '160px',
          maxHeight: 'inherit !important',
          marginLeft: 'auto',
        }}
      />
    </Card>
  );
};

StripCardWithImageItem.propTypes = {
  prop: Proptypes.object.isRequired,
};

export default StripCardWithImageItem;
