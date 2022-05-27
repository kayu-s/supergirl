import {
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  Input,
  InputAdornment,
  InputLabel,
  Typography,
} from "@mui/material";
import KeyIcon from "@mui/icons-material/Key";
import React, { useEffect, useState } from "react";
import { axiosBase } from "../../commons/axios";
import { Repository } from "../../types/options";
import Joyride from "react-joyride";

const setInitialRepositories = (response: object[], storages: Repository[]) => {
  return response.map((repo: any) => {
    const index = storages?.find((v: any) => v?.name === repo.full_name);
    return {
      name: repo.full_name,
      isShow: index?.name ? index?.isShow : true,
    };
  });
};

const setUpdatedRepository = (
  repos: Repository[],
  name: string,
  checked: boolean
) => {
  return repos.map((repo: Repository) =>
    repo.name === name ? { name: name, isShow: checked } : repo
  );
};

export const Home = () => {
  const [repos, setRepos] = useState<Repository[]>([]);
  const [token, setToken] = useState<string>();

  useEffect(() => {
    chrome.storage.local.get("token", (result) => {
      setToken(result["token"]);
      axiosBase(result["token"])
        .get(`user/repos`)
        .then((res) => {
          chrome.storage.sync.get(["repositories"], (result) => {
            setRepos(setInitialRepositories(res.data, result["repositories"]));
            chrome.storage.sync.set({
              repositories: setInitialRepositories(
                res.data,
                result["repositories"]
              ),
            });
          });
        })
        .catch((e) => console.log(e));
    });
  }, [token]);
  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRepos(setUpdatedRepository(repos, e.target.name, e.target.checked));
    chrome.storage.sync.set({
      repositories: setUpdatedRepository(
        repos,
        e.target.name,
        e.target.checked
      ),
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToken(e.target.value);
    chrome.storage.local.set({ token: e.target.value });
  };

  const steps = [
    {
      target: ".my-first-step",
      content: "Input your github access token.",
    },
    {
      target: ".my-second-step",
      content: "Check repository you want to monitor.",
    },
  ];

  return (
    <Container maxWidth="md">
      {!token && (
        <Joyride steps={steps} continuous={true} showSkipButton={true} />
      )}
      <Typography variant="h3" gutterBottom>
        Repository settings
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs>
          <FormControl variant="standard">
            <InputLabel htmlFor="input-with-icon-adornment">
              Personal access token
            </InputLabel>
            <Input
              className="my-first-step"
              id="input-with-icon-adornment"
              startAdornment={
                <InputAdornment position="start">
                  <KeyIcon />
                </InputAdornment>
              }
              onChange={handleChange}
              defaultValue={token}
              value={token}
              type="password"
              sx={{ width: "300px", marginBottom: "15px" }}
            />
          </FormControl>{" "}
        </Grid>
      </Grid>
      {repos && <div className="my-second-step"></div>}
      {repos.map((repo: Repository) => (
        <Grid container spacing={4} sx={{ marginBottom: 2 }}>
          <Grid item xs>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    name={repo.name}
                    onChange={handleCheck}
                    defaultChecked={repo.isShow}
                  />
                }
                label={repo.name}
              />
            </FormGroup>
          </Grid>
        </Grid>
      ))}
    </Container>
  );
};
