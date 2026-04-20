import type { Metadata } from "next";
import { Instrument_Serif, IBM_Plex_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ShortcutProvider } from "@/components/shortcut-provider";
import { AppShell } from "@/components/app-shell";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

const display = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const sans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GitShipRoom",
  description: "Your private ship-room. Every PR. Every repo. One keyboard.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn("dark", display.variable, sans.variable, mono.variable)}
      suppressHydrationWarning
    >
      <body className="min-h-dvh bg-background font-sans text-foreground antialiased">
        <ShortcutProvider>
          <AppShell>{children}</AppShell>
        </ShortcutProvider>
        <Toaster
          theme="dark"
          position="bottom-right"
          toastOptions={{
            classNames: {
              toast:
                "!bg-card !border-border !text-foreground !font-sans !rounded-md !shadow-lg",
            },
          }}
        />
      </body>
    </html>
  );
}
