import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export default function CustomizedSnackbars({ open, message, severity, onClose }) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
    >
      <Alert
        onClose={onClose}
        severity={severity || 'success'}
        variant="filled"
        sx={{ width: '100%' }}
      >
        {message || 'Operation completed successfully!'}
      </Alert>
    </Snackbar>
  );
}
