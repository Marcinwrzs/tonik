"use client";

import React from "react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Container, Typography } from "@mui/material";
import { supabase } from "@/lib/supabaseClient";
import BackButton from "@/components/BackButton";
import ResultTable from "@/components/ResultTable";

export type Result = {
  id: string;
  nickname: string;
  wpm: number;
  accuracy: number;
  created_at: string;
};

export default function DashboardClient() {
  const [results, setResults] = useState<Result[]>([]);
  const searchParams = useSearchParams();

  const sort = searchParams.get("sort") || "created_at";
  const order = searchParams.get("order") || "desc";

  const fetchResults = async () => {
    const { data, error } = await supabase
      .from("results")
      .select("*")
      .order(sort, { ascending: order === "asc" });

    if (!error && data) setResults(data);
  };

  useEffect(() => {
    fetchResults();

    const channel = supabase
      .channel("realtime:results")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "results",
        },
        () => {
          fetchResults();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sort, order]);

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Leaderboard
      </Typography>

      <ResultTable results={results} />
      <BackButton />
    </Container>
  );
}
