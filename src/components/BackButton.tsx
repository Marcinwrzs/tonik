"use client";
import React from "react";
import { Button, Stack } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";

export default function BackButton() {
  return (
    <Stack
      direction="row"
      justifyContent="center"
      alignItems="center"
      sx={{ mt: 4 }}
    >
      <Button
        component={Link}
        href="/"
        variant="contained"
        sx={{
          backgroundColor: "#333",
          color: "#fff",
          "&:hover": {
            backgroundColor: "#555",
          },
        }}
        startIcon={<ArrowBackIcon />}
      >
        Back
      </Button>
    </Stack>
  );
}
