import {
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import BusinessIcon from "@mui/icons-material/Business";
import React from "react";
import { mode } from "../../types/fam";

export function AppRoot() {
  const handleFamSignIn = () => {
    chrome.storage.local.set({ famSignInMode: "true" }, () => {});
    chrome.tabs.create({ url: "https://intra.famoffice.jp/" });
  };

  return (
    <div>
      <nav aria-label="popup">
        <List sx={{ whiteSpace: "nowrap" }}>
          <ListItem disablePadding>
            <ListItemButton disabled onClick={handleFamSignIn}>
              <ListItemIcon>
                <BusinessIcon />
              </ListItemIcon>
              <ListItemText primary="Login FAM" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => chrome.runtime.openOptionsPage()}>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItemButton>
          </ListItem>
        </List>
      </nav>
    </div>
  );
}
