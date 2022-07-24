import {
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  Input,
  InputAdornment,
  InputLabel,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import KeyIcon from "@mui/icons-material/Key";
import React, { useEffect, useState } from "react";
import { axiosBase } from "../../commons/axios";
import { Repository } from "../../types/options";
import Joyride from "react-joyride";

export const Notifications = () => {
  return (
    <Container maxWidth="md">
      <Typography variant="h3" gutterBottom>
        Notifications
      </Typography>
      <Grid container spacing={4}>
        <Typography variant="h4" gutterBottom>
          Enable work in background
        </Typography>
        <Switch />
        <Grid container spacing={4}>
          <Grid item xs>
            <Switch />
          </Grid>
          <Typography variant="h5">check interval(Minutes)</Typography>
          <Grid item xs>
            <FormControl variant="standard">
              <InputLabel htmlFor="input-with-icon-adornment">
                Personal access token
              </InputLabel>
              <Input
                className="my-first-step"
                id="input-with-icon-adornment"
                startAdornment={
                  <InputAdornment position="start">
                    <KeyIcon />
                  </InputAdornment>
                }
                type="password"
                sx={{ width: "300px", marginBottom: "15px" }}
              />
            </FormControl>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};
