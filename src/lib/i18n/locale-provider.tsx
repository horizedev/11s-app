"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { en } from "@/lib/i18n/en";
import {
  DEFAULT_LOCALE,
  LOCALES,
  LOCALE_STORAGE_KEY,
  type Locale,
} from "@/lib/i18n/types";
import { zhTW } from "@/lib/i18n/zh-TW";
import type { Dictionary } from "@/lib/i18n/types";

const dictionaries: Record<Locale, Dictionary> = {
  en,
  "zh-TW": zhTW,
};

type LocaleContextValue = {
  locale: Locale;
  t: Dictionary;
  setLocale: (locale: Locale) => void;
  ready: boolean;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function detectLocale(): Locale {
  if (typeof window === "undefined") return DEFAULT_LOCALE;

  try {
    const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    if (stored && LOCALES.includes(stored as Locale)) {
      return stored as Locale;
    }
  } catch {
    // ignore storage errors
  }

  const languages = window.navigator.languages?.length
    ? window.navigator.languages
    : [window.navigator.language];

  for (const language of languages) {
    const normalized = language.toLowerCase();
    if (
      normalized.startsWith("zh-tw") ||
      normalized.startsWith("zh-hk") ||
      normalized.startsWith("zh-mo") ||
      normalized === "zh-hant" ||
      normalized.startsWith("zh-hant")
    ) {
      return "zh-TW";
    }
    if (normalized.startsWith("zh")) {
      return "zh-TW";
    }
  }

  return DEFAULT_LOCALE;
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const next = detectLocale();
    const frame = window.requestAnimationFrame(() => {
      setLocaleState(next);
      setReady(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.lang = locale === "zh-TW" ? "zh-Hant" : "en";
    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    } catch {
      // ignore storage errors
    }
  }, [locale, ready]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
  }, []);

  const value = useMemo(
    () => ({
      locale,
      t: dictionaries[locale],
      setLocale,
      ready,
    }),
    [locale, ready, setLocale],
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return context;
}

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
