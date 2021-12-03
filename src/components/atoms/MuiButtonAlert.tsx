import React, { useState } from "react";
import { Button, Snackbar } from "@mui/material";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

type Props = {
  syncParams: object;
};

export const MuiButtonAlert = ({ syncParams }: Props) => {
  const [open, setOpen] = useState(false);
  const handleSaveClick = () => {
    chrome.storage.sync.set(syncParams, () => {
      setOpen(true);
    });
  };
  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleSaveClick}>
        Save
      </Button>
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success">
          保存されました🤗
        </Alert>
      </Snackbar>
    </div>
  );
};
