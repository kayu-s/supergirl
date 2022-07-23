import * as React from "react";
import Stack from "@mui/material/Stack";
import Snackbar, { SnackbarProps } from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { useSnackbar } from "./SnackBar.hook";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

type Props = {
  alertProps: AlertProps & {
    alertMessage: string;
  };
};

export default function CustomizedSnackbars({ alertProps }: Props) {
  const { severity, alertMessage } = alertProps;
  const { open, handleClose } = useSnackbar();

  return (
    <Stack spacing={2} sx={{ width: "100%" }}>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </Stack>
  );
}
