"use client";

import { useEffect, useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import TypingArea from "@/components/TypingArea";
import GameResult from "@/components/GameResult";
import { getRandomQuote } from "@/lib/getQuote";

export default function GamePage() {
  const searchParams = useSearchParams();
  const nickname = searchParams.get("nickname") || "";
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

  const router = useRouter();

  useEffect(() => {
    if (!nickname) router.push("/");
  }, [nickname, router]);

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

  useEffect(() => {
    getRandomQuote().then((data) => {
      setSentence(data.quote);
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputText(value);

    if (value.length === sentence.length) {
      handleEndGame(value);
    }
  };

  const handleEndGame = (finalInput: string = inputText) => {
    const finishTime = Date.now();
    const timeTaken = (finishTime - (startTime || finishTime)) / 1000;
    const words = sentence.split(" ").length;
    const wpm = Math.round((words / timeTaken) * 60);
    const correctChars = sentence
      .split("")
      .filter((char, idx) => finalInput[idx] === char).length;
    const accuracy = Math.round((correctChars / sentence.length) * 100);

    setResult({ wpm, accuracy });
    saveResult(wpm, accuracy);
  };

  const saveResult = async (wpm: number, accuracy: number) => {
    await supabase.from("results").insert([{ nickname, wpm, accuracy }]);
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
        <TypingArea
          sentence={sentence}
          inputText={inputText}
          onChange={handleChange}
          elapsedTime={elapsedTime}
          onEndGame={() => handleEndGame()}
        />
      )}
    </Box>
  );
}
