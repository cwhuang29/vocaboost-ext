import React from 'react';

import { Box } from '@mui/material';

const images = {
  app: {
    title: 'App',
    img: '/assets/mockup/mockup-hncb-app-iphone-portrait.png',
  },
  web: {
    title: 'Web',
    img: '/assets/mockup/mockup-hncb-imac-front.png',
  },
  mascot: {
    title: '小恩',
    img: '/assets/mascot/mascot_gif.gif',
  },
};

const HomePageImageList = () => (
  <Box
    sx={{
      display: 'flex',
      flexFlow: 'row wrap',
      justifyContent: 'center', // Horizontally aligned
      alignItems: 'center', // Vertically aligned
    }}
  >
    <img src={images.web.img} alt='Web mockup' style={{ width: 'min(98%, 520px)', height: 'auto' }} />
    <img src={images.app.img} alt='App mockup' style={{ width: 'min(45%, 175px)', height: 'auto' }} />
    {
      // <img src={images.mascot.img} alt='SnY mascot' width='250' />
    }
  </Box>
);
// <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
//   {itemData.map((item) => (
//     <ImageListItem key={item.img}>
//       <img src={`${item.img}`} alt={item.title} loading='lazy' />
//     </ImageListItem>
//   ))}
// </ImageList>

export default HomePageImageList;
