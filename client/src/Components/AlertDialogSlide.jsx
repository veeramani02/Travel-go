import * as React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
  Typography,
  Box,
} from "@mui/material";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialogSlide({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  loading = false,
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      keepMounted
      fullWidth
      maxWidth="xs"
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      PaperProps={{
        sx: {
          borderRadius: "14px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
        },
      }}
    >
      <Box sx={{ textAlign: "center", p: 2 }}>
        <Box
          sx={{
            backgroundColor: "#fee2e2",
            borderRadius: "50%",
            p: 2,
            display: "inline-flex",
            mb: 1,
          }}
        >
          <WarningAmberRoundedIcon sx={{ color: "#dc2626", fontSize: 40 }} />
        </Box>

        <DialogTitle id="alert-dialog-title" sx={{ p: 0 }}>
          <Typography fontWeight={800}>{title || "Are you sure?"}</Typography>
        </DialogTitle>

        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {message || "This action cannot be undone."}
          </DialogContentText>
        </DialogContent>

        <DialogActions sx={{ gap: 2 }}>
          <Button
            onClick={onClose}
            variant="outlined"
            fullWidth
            sx={{ borderRadius: "10px" }}
          >
            {cancelText || "Cancel"}
          </Button>

          <Button
            onClick={onConfirm}
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{
              backgroundColor: "#1E40AF",
              "&:hover": {
                opacity: 0.85,
              },
              borderRadius: "10px",
            }}
          >
            {loading ? "Processing..." : confirmText || "Delete"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
