import React, { Suspense } from "react";
import { CircularProgress } from "@mui/material";
import DashboardClient from "@/components/DashboardClient";

export default function DashboardPage() {
  return (
    <Suspense fallback={<CircularProgress />}>
      <DashboardClient />
    </Suspense>
  );
}
