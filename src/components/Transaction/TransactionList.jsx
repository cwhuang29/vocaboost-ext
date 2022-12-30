import React from 'react';
import PropTypes from 'prop-types';

import { toTransactionNumber } from '@shared/utils/stringHelpers';
import { getTodayDate } from '@shared/utils/time';

import { Box, List, ListItemButton, ListItemText, ListSubheader } from '@mui/material';

const company = {
  小額貸款紀錄: '信用額度',
  蝦皮消費紀錄: '樂購蝦皮股份有限公司',
  UberEat紀錄: '優食台灣股份有限公司',
};

const TransactionList = props => {
  const { content } = props;

  return (
    <>
      {Object.entries(content.allRecord).map(
        ([title, detail]) =>
          detail && (
            <List
              key={title}
              sx={{ width: '100%', bgcolor: 'inherit' }}
              aria-labelledby='list-subheader'
              subheader={
                <ListSubheader component='div' sx={{ backgroundColor: 'inherit' }}>
                  {getTodayDate()} - {detail.category}
                </ListSubheader>
              }
            >
              <Box style={{ margin: '0 25px' }}>
                <ListItemButton style={{ display: 'flex', paddingLeft: '8px' }}>
                  <ListItemText primary='可用餘額' style={{ width: '50%' }} />
                  <ListItemText primary={toTransactionNumber(detail.balance)} style={{ width: '50%', textAlign: 'right' }} />
                </ListItemButton>
              </Box>
              <Box style={{ margin: '0 25px' }}>
                <ListItemButton style={{ display: 'flex', paddingLeft: '8px' }}>
                  <ListItemText primary='註記' style={{ width: '50%' }} />
                  <ListItemText primary={detail.notes} style={{ width: '50%', textAlign: 'right' }} />
                </ListItemButton>
              </Box>
              <Box style={{ margin: '0 25px' }}>
                <ListItemButton style={{ display: 'flex', paddingLeft: '8px' }}>
                  <ListItemText primary={company[detail.category]} style={{ width: '50%' }} />
                  <ListItemText primary={`${toTransactionNumber(detail.cost)}`} style={{ width: '50%', textAlign: 'right' }} />
                </ListItemButton>
              </Box>
              {/* <Box style={{ margin: '0 25px' }}>
                      {
                        Object.entries(detail).map(([]) => (
                              <ListItemButton key={value} style={{ display: 'flex', paddingLeft: '8px' }}>
                                <ListItemText primary={value[0]} style={{ width: '65%' }} />
                                <ListItemText primary={value[1]} style={{ width: '35%', textAlign: 'right' }} />
                              </ListItemButton>
                        ))}
                  </Box> */}
            </List>
          )
      )}
    </>
  );
};

TransactionList.propTypes = {
  content: PropTypes.object.isRequired,
};

export default TransactionList;
