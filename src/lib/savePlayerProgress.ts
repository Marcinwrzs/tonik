import { supabase } from "@/lib/supabaseClient";

export async function savePlayerProgress({
  roundId,
  playerId,
  nickname,
  inputText,
  sentence,
  elapsedTime,
}: {
  roundId: string;
  playerId: string;
  nickname: string;
  inputText: string;
  sentence: string;
  elapsedTime: number;
}) {
  const correctChars = sentence
    .split("")
    .filter((char, idx) => inputText[idx] === char).length;

  const accuracy =
    sentence.length > 0
      ? Math.round((correctChars / sentence.length) * 100)
      : 100;

  const timeTaken = elapsedTime || 1;
  const words = sentence.trim().split(/\s+/).length;
  const wpm = Math.round((words / timeTaken) * 60);

  const { error } = await supabase.from("player_progress").upsert(
    [
      {
        round_id: roundId,
        player_id: playerId,
        nickname,
        current_text: inputText,
        wpm,
        accuracy,
        updated_at: new Date().toISOString(),
      },
    ],
    {
      onConflict: "round_id,player_id",
    }
  );

  if (error) {
    console.error("Upsert failed:", error);
    return { success: false, error };
  }

  return { success: true, wpm, accuracy };
}
