import React from "react";
import { Frame } from "../components/layout/Frame";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@emotion/react";
import { connect } from "react-redux";
import { RootState } from "../store/store";
import { createTheme } from "@mui/material";
import * as Types from "../../types/options";
import { grey } from "@mui/material/colors";
// When using TypeScript 4.x and above
import type {} from "@mui/lab/themeAugmentation";

type PaletteMode = "dark" | "light";

const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {}
      : {
          // palette values for dark mode
          text: {
            primary: "#fff",
            secondary: grey[500],
          },
        }),
  },
});

export const AppRoot = ({ darkMode }: Types.OptionsProps) => {
  const mode = darkMode ? "dark" : "light";

  const theme = React.useMemo(
    () => createTheme(getDesignTokens("light")),
    ["light"]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Frame />
    </ThemeProvider>
  );
};

const mapStateToProps = (state: RootState): Types.OptionsProps => ({
  darkMode: state.option.darkMode,
});

export default connect(mapStateToProps)(AppRoot);
