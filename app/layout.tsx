import type { Metadata } from "next";
import "./globals.css";
import { ShortcutProvider } from "@/components/shortcut-provider";
import { AppShell } from "@/components/app-shell";
import { Toaster } from "@/components/ui/sonner";

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
    <html lang="en">
      <body className="font-sans antialiased">
        <ShortcutProvider>
          <AppShell>{children}</AppShell>
        </ShortcutProvider>
        <Toaster />
      </body>
    </html>
  );
}
