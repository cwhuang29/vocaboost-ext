import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

import { Box, Button, Card, CardActionArea, CardActions, CardContent, CardMedia, createTheme, ThemeProvider, Typography } from '@mui/material';

const BUTTON_TEXT = '開始填寫';

const theme = createTheme({
  breakpoints: {
    values: { xs: 0, sm: 750, md: 900, lg: 1200, xl: 1536 },
  },
});

// export const emptyForms = [
//   { title: '量表01', img: '/assets/persona/student.jpeg', disable: true },
//   { title: '量表02', img: '/assets/persona/student.jpeg', disable: true },
//   { title: '量表03', img: '/assets/persona/student.jpeg', disable: true },
// ];

const CardWithImage = props => {
  const navigate = useNavigate();
  const { data, isLoading } = props;

  const onClick = url => () => navigate(url);
  const displayData = isLoading || Object.keys(data).length === 0 ? [] : data; // The underlying HOC returns {} when responses are not ready yet

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          textAlign: 'center',
          display: 'flex',
          flexFlow: 'row wrap', // A property that replaces flex-wrap and flex-direction
          // flexDirection: minWidthCheck ? 'row' : 'column', // With flexFlow enabled, this is redundant
          alignContent: 'space-between',
          justifyContent: 'center',
        }}
      >
        {displayData.map(d => (
          <Card
            key={d.title}
            sx={{
              // Optimal setting for five items
              maxWidth: '700px',
              minWidth: '285px',
              width: '18%',
              margin: '15px min(3%, 10px)',
              borderRadius: '9px',
              pointerEvents: d.disable ? 'none' : '',
              cursor: d.disable ? 'default' : 'pointer',
            }}
          >
            <CardActionArea>
              <Box onClick={onClick(d.redirectTo)}>
                <CardMedia component='img' height='180' image={d.img} alt='' />
                <CardContent sx={{ padding: '16px 0 !important' }}>
                  <Typography gutterBottom variant='h5'>
                    {d.title}
                  </Typography>
                  <Typography gutterBottom variant='subtitle2'>
                    於&nbsp;{d.assignedAt}&nbsp;分配給您
                  </Typography>
                </CardContent>
              </Box>
            </CardActionArea>
            <CardActions>
              <Button size='small' onClick={onClick(d.redirectTo)}>
                {BUTTON_TEXT}
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>
    </ThemeProvider>
  );
};

CardWithImage.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      redirectTo: PropTypes.string,
      title: PropTypes.string.isRequired,
      img: PropTypes.string,
      disable: PropTypes.bool,
    }).isRequired
  ).isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default CardWithImage;

// Optimal setting for seven items
// sx={{
//   maxWidth: '300px',
//   minWidth: '205px',
//   width: '12%',
//   margin: '10px min(2%, 5px)',
//   borderRadius: '9px',
//   pointerEvents: form.disable ? 'none' : '',
//   cursor: form.disable ? 'default' : 'pointer',
// }}
