import React from 'react';
import PropTypes from 'prop-types';

import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { LinearProgress } from '@mui/material';
import { withStyles } from '@mui/styles';
import { DataGrid as MuiDataGrid, GridOverlay, GridToolbar } from '@mui/x-data-grid';

import NoRowsOverlay from './NoRowsOverlay';

const CustomLoadingOverlay = () => (
  <GridOverlay>
    <div style={{ position: 'absolute', top: 0, width: '100%' }}>
      <LinearProgress />
    </div>
  </GridOverlay>
);

const SortedDescendingIcon = () => <ExpandMoreIcon className='icon' />;

const SortedAscendingIcon = () => <ExpandLessIcon className='icon' />;

// To enable dynamic row-height and other styles
const StyledDataGrid = withStyles({
  root: {
    '& .MuiDataGrid-renderingZone': {
      maxHeight: 'none !important',
    },
    '& .MuiDataGrid-cell': {
      lineHeight: 'unset !important',
      maxHeight: 'none !important',
      whiteSpace: 'normal',
      flexDirection: 'column',
      alignItems: 'flex-start', // Vertically aligned
      justifyContent: 'center', // Horizontally aligned
      padding: '3px 12px 3px',
    },
    '& .MuiDataGrid-row': {
      maxHeight: 'none !important',
      '&:nth-child(2n)': { backgroundColor: 'rgba(235, 235, 235, .6)' },
    },
    '& .MuiDataGrid-cell:hover': {
      backgroundColor: '#b9d5ff91',
      color: '#204376',
    },
    '& .MuiDataGrid-row:hover': {
      backgroundColor: 'inherit',
    },

    // '& div[data-rowIndex][role="row"]': {
    //   fontSize: 18,
    //   height: 60,
    //   '& div': {
    //     height: 60,
    //     minHeight: "60px !important",
    //     lineHeight: "59px !important"
    //   },
    // },
  },
})(MuiDataGrid);

const DataGrid = props => {
  const { height, rows, columns, isLoading, onCellDoubleClick, autoHeight, checkboxSelection, onSelectionModelChange, getRowId } = props;

  const heightCSS = autoHeight ? {} : { height }; // These two setting should not go together

  return (
    <div style={{ display: 'flex', overflow: 'auto', ...heightCSS }}>
      <div style={{ flexGrow: 1 }}>
        <StyledDataGrid
          hideFooterSelectedRowCount
          disableDensitySelector
          autoHeight={autoHeight}
          rows={rows}
          columns={columns}
          loading={isLoading}
          checkboxSelection={checkboxSelection}
          components={{
            Toolbar: GridToolbar,
            LoadingOverlay: CustomLoadingOverlay,
            ColumnSortedDescendingIcon: SortedDescendingIcon,
            ColumnSortedAscendingIcon: SortedAscendingIcon,
            NoRowsOverlay,
          }}
          onCellDoubleClick={onCellDoubleClick}
          onSelectionModelChange={onSelectionModelChange}
          sx={{
            cursor: 'pointer',
            boxShadow: 2,
            border: 2,
            borderColor: 'primary.light',
            // '& .cold': { },
          }}
          // getCellClassName={(params) => (params.value >= 15 ? 'hot' : 'cold')}
          getRowId={getRowId}
        />
      </div>
    </div>
  );
};

DataGrid.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  columns: PropTypes.array.isRequired,
  rows: PropTypes.array,
  height: PropTypes.number,
  autoHeight: PropTypes.bool,
  checkboxSelection: PropTypes.bool,
  onCellDoubleClick: PropTypes.func,
  onSelectionModelChange: PropTypes.func,
  getRowId: PropTypes.func,
};

DataGrid.defaultProps = {
  rows: [],
  height: 600,
  autoHeight: false,
  checkboxSelection: false,
  onCellDoubleClick: null,
  onSelectionModelChange: null,
  getRowId: null,
};

export default DataGrid;
