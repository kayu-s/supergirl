import * as React from "react";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";

export interface ConfirmationDialogProps {
  id: string;
  keepMounted: boolean;
  value: string;
  isOpen: boolean;
}

export const ConfirmationDialog = (props: ConfirmationDialogProps) => {
  const { value: valueProp, isOpen, ...other } = props;
  const [open, setOpen] = React.useState(isOpen);
  const [value, setValue] = React.useState(valueProp);

  const radioGroupRef = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    if (!open) {
      setValue(valueProp);
    }
  }, [valueProp, open]);

  const handleEntering = () => {
    if (radioGroupRef.current != null) {
      radioGroupRef.current.focus();
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleOk = () => {
    eval(value);
  };

  return (
    <Dialog
      sx={{ "& .MuiDialog-paper": { width: "80%", maxHeight: 435 } }}
      maxWidth="xs"
      TransitionProps={{ onEntering: handleEntering }}
      open={open}
      {...other}
    >
      <DialogTitle sx={{ textAlign: "center" }}>
        承認を取り消しますか？
      </DialogTitle>
      <DialogActions>
        <Button autoFocus onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleOk}>Ok</Button>
      </DialogActions>
    </Dialog>
  );
};
