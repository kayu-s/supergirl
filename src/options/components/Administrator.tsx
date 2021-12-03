import {
  Container,
  Divider,
  FormControlLabel,
  Grid,
  Switch,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import { isApproveConfirm } from "../../types/options";

export const Administrator = () => {
  const [checked, setChecked] = React.useState(true);
  const restoreOptions = () => {
    chrome.storage.sync.get(isApproveConfirm, (items) => {
      setChecked(items.isApproveConfirm);
    });
  };

  useEffect(() => {
    restoreOptions();
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    chrome.storage.sync.set(
      { isApproveConfirm: event.target.checked },
      () => {}
    );
  };
  return (
    <Container maxWidth="md">
      <Typography variant="h3" gutterBottom>
        Miscellaneous
      </Typography>
      <Grid container spacing={4} sx={{ marginBottom: 2 }}>
        <Grid item xs>
          <FormControlLabel
            control={<Switch checked={checked} onChange={handleChange} />}
            label="承認取り消し時に確認ダイアログを表示する"
          />
        </Grid>
      </Grid>
    </Container>
  );
};
