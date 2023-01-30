/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import lod_ from "lodash";
export const AccessContent = ({ children }) => {
  const state = useSelector((state) => state);
  const navigate = useNavigate();
  useEffect(() => {
    /**
     * If party, go to party's room
     */
    if (!lod_.isEmpty(state.party)) {
      navigate("/waiting");
    } else if (!lod_.isEmpty(state.user)) {
    /**
     * If user, go to lobby
     */
      navigate("/lobby");
    } else if (state.ws.uuid) {
    /**
     * If ws uuid, go to login
     */
      navigate("/login");
    } else {
    /**
     * Else, go to /
     */
      navigate("/");
    }
  }, [state]);
  return children;
};
