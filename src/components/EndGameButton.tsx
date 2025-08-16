"use client";

import React from "react";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";

type Props = {
  onEnd?: () => void;
};

export default function EndGameButton({ onEnd }: Props) {
  const router = useRouter();

  const handleClick = () => {
    if (onEnd) {
      onEnd();
    } else {
      router.push("/");
    }
  };

  return (
    <Button variant="outlined" onClick={handleClick} sx={{ mt: 2 }}>
      End Game
    </Button>
  );
}
