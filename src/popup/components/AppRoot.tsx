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
import axios from "axios";
import { Box, styled } from "@mui/system";
const TOKEN = "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";

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
];

export function AppRoot() {
  const [pulls, setPulls] = useState<object[]>([]);

  useEffect(() => {
    const repos = ["Botlogy/botlogy", "kayu-s/practice"];
    for (const repo of repos) {
      axios
        .get(`https://api.github.com/repos/${repo}/pulls`, {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          res.data[3].requested_reviewers = [
            res.data[3].requested_reviewers,
            ...dummy_reviewers,
          ];
          setPulls((pulls) => pulls.concat(res.data));
        })
        .catch((e) => console.log(e));
    }
  }, []);

  return (
    <Grid container>
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
