import React from "react";
import { Snackbar, Alert, Slide } from "@mui/material";

function TransitionUp(props) {
  return <Slide {...props} direction="up" />;
}

export default function CustomizedSnackbars({
  open,
  message,
  severity,
  onClose,
}) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={onClose}
      TransitionComponent={TransitionUp}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
    >
      <Alert
        onClose={onClose}
        severity={severity || "success"}
        variant="filled"
        elevation={6}
        sx={{
          width: "100%",
          borderRadius: "10px",
          fontWeight: 500,
        }}
      >
        {message || "Operation completed successfully!"}
      </Alert>
    </Snackbar>
  );
}
