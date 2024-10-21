"use client";

import { ThemeProvider } from "next-themes";
import Navbar from "./Navbar";
import { Provider } from "jotai";

interface LayoutProviderProps {
  children: React.ReactNode;
}

export default function LayoutProvider({ children }: LayoutProviderProps) {
  return (
    <body
      className={`flex flex-col mx-auto min-h-screen bg-background font-sans antialiased`}
    >
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <Provider>
          <Navbar />
          {children}
        </Provider>
      </ThemeProvider>
    </body>
  );
}
