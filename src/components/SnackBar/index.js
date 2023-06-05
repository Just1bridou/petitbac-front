import { hide } from "app/redux/slices/snackBar";
const { Snackbar, Alert, Box } = require("@mui/material");
const { useState } = require("react");
const { useDispatch, useSelector } = require("react-redux");

const SnackBarMessage = () => {
  const dispatch = useDispatch();
  const { snackBar } = useSelector((state) => state);
  const handleClose = () => {
    dispatch(hide());
  };

  return (
    <Snackbar
      open={snackBar.open ?? false}
      autoHideDuration={snackBar.validation ? null : 4000}
      onClose={snackBar.validation ? null : handleClose}
    >
      <Alert
        severity={snackBar.type ?? "info"}
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Box display="flex" alignItems="center">
          {snackBar.message ?? ""}
          {snackBar.validation ? snackBar.validation : null}
        </Box>
      </Alert>
    </Snackbar>
  );
};

export default SnackBarMessage;
