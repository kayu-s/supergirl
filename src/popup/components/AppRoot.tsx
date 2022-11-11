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
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import React, { useState } from "react";
import { Box, styled } from "@mui/system";
import { useQuery } from "@apollo/client";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { GET_PULL_REQUESTS } from "../../apollo/queries";
import { getTargetRepositories } from "../../utils";
import Joyride from "react-joyride";

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

  const steps = [
    {
      target: ".my-first-step",
      content:
        "最初に、リポジトリの情報を取得する為の認証情報を設定してください。",
    },
    {
      target: ".my-second-step",
      content:
        "スイッチを外すと自分がレビュアーに設定されていないプルリクエストも表示できます。",
    },
  ];
  const minHeight = !data ? 250 : 0;
  const handleCopyClick = (title: string) => {
    navigator.clipboard.writeText(title);
  };

  return (
    <Grid container sx={{ minWidth: 500 }}>
      {!data && !loading && <Joyride steps={steps} continuous={true} />}
      <Grid item xs={8} sx={{ justifyContent: "flex-start", display: "flex" }}>
        <Typography
          variant="h1"
          sx={{ fontSize: "1.2rem", padding: "0 16px", color: "#57606a" }}
        >
          Pull requests
        </Typography>
      </Grid>
      <Grid item xs={4} sx={{ justifyContent: "flex-end", display: "flex" }}>
        <IconButton
          className="my-first-step"
          onClick={() => chrome.runtime.openOptionsPage()}
        >
          <SettingsIcon />
        </IconButton>
      </Grid>
      <FormGroup>
        <FormControlLabel
          className="my-second-step"
          defaultChecked
          control={<Switch checked={isMe} onChange={handleChange} />}
          label="@me?"
        />
      </FormGroup>

      <Grid item xs={12} sx={{ minHeight }}>
        <nav aria-label="popup">
          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <CircularProgress />
            </Box>
          )}
          {error && (
            <Typography variant="h6" color="error">
              Your token is incorrect or unregistered.
            </Typography>
          )}
          {data?.search.nodes.length === 0 && (
            <Typography variant="h6">Review completed!🎉</Typography>
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
                    {/* Copy Title */}
                    <IconButton
                      size="small"
                      aria-label="copy"
                      onClick={() => handleCopyClick(pr.title)}
                    >
                      <ContentCopyIcon sx={{ fontSize: "1.125rem" }} />
                    </IconButton>
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
                          <Tooltip
                            key={`tooltip_${i}`}
                            title={
                              reviewer.requestedReviewer?.login ||
                              reviewer.requestedReviewer?.name
                            }
                          >
                            <Avatar
                              key={`avatar_${i}`}
                              alt={
                                reviewer.requestedReviewer?.login ||
                                reviewer.requestedReviewer?.name
                              }
                              src={reviewer.requestedReviewer?.avatarUrl}
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
