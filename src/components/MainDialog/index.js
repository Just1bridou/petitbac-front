import "./style.scss";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";

export const MainDialog = () => {
  const { ws } = useSelector((state) => state.ws);
  const [open, setOpen] = useState(ws?.uuid ? false : true);

  return (
    <div>
      <Dialog
        PaperProps={{
          className: "mainDialog",
        }}
        fullWidth
        maxWidth="md"
        open={open}
        onClose={() => setOpen(false)}
      >
        <DialogTitle className="mainDialogTitle">Informations</DialogTitle>
        <DialogContent>
          <DialogContentText className="mainDialogText">
            Le site est en construction, il est donc possible que certaines
            pages ne fonctionnent pas correctement ou que certaines
            fonctionnalités ne soient pas accessibles.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button className="mainDialogButton" onClick={() => setOpen(false)}>
            Accepter
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
