"use client";

import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useRouter } from "next/navigation";

type Props = {
  wpm: number;
  accuracy: number;
};

export default function GameResult({ wpm, accuracy }: Props) {
  const router = useRouter();

  return (
    <Box textAlign="center" mt={10}>
      <Typography variant="h4" gutterBottom>
        Game Over
      </Typography>
      <Typography variant="h6">WPM: {wpm}</Typography>
      <Typography variant="h6">Accuracy: {accuracy}%</Typography>
      <Button
        onClick={() => router.push("/")}
        sx={{ mt: 3 }}
        variant="outlined"
      >
        Back to Home
      </Button>
    </Box>
  );
}
