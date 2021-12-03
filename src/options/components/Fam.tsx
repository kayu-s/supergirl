import React, { useEffect, useState } from "react";
import { Grid, InputLabel, TextField, Typography } from "@mui/material";
import { MuiButtonAlert } from "../../components/atoms/MuiButtonAlert";
import { CustomizedContainer } from "../../components/atoms/CustomizedContainer";

export const Fam = () => {
  useEffect(() => {
    restoreOptions();
  }, []);
  const [fsiMail, setEmail] = useState("");
  const [fsiPassword, setPassword] = useState("");

  const restoreOptions = () => {
    chrome.storage.sync.get(["fsiMail", "fsiPassword"], (items) => {
      setEmail(items.fsiMail);
      setPassword(items.fsiPassword);
    });
  };

  const syncParams = {
    fsiMail: fsiMail,
    fsiPassword: fsiPassword,
  };

  return (
    <CustomizedContainer maxWidth="md">
      <Typography variant="h3" gutterBottom>
        FAM Auto Sign In
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        These information's are only saved in Local Storage.
      </Typography>
      <Grid container spacing={4} sx={{ marginBottom: 2 }} xs={12}>
        <Grid item xs={6}>
          <InputLabel id="label-fsi-address">E-Mail</InputLabel>
          <TextField
            fullWidth
            helperText="E-Mail address for sign in to FAM"
            id="label-fsi-address"
            variant="standard"
            value={fsiMail}
            placeholder="zutomayo@fsi.co.jp"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </Grid>
        <Grid item xs={6}>
          <InputLabel id="label-fsi-password">Password</InputLabel>
          <TextField
            fullWidth
            helperText="Password for sign in to FAM"
            id="label-fsi-password"
            variant="standard"
            value={fsiPassword}
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Grid>
      </Grid>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <MuiButtonAlert syncParams={syncParams} />
        </Grid>
      </Grid>
    </CustomizedContainer>
  );
};
