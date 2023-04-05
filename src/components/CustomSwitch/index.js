import { Switch } from "@mui/material";
import { styled } from "@mui/system";

export const CustomSwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  "& .MuiSwitch-switchBase": {
    margin: 1,
    padding: 0,
    transform: "translateX(6px)",
    "&.Mui-checked": {
      color: "red",
      transform: "translateX(22px)",
      "& + .MuiSwitch-track": {
        opacity: 1,
        background: "linear-gradient(171.51deg, #1e218a 0%, #262054 99.2%)",
      },
      "& .MuiSwitch-thumb": {
        background: "#2D3FDD",
        width: 32,
        height: 32,
      },
    },
  },
  "& .MuiSwitch-thumb": {
    background: "linear-gradient(90.48deg, #821b67 2.19%, #d12e8a 100%)",
    width: 32,
    height: 32,
  },
  "& .MuiSwitch-track": {
    opacity: 1,
    background: "linear-gradient(171.51deg, #1e218a 0%, #262054 99.2%)",
    borderRadius: 20 / 2,
  },
}));
