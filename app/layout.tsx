import type { Metadata } from "next";
import { Fraunces, Manrope, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ShortcutProvider } from "@/components/shortcut-provider";
import { AppShell } from "@/components/app-shell";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

const display = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const sans = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

const mono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GitShipRoom",
  description: "Your private ship-room. One click, one PR, shipped.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn(display.variable, sans.variable, mono.variable)}
      suppressHydrationWarning
    >
      <body className="min-h-dvh font-sans antialiased">
        <ShortcutProvider>
          <AppShell>{children}</AppShell>
        </ShortcutProvider>
        <Toaster
          position="bottom-right"
          toastOptions={{
            classNames: {
              toast:
                "!bg-card !border-border !text-foreground !font-sans !rounded-xl !shadow-lift",
            },
          }}
        />
      </body>
    </html>
  );
}
