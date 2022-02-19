import {
  Avatar,
  AvatarGroup,
  Grid,
  IconButton,
  Link,
  List,
  ListItem,
  Tooltip,
  Typography,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import React, { useEffect, useState } from "react";
import { Box, styled } from "@mui/system";
import { axiosBase } from "../../commons/axios";

const StyledParagraph = styled("p")({
  margin: 0,
  color: "#57606a",
  fontSize: "12px",
});

const convertToJst = (utcDate: Date) => {
  const date = new Date(utcDate);
  date.setHours(date.getHours() + 9);
  return date.toLocaleString();
};

const dummy_reviewers = [
  {
    avatar_url: "https://avatars.githubusercontent.com/u/54141439?v=4",
    html_url: "https://github.com/satoshi-i-botlogy",
    login: "dummy",
    type: "User",
    url: "https://api.github.com/users/satoshi-i-botlogy",
  },
  {
    avatar_url: "https://avatars.githubusercontent.com/u/54141439?v=4",
    html_url: "https://github.com/satoshi-i-botlogy",
    login: "dummy",
    type: "User",
    url: "https://api.github.com/users/satoshi-i-botlogy",
  },
  {
    avatar_url: "https://avatars.githubusercontent.com/u/54141439?v=4",
    html_url: "https://github.com/satoshi-i-botlogy",
    login: "dummy",
    type: "User",
    url: "https://api.github.com/users/satoshi-i-botlogy",
  },
  {
    avatar_url: "https://avatars.githubusercontent.com/u/54141439?v=4",
    html_url: "https://github.com/satoshi-i-botlogy",
    login: "dummy",
    type: "User",
    url: "https://api.github.com/users/satoshi-i-botlogy",
  },
  {
    avatar_url: "https://avatars.githubusercontent.com/u/54141439?v=4",
    html_url: "https://github.com/satoshi-i-botlogy",
    login: "dummy",
    type: "User",
    url: "https://api.github.com/users/satoshi-i-botlogy",
  },
];


export function AppRoot() {
  const [pulls, setPulls] = useState<object[]>([]);

  useEffect(() => {
    chrome.storage.sync.get("repositories", (result1) => {
      chrome.storage.local.get("token", (result2) => {
        for (const repo of result1["repositories"]) {
          if (!repo.isShow) continue;
          axiosBase(result2["token"])
            .get(`repos/${repo.name}/pulls`)
            .then((res) => {
              setPulls((pulls) => pulls.concat(res.data));
            })
            .catch((e) => console.log(e));
        }
      });
    });
  }, []);

  return (
    <Grid container sx={{ minWidth: 500 }}>
      <Grid item xs={8} sx={{ justifyContent: "flex-start", display: "flex" }}>
        <Typography
          variant="h1"
          sx={{ fontSize: "1.2rem", padding: "0 16px", color: "#57606a" }}
        >
          Pull requests
        </Typography>
      </Grid>
      <Grid item xs={4} sx={{ justifyContent: "flex-end", display: "flex" }}>
        <IconButton onClick={() => chrome.runtime.openOptionsPage()}>
          <SettingsIcon />
        </IconButton>
      </Grid>
      <Grid item xs={12}>
        <nav aria-label="popup">
          <List sx={{ whiteSpace: "nowrap" }}>
            {pulls.length > 0 &&
              pulls.map((pull: any, i: number) => (
                <ListItem key={i}>
                  <Tooltip title={pull.user.login}>
                    <Avatar alt={pull.user.login} src={pull.user.avatar_url} />
                  </Tooltip>
                  <Box
                    sx={{
                      width: "350px",
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      margin: "0 5px",
                    }}
                  >
                    <Link
                      href={pull.html_url}
                      onClick={() => chrome.tabs.create({ url: pull.html_url })}
                    >
                      {pull.title}
                    </Link>
                    <StyledParagraph>
                      {pull.head.repo.name}
                      <span> created at {convertToJst(pull.created_at)}</span>
                    </StyledParagraph>
                  </Box>
                  <AvatarGroup max={4}>
                    {pull.requested_reviewers.length > 0 &&
                      pull.requested_reviewers.map(
                        (reviewer: any, i: number) => (
                          <Tooltip title={reviewer.login}>
                            <Avatar
                              key={i}
                              alt={reviewer.login}
                              src={reviewer.avatar_url}
                              sx={{ width: 32, height: 32 }}
                            />
                          </Tooltip>
                        )
                      )}
                  </AvatarGroup>
                </ListItem>
              ))}
          </List>
        </nav>
      </Grid>
    </Grid>
  );
}
