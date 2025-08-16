import { Inter } from "next/font/google";
import "@fontsource/roboto";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Tonik Game",
  description: "Typing game using Next.js and Supabase",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body></body>
    </html>
  );
}
