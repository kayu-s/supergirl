import {
  Container,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";

const getInitialState = async () => {
  let state: string[] = [];
  chrome.storage.sync.get(["repositories"], (result) => {
    state = result["repositories"];
  });
  return state;
};

const storedState = await getInitialState();
const initialState: string[] =
  storedState.length > 0 ? storedState : ["Botlogy/botlogy", "kayu-s/practice"];

export const Home = () => {
  const [repos, setRepos] = useState<string[]>(initialState);
  useEffect(() => {
    chrome.storage.sync.set({ repositories: repos }, () => {});
  }, [repos]);

  const handleSave = (e: any) => {
    console.log(repos);
  };

  const validator = (e: any): boolean => {
    return (
      e.keyCode === 13 &&
      !repos.includes(e.target.value) &&
      e.target.value !== ""
    );
  };

  const handleDelete = (deleteRepo: string) => {
    chrome.storage.sync.get(["repositories"], (result) => {
      const updatedRepos = result["repositories"].filter(
        (repo: string) => repo !== deleteRepo
      );
      chrome.storage.sync.set({ repositories: updatedRepos }, () => {});
    });
    setRepos(repos.filter((repo) => repo !== deleteRepo));
    console.log(repos);
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h3" gutterBottom>
        My repositories
      </Typography>
      {repos.map((repo, i) => (
        <Grid container spacing={4} sx={{ marginBottom: 2 }}>
          <Grid item xs>
            <TextField
              disabled
              key={i}
              name={i.toString()}
              label="organization/repository"
              fullWidth
              defaultValue={repo}
              variant="outlined"
            />
          </Grid>
          <Grid item xs>
            <IconButton
              aria-label="delete"
              onClick={handleDelete.bind(this, repo)}
            >
              <DeleteIcon />
            </IconButton>
          </Grid>
        </Grid>
      ))}
      <Grid container spacing={4} sx={{ marginBottom: 2 }}>
        <Grid item xs>
          <TextField
            label="organization/repository"
            fullWidth
            variant="outlined"
            placeholder="microsoft/TypeScript"
            onKeyDown={(e: any) => {
              if (validator(e)) {
                setRepos([...repos, e.target.value]);
                e.target.value = "";
              }
            }}
          />
        </Grid>
        <Grid item xs></Grid>
      </Grid>
      <button type="submit" onClick={handleSave}>
        save
      </button>
    </Container>
  );
};
