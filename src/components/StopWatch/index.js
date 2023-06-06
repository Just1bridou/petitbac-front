/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from "react";

export const StopWatch = ({ start, end }) => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  const handleStart = () => {
    if (!isRunning) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1000);
      }, 1000);
      setIsRunning(true);
    }
  };

  const handleStop = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
  };

  const formatTime = (time) => {
    const date = new Date(time);
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    return `${minutes}m ${seconds}s`;
  };

  useEffect(() => {
    if (start) {
      let nowTS = end ? new Date(end).getTime() : new Date().getTime();
      setTime(nowTS - new Date(start).getTime());
    }

    if (start && !isRunning && !end) {
      clearInterval(intervalRef?.current);
      setIsRunning(true);
      handleStart();
    }

    if (end && isRunning) {
      handleStop();
      setIsRunning(false);
    }
  }, [start, end]);

  return <span>{formatTime(time)}</span>;
};
