"use client";

import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography, Button, TextField, Stack } from "@mui/material";
import Link from "next/link";
import { z } from "zod";

const nicknameSchema = z
  .string()
  .min(3, "Nickname must be at least 3 characters.")
  .max(20, "Nickname must be at most 20 characters.");

export default function HomePage() {
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleStart = () => {
    const result = nicknameSchema.safeParse(nickname.trim());
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    setError("");
    router.push(`/game?nickname=${encodeURIComponent(nickname.trim())}`);
  };

  return (
    <Box
      display="flex"
      minHeight="100vh"
      alignItems="center"
      justifyContent="center"
      sx={{ backgroundColor: "#fdfaf5" }}
    >
      <Stack
        spacing={3}
        alignItems="center"
        width="100%"
        maxWidth={400}
        sx={{
          backgroundColor: "#fff",
          borderRadius: 2,
          p: 4,
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        }}
      >
        <Typography variant="h4" fontWeight="bold" textAlign="center">
          Welcome to the Typing Game
        </Typography>

        <TextField
          fullWidth
          label="Your Nickname"
          variant="outlined"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          error={!!error}
          helperText={error}
          sx={{ input: { backgroundColor: "#f9f9f9" } }}
        />

        <Button
          variant="contained"
          fullWidth
          onClick={handleStart}
          sx={{
            backgroundColor: "#333",
            "&:hover": {
              backgroundColor: "#555",
            },
          }}
        >
          Start Game
        </Button>

        <Link href="/dashboard" style={{ textDecoration: "none" }} passHref>
          <Typography
            variant="body2"
            sx={{
              color: "#5e35b1",
              mt: 1,
              cursor: "pointer",
              "&:hover": {
                color: "#4527a0",
              },
            }}
          >
            View Leaderboard
          </Typography>
        </Link>
      </Stack>
    </Box>
  );
}
