import React, { Suspense } from "react";
import { CircularProgress } from "@mui/material";
import GameClient from "@/components/GameClient";

export default function GamePage() {
  return (
    <Suspense fallback={<CircularProgress />}>
      <GameClient />
    </Suspense>
  );
}
