export const LOGIN_NAME = "QUAZI ZARIN SUBAH";
export const LOGIN_PASSWORD = "4May2003";

export type ThemeName = "rose" | "pink" | "lavender" | "midnight" | "warm-white" | "soft-blue";
export const DEFAULT_THEME: ThemeName = "rose";

export const THEMES: Record<ThemeName, { label: string; accent: string; bg: string; card: string; gradient: string }> = {
  rose:         { label: "Rose",       accent: "#e8a0b4", bg: "#faf5f7", card: "#ffffff", gradient: "linear-gradient(135deg, #fce4ec, #f8bbd0, #f48fb1)" },
  pink:         { label: "Pink",       accent: "#f06292", bg: "#fce4ec", card: "#ffffff", gradient: "linear-gradient(135deg, #f8bbd0, #f48fb1, #ec407a)" },
  lavender:     { label: "Lavender",   accent: "#b39ddb", bg: "#f3e5f5", card: "#ffffff", gradient: "linear-gradient(135deg, #ede7f6, #d1c4e9, #b39ddb)" },
  midnight:     { label: "Midnight",   accent: "#90caf9", bg: "#1a1a2e", card: "#16213e", gradient: "linear-gradient(135deg, #0f3460, #1a1a2e, #533483)" },
  "warm-white": { label: "Warm White", accent: "#d4a574", bg: "#faf6f1", card: "#ffffff", gradient: "linear-gradient(135deg, #faf6f1, #f0e6d8, #d4a574)" },
  "soft-blue":  { label: "Soft Blue",  accent: "#81d4fa", bg: "#e3f2fd", card: "#ffffff", gradient: "linear-gradient(135deg, #e3f2fd, #bbdefb, #81d4fa)" },
};

export interface Photo { id: number; src: string; caption: string; date: string; }
export interface Memory { id: number; title: string; description: string; date: string; emoji: string; }
export interface Jhogra { id: number; title: string; description: string; emoji: string; }
export interface FirstMeetItem { id: number; title: string; date: string; description: string; }
export interface Gift { id: number; title: string; message: string; emoji: string; }

export const appData = {
  appName: "Shundori",
  personName: "QUAZI ZARIN SUBAH",

  memories: [
    { id: 1, title: "First Chapter", description: "Some moments quietly become important.", date: "May 2023", emoji: "🌸" },
    { id: 2, title: "Under the Stars", description: "That night we talked until morning.", date: "Jul 2023", emoji: "🌙" },
    { id: 3, title: "The Little Things", description: "It was never about the big moments.", date: "Sep 2023", emoji: "✨" },
    { id: 4, title: "Us", description: "Two people. One story.", date: "May 2024", emoji: "🦋" },
  ] as Memory[],

  jhogra: [
    { id: 1, title: "The Great Silent Treatment", description: "Neither spoke for 2 hours.", emoji: "😤" },
    { id: 2, title: "Who Was Actually Right?", description: "It was Google, actually.", emoji: "🤷" },
    { id: 3, title: "The Food Argument", description: "45 minutes deciding what to eat.", emoji: "🍕" },
    { id: 4, title: "Fine. You Win.", description: "The most dangerous three words.", emoji: "🏆" },
  ] as Jhogra[],

  firstMeet: [
    { id: 1, title: "The First Day", date: "Jan 2023", description: "Two people. One ordinary day." },
    { id: 2, title: "The First Conversation", date: "Jan 2023", description: "A few words that felt like home." },
    { id: 3, title: "The Moment I Remember", date: "Feb 2023", description: "The exact second something changed." },
    { id: 4, title: "Here We Are", date: "Present", description: "From strangers to everything." },
  ] as FirstMeetItem[],

  gifts: [
    { id: 1, title: "A Letter", message: "Every moment with you is a gift.", emoji: "💌" },
    { id: 2, title: "A Surprise", message: "This whole app is just for you.", emoji: "🎁" },
    { id: 3, title: "Something Simple", message: "You make the world better by being in it.", emoji: "🌸" },
  ] as Gift[],

  landMessage: "Some names deserve a place of their own.",
};
