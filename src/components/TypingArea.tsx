"use client";

import { Stack, Typography, TextField, Button } from "@mui/material";

type Props = {
  sentence: string;
  inputText: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  elapsedTime: number;
  onEndGame: () => void;
};

export default function TypingArea({
  sentence,
  inputText,
  onChange,
  elapsedTime,
  onEndGame,
}: Props) {
  return (
    <Stack spacing={3} alignItems="center">
      <Typography variant="body1" color="text.secondary">
        Time: {elapsedTime}s
      </Typography>

      <Typography
        variant="h6"
        maxWidth={600}
        sx={{
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        {sentence}
      </Typography>

      <TextField
        value={inputText}
        onChange={onChange}
        fullWidth
        placeholder="Start typing here..."
        autoFocus
      />

      <Button
        variant="outlined"
        color="error"
        onClick={onEndGame}
        sx={{ mt: 2 }}
      >
        End Game
      </Button>
    </Stack>
  );
}
