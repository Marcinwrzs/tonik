"use client";

import React from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

type Result = {
  id: string;
  nickname: string;
  wpm: number;
  accuracy: number;
  created_at: string;
};

type Props = {
  results: Result[];
};

type SortKey = keyof Pick<
  Result,
  "nickname" | "wpm" | "accuracy" | "created_at"
>;
type SortOrder = "asc" | "desc";

export default function ResultTable({ results }: Props) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const searchParams = useSearchParams();
  const router = useRouter();

  const sort = (searchParams.get("sort") || "created_at") as SortKey;
  const order = (searchParams.get("order") || "desc") as SortOrder;

  const sortedResults = useMemo(() => {
    return [...results].sort((a, b) => {
      const aValue = a[sort];
      const bValue = b[sort];

      if (aValue === bValue) return 0;

      if (order === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [results, sort, order]);

  const handleSort = (key: SortKey) => {
    const isSameColumn = sort === key;
    const newOrder: SortOrder =
      isSameColumn && order === "asc" ? "desc" : "asc";

    const params = new URLSearchParams(searchParams);
    params.set("sort", key);
    params.set("order", newOrder);
    router.push(`?${params.toString()}`);
  };

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
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              {(["nickname", "wpm", "accuracy", "created_at"] as SortKey[]).map(
                (key) => (
                  <TableCell
                    key={key}
                    sortDirection={sort === key ? order : false}
                  >
                    <TableSortLabel
                      active={sort === key}
                      direction={sort === key ? order : "asc"}
                      onClick={() => handleSort(key)}
                    >
                      {key === "nickname"
                        ? "Nickname"
                        : key === "wpm"
                        ? "WPM"
                        : key === "accuracy"
                        ? "Accuracy"
                        : "Date"}
                    </TableSortLabel>
                  </TableCell>
                )
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedResults
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
  );
}
