"use client";

import { useEffect, useState } from "react";
import { Container, Typography } from "@mui/material";
import { supabase } from "@/lib/supabaseClient";
import BackButton from "@/components/BackButton";
import ResultTable from "@/components/ResultTable";

type Result = {
  id: string;
  nickname: string;
  wpm: number;
  accuracy: number;
  created_at: string;
};

export default function DashboardPage() {
  const [results, setResults] = useState<Result[]>([]);

  useEffect(() => {
    const fetchResults = async () => {
      const { data, error } = await supabase
        .from("results")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) setResults(data);
    };

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
  }, []);
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
