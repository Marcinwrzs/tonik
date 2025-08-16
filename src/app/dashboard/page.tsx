"use client";

import { useEffect, useState } from "react";
import BackButton from "@/components/BackButton";

import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
} from "@mui/material";
import { supabase } from "@/lib/supabaseClient";

type Result = {
  id: string;
  nickname: string;
  wpm: number;
  accuracy: number;
  created_at: string;
};

export default function DashboardPage() {
  const [results, setResults] = useState<Result[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchResults = async () => {
      const { data, error } = await supabase
        .from("results")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) setResults(data);
    };

    fetchResults();
  }, []);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Leaderboard
      </Typography>

      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Nickname</TableCell>
                <TableCell>WPM</TableCell>
                <TableCell>Accuracy</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {results
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((r) => (
                  <TableRow key={r.id} hover>
                    <TableCell>{r.nickname}</TableCell>
                    <TableCell>{r.wpm}</TableCell>
                    <TableCell>{r.accuracy}%</TableCell>
                    <TableCell>
                      {new Date(r.created_at).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={results.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <BackButton />
    </Container>
  );
}
