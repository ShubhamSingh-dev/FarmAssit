"use client";

import * as React from "react";

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  translate: (text: string) => Promise<string>;
}

const LanguageContext = React.createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = React.useState<string>("en");

  async function translate(text: string): Promise<string> {
    if (language === "en") return text;

    try {
      const response = await fetch("https://libretranslate.com/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          q: text,
          source: "en",
          target: language,
          format: "text",
        }),
      });

      const data = await response.json();
      return data.translatedText || text;
    } catch (error) {
      console.error("Translation error:", error);
      return text;
    }
  }

  const value = React.useMemo(
    () => ({ language, setLanguage, translate }),
    [language]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = React.useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
