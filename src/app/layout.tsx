import "@fontsource/roboto";
import { CssBaseline, Container } from "@mui/material";

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
    <html lang="en">
      <body style={{ backgroundColor: "#fdfaf5", color: "#1a1a1a", margin: 0 }}>
        <CssBaseline />
        <Container maxWidth="md" sx={{ minHeight: "100vh", py: 4 }}>
          {children}
        </Container>
      </body>
    </html>
  );
}
