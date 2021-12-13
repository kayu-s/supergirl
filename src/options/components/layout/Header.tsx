import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { OptionsModule } from "../../store/modules/options-module";
import { connect } from "react-redux";
import { RootState } from "../../store/store";
import * as Types from "../../../types/options";

const labelText = "ずっと真夜中にする";
export const Header = ({ darkMode }: Types.OptionsProps) => {
  return (
    <Box sx={{ flexGrow: 1, zIndex: "9999" }}>
      <AppBar position="fixed" sx={{ zIndex: "9999" }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Super girl | Settings
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
        </Toolbar>
      </AppBar>
    </Box>
  );
};

const mapStateToProps = (state: RootState): Types.OptionsProps => ({
  darkMode: state.option.darkMode,
});

export default connect(mapStateToProps)(Header);
