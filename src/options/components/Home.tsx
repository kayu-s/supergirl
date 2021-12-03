import { Container, Divider, Typography } from "@mui/material";
import React from "react";
export const Home = () => {
  return (
    <Container maxWidth="md">
      <Typography variant="h3" gutterBottom>
        Settings
      </Typography>
      <Typography variant="subtitle1">
        Settings for chrome extension Saturn.
      </Typography>
    </Container>
  );
};
