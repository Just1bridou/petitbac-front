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
import { useNavigate } from "react-router-dom";

export const MainDialog = () => {
  const navigate = useNavigate();

  const actualVersion = "2";

  let savedVersion = localStorage.getItem("isViewedInformations");

  const [open, setOpen] = useState(!Boolean(actualVersion === savedVersion));

  function close() {
    window.localStorage.setItem("isViewedInformations", actualVersion);
    setOpen(false);
  }

  function goToFlash() {
    navigate("/flash");
  }

  return (
    <div>
      <Dialog
        PaperProps={{
          className: "mainDialog",
        }}
        fullWidth
        maxWidth="md"
        open={open}
        onClose={() => close()}
      >
        <DialogTitle className="mainDialogTitle">Informations 🎉</DialogTitle>
        <DialogContent>
          {/* <DialogContentText className="mainDialogText">
            Le site est en construction, il est donc possible que certaines
            pages ne fonctionnent pas correctement ou que certaines
            fonctionnalités ne soient pas accessibles.
          </DialogContentText> */}
          <DialogContentText className="mainDialogText">
            <p>Nouveau mode de jeu Flash ⚡️!</p>
            <p>
              Chaque jour une nouvelle grille de 10 thèmes à résoudre. Soyer le
              plus rapide pour gagner un maximum de points ! 🏆
            </p>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button className="mainDialogButtonClose" onClick={() => close()}>
            Fermer
          </Button>
          <Button className="mainDialogButton" onClick={() => goToFlash()}>
            Découvrir
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
