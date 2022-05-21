import {
  Avatar,
  AvatarGroup,
  Badge,
  BadgeProps,
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
import React, { useState } from "react";
import { Box, styled } from "@mui/system";
import { useQuery } from "@apollo/client";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { GET_PULL_REQUESTS } from "../../apollo/queries";
import { getTargetRepositories } from "../../utils";

const StyledParagraph = styled("p")({
  margin: 0,
  color: "#57606a",
  fontSize: "12px",
});

const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 10,
    border: `2px solid #565656`,
    padding: "0 4px",
  },
}));

const convertToJst = (utcDate: Date) => {
  const date = new Date(utcDate);
  date.setHours(date.getHours() + 9);
  return date.toLocaleString();
};

const repositories = await getTargetRepositories();

export function AppRoot() {
  const [isMe, setIsMe] = useState<boolean>(true);
  const { loading, error, data } = useQuery(GET_PULL_REQUESTS, {
    variables: {
      query: isMe
        ? "is:open is:pr review-requested:@me repo:" + repositories
        : "is:open is:pr repo:" + repositories,
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsMe(e.target.checked);
  };

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
      <FormGroup>
        <FormControlLabel
          control={
            <Switch checked={isMe} onChange={handleChange} defaultChecked />
          }
          label="@me?"
        />
      </FormGroup>

      <Grid item xs={12}>
        <nav aria-label="popup">
          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <CircularProgress />
            </Box>
          )}
          {error && (
            <Typography variant="h6" color="error">
              An error occurred, Please confirm if your access token is valid.
            </Typography>
          )}
          {data?.search.nodes.length === 0 && (
            <Typography variant="h6">No result</Typography>
          )}
          {data?.search.nodes.length > 0 && (
            <List sx={{ whiteSpace: "nowrap" }}>
              {data.search.nodes.map((pr: any, i: number) => (
                <ListItem key={i}>
                  <Tooltip title={pr.author.login}>
                    <Avatar alt={pr.author.login} src={pr.author.avatarUrl} />
                  </Tooltip>
                  <Box
                    sx={{
                      width: "350px",
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      margin: "0 5px",
                      padding: "10px 0",
                    }}
                  >
                    <Link
                      href={pr.url}
                      onClick={() => chrome.tabs.create({ url: pr.url })}
                    >
                      {pr.title}
                    </Link>
                    {/* Comments */}
                    {pr.comments.edges.length > 0 && (
                      <StyledBadge
                        color="info"
                        badgeContent={pr.comments.edges.length}
                      >
                        <ChatBubbleOutlineRoundedIcon
                          color="action"
                          fontSize="medium"
                        />
                      </StyledBadge>
                    )}
                    <StyledParagraph>
                      {pr.repository.name}
                      <span> created at {convertToJst(pr.createdAt)}</span>
                    </StyledParagraph>
                  </Box>

                  {/* Reviewers */}
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
