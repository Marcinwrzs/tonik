"use client";

import React from "react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

type Player = {
  id: string;
  nickname: string;
  current_text: string;
  wpm: number;
  accuracy: number;
  updated_at: string;
};

type Props = {
  roundId: string;
  playerId: string | null;
};

export default function LivePlayersTable({ roundId, playerId }: Props) {
  const [players, setPlayers] = useState<Player[]>([]);

  const fetchProgress = async () => {
    const { data, error } = await supabase
      .from("player_progress")
      .select("*")
      .eq("round_id", roundId)
      .neq("player_id", playerId)
      .order("updated_at", { ascending: false });

    if (!error && data) setPlayers(data);
  };

  useEffect(() => {
    fetchProgress();

    const channel = supabase
      .channel("realtime:progress")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "player_progress",
        },
        () => fetchProgress()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roundId, playerId]);

  return (
    <Box mt={4}>
      <Typography variant="h6" gutterBottom>
        Other players:
      </Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Nickname</TableCell>
            <TableCell>Live progress</TableCell>
            <TableCell>WPM</TableCell>
            <TableCell>Accuracy</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {players.map((p) => (
            <TableRow key={p.id}>
              <TableCell>{p.nickname}</TableCell>
              <TableCell>{p.current_text}</TableCell>
              <TableCell>{p.wpm}</TableCell>
              <TableCell>{p.accuracy}%</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
