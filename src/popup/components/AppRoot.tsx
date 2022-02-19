import {
  Avatar,
  AvatarGroup,
  CircularProgress,
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
import { useQuery } from "@apollo/client";
import { GET_PULL_REQUESTS } from "../popup";

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
  const { loading, error, data } = useQuery(GET_PULL_REQUESTS);

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
          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <CircularProgress />
            </Box>
          )}
          {error && <p>error</p>}
          {data && (
            <List sx={{ whiteSpace: "nowrap" }}>
              {data.search.nodes.map((pr: any, i: number) => (
                <ListItem key={i}>
                  <Tooltip title={pr.title}>
                    <Avatar alt={pr.author.login} src={pr.author.avatarUrl} />
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
                      href={pr.url}
                      onClick={() => chrome.tabs.create({ url: pr.url })}
                    >
                      {pr.title}
                    </Link>
                    <StyledParagraph>
                      {pr.repository.name}
                      <span> created at {convertToJst(pr.createdAt)}</span>
                    </StyledParagraph>
                  </Box>
                  <AvatarGroup max={4}>
                    {pr.reviewRequests.nodes.length > 0 &&
                      pr.reviewRequests.nodes.map(
                        (reviewer: any, i: number) => (
                          <Tooltip title={reviewer.requestedReviewer.login}>
                            <Avatar
                              key={i}
                              alt={reviewer.requestedReviewer.login}
                              src={reviewer.requestedReviewer.avatarUrl}
                              sx={{ width: 32, height: 32 }}
                            />
                          </Tooltip>
                        )
                      )}
                  </AvatarGroup>
                </ListItem>
              ))}
            </List>
          )}
        </nav>
      </Grid>
    </Grid>
  );
}
