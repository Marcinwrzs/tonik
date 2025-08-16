export type Quote = {
  id: number;
  quote: string;
  author: string;
};

export async function getRandomQuote(): Promise<Quote> {
  try {
    const res = await fetch("https://dummyjson.com/quotes/random");
    if (!res.ok) {
      throw new Error("Failed to fetch quote");
    }

    const data: Quote = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching quote:", error);

    return {
      id: 0,
      quote: "Practice makes perfect when learning to type.",
      author: "Fallback",
    };
  }
}
