import {
  Alert,
  Button,
  Container,
  Grid,
  Snackbar,
  Switch,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import SaveIcon from "@mui/icons-material/Save";
import { styled } from "@mui/system";

type Notifications = {
  notifications: {
    comment: boolean;
  };
};

const StyledForthTypography = styled(Typography)({
  fontSize: "1.7rem",
});

export const Notifications = () => {
  const [checked, setChecked] = useState<boolean>(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    chrome.storage.sync.get("notifications", (items) => {
      if (items.notifications?.comment !== undefined) {
        setChecked(items.notifications.comment);
      }
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setChecked(checked);
  };

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const handleSubmit = () => {
    chrome.storage.sync
      .set({
        notifications: {
          comment: checked,
        },
      })
      .then(() => {
        setOpen(true);
      });
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h3" gutterBottom>
        Notifications
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <StyledForthTypography variant="h4" gutterBottom>
            Comment
          </StyledForthTypography>
          <Grid
            item
            xs={12}
            direction="row"
            alignItems="center"
            sx={{ display: "flex" }}
          >
            <Typography>Off</Typography>
            <Switch checked={checked} onChange={handleChange} />
            <Typography>On</Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid container spacing={4} sx={{ marginTop: "0.1rem" }}>
        <Grid item xs={12}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            endIcon={<SaveIcon />}
          >
            Save
          </Button>
          <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert
              onClose={handleClose}
              severity="success"
              sx={{ width: "100%" }}
            >
              Successfully saved!
            </Alert>
          </Snackbar>
        </Grid>
      </Grid>
    </Container>
  );
};
