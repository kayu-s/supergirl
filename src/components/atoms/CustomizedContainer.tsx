import { Container } from "@mui/material";
import { styled } from "@mui/system";

export const CustomizedContainer = styled(Container)`
  .MuiInputBase-root {
    color: currentColor;
    &:before {
      border-bottom: 1px solid currentColor;
    }
  }
`;
