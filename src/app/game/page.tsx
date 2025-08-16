"use client";

import React from "react";
import { useEffect, useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import TypingArea from "@/components/TypingArea";
import GameResult from "@/components/GameResult";
import { getRandomQuote } from "@/lib/getQuote";
import LivePlayersTable from "@/components/LivePlayersTable";
import { savePlayerProgress } from "@/lib/savePlayerProgress";

export default function GamePage() {
  const searchParams = useSearchParams();
  const nickname = searchParams.get("nickname") || "";
  const router = useRouter();

  const [sentence, setSentence] = useState("");
  const [countdown, setCountdown] = useState(3);
  const [isPlaying, setIsPlaying] = useState(false);
  const [inputText, setInputText] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [result, setResult] = useState<{
    wpm: number;
    accuracy: number;
  } | null>(null);

  const [playerId, setPlayerId] = useState<string | null>(null);
  const roundId = new Date().toISOString().slice(0, 16);

  useEffect(() => {
    if (!isPlaying || !playerId) return;

    const interval = setInterval(async () => {
      const result = await savePlayerProgress({
        roundId,
        playerId,
        nickname,
        inputText,
        sentence,
        elapsedTime,
      });

      if (!result.success) {
        console.error("Upsert failed:", result.error);
      }
    }, 300);

    return () => clearInterval(interval);
  }, [
    inputText,
    isPlaying,
    elapsedTime,
    playerId,
    nickname,
    roundId,
    sentence,
  ]);
  useEffect(() => {
    if (!nickname) router.push("/");
  }, [nickname, router]);

  useEffect(() => {
    getRandomQuote().then((data) => {
      setSentence(data.quote);
    });

    const storedPlayerId = localStorage.getItem("player_id");
    if (storedPlayerId) {
      setPlayerId(storedPlayerId);
    } else {
      const newId = crypto.randomUUID();
      localStorage.setItem("player_id", newId);
      setPlayerId(newId);
    }
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsPlaying(true);
      setStartTime(Date.now());
    }
  }, [countdown]);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        const now = Date.now();
        if (startTime) {
          const seconds = Math.floor((now - startTime) / 1000);
          setElapsedTime(seconds);

          if (seconds >= 60) {
            handleEndGame();
          }
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, startTime]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputText(value);

    if (value.length === sentence.length) {
      handleEndGame(value);
    }
  };

  const handleEndGame = async (finalInput: string = inputText) => {
    const finishTime = Date.now();
    const timeTaken = (finishTime - (startTime || finishTime)) / 1000;
    const words = sentence.trim().split(/\s+/).length;
    const wpm = Math.round((words / timeTaken) * 60);
    const correctChars = sentence
      .split("")
      .filter((char, idx) => finalInput[idx] === char).length;
    const accuracy = Math.round((correctChars / sentence.length) * 100);

    await supabase
      .from("player_progress")
      .delete()
      .match({ round_id: roundId, player_id: playerId });
    setIsPlaying(false);
    setResult({ wpm, accuracy });
    saveResult(wpm, accuracy);
  };

  const saveResult = async (wpm: number, accuracy: number) => {
    if (!playerId) return;

    await supabase.from("results").insert([
      {
        round_id: roundId,
        player_id: playerId,
        nickname,
        wpm,
        accuracy,
      },
    ]);
  };

  if (!sentence) {
    return (
      <Box textAlign="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  if (result) {
    return <GameResult wpm={result.wpm} accuracy={result.accuracy} />;
  }

  return (
    <Box textAlign="center" mt={8}>
      {!isPlaying ? (
        <Typography variant="h3">{countdown}</Typography>
      ) : (
        <>
          <TypingArea
            sentence={sentence}
            inputText={inputText}
            onChange={handleChange}
            elapsedTime={elapsedTime}
            onEndGame={() => handleEndGame()}
          />
          <LivePlayersTable roundId={roundId} playerId={playerId} />
        </>
      )}
    </Box>
  );
}
