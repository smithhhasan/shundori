// Shundori — All customizable content lives here.
// Edit this file to change names, messages, photos, memories, etc.

export const LOGIN_NAME = "QUAZI ZARIN SUBAH";
export const LOGIN_PASSWORD = "4May2003";

export type ThemeName = "rose" | "pink" | "lavender" | "midnight" | "warm-white" | "soft-blue";

export const DEFAULT_THEME: ThemeName = "rose";

// Mobile icon from localStorage, defaults to ✦
export function getShundoriIcon(): string {
  if (typeof window !== "undefined") {
    return localStorage.getItem("shundori-icon") || "✦";
  }
  return "✦";
}

export const THEMES: Record<ThemeName, { label: string; accent: string; bg: string; card: string; gradient: string }> = {
  rose:       { label: "Rose",       accent: "#e8a0b4", bg: "#fef5f7", card: "#ffffff", gradient: "linear-gradient(135deg, #fce4ec, #f8bbd0, #f48fb1)" },
  pink:       { label: "Pink",       accent: "#f06292", bg: "#fce4ec", card: "#ffffff", gradient: "linear-gradient(135deg, #f8bbd0, #f48fb1, #ec407a)" },
  lavender:   { label: "Lavender",   accent: "#b39ddb", bg: "#f3e5f5", card: "#ffffff", gradient: "linear-gradient(135deg, #ede7f6, #d1c4e9, #b39ddb)" },
  midnight:   { label: "Midnight",   accent: "#90caf9", bg: "#1a1a2e", card: "#16213e", gradient: "linear-gradient(135deg, #0f3460, #1a1a2e, #533483)" },
  "warm-white": { label: "Warm White", accent: "#d4a574", bg: "#faf6f1", card: "#ffffff", gradient: "linear-gradient(135deg, #faf6f1, #f0e6d8, #d4a574)" },
  "soft-blue": { label: "Soft Blue", accent: "#81d4fa", bg: "#e3f2fd", card: "#ffffff", gradient: "linear-gradient(135deg, #e3f2fd, #bbdefb, #81d4fa)" },
};

export const NO_MESSAGES = [
  "Are you sure? 🤔",
  "Nice try 😄",
  "Think again… 🙃",
  "That doesn't seem like the right answer 💫",
  "You know the answer 🌸",
  "Come on, you want to 💕",
  "This button doesn't work, sorry! 😋",
  "Wrong button, try the other one ✨",
];

export interface Photo {
  id: number;
  src: string;
  caption: string;
  date: string;
}

export interface Memory {
  id: number;
  title: string;
  description: string;
  date: string;
  emoji: string;
}

export interface Jhogra {
  id: number;
  title: string;
  description: string;
  emoji: string;
}

export interface FirstMeetItem {
  id: number;
  title: string;
  description: string;
}

export interface Gift {
  id: number;
  title: string;
  message: string;
  emoji: string;
}

export const appData = {
  appName: "Shundori",
  personName: "QUAZI ZARIN SUBAH",

  welcomeMessages: [
    "Some people enter your life quietly,",
    "and somehow make everything",
    "feel a little more beautiful.",
    "",
    "This little place was made for",
    "someone who means a little more",
    "than words can explain.",
  ],

  homeQuote: "If this place could say one thing, it would simply say: I'm glad you exist.",

  photos: [
    { id: 1, src: "", caption: "A beautiful day", date: "2024-01-15" },
    { id: 2, src: "", caption: "Together forever", date: "2024-02-14" },
    { id: 3, src: "", caption: "Memories we made", date: "2024-03-20" },
    { id: 4, src: "", caption: "Pure happiness", date: "2024-04-10" },
    { id: 5, src: "", caption: "That smile", date: "2024-05-01" },
    { id: 6, src: "", caption: "Golden hour", date: "2024-06-15" },
  ] as Photo[],

  memories: [
    { id: 1, title: "That Day", description: "Some moments don't need a reason to stay.", date: "2024-01-15", emoji: "🌸" },
    { id: 2, title: "A Favorite Memory", description: "One of those days I'd choose to remember again.", date: "2024-02-14", emoji: "💕" },
    { id: 3, title: "The Little Things", description: "It was never about the big moments. It was always the small ones.", date: "2024-03-20", emoji: "✨" },
    { id: 4, title: "Us", description: "Two people. One story. A lifetime of memories.", date: "2024-05-04", emoji: "🦋" },
    { id: 5, title: "Under the Stars", description: "That night we talked until the sun came up.", date: "2024-07-10", emoji: "🌙" },
    { id: 6, title: "Always", description: "Some bonds don't need words. They just are.", date: "2024-08-15", emoji: "💫" },
  ] as Memory[],

  jhogra: [
    { id: 1, title: "The Great Silent Treatment", description: "Neither spoke for 2 hours. Both texting friends about it.", emoji: "😤" },
    { id: 2, title: "Who Was Actually Right?", description: "Spoiler: It was neither of us. It was Google.", emoji: "🤷" },
    { id: 3, title: "That One Unnecessary Argument", description: "About what to eat. For 45 minutes.", emoji: "🍕" },
    { id: 4, title: "Okay, Fine. You Win.", description: "The three most dangerous words in any relationship.", emoji: "🏆" },
    { id: 5, title: "The 'I'm Not Angry' Phase", description: "Translation: I am VERY angry.", emoji: "💢" },
    { id: 6, title: "The Apology Dance", description: "When you both know you're wrong but nobody wants to go first.", emoji: "💃" },
  ] as Jhogra[],

  firstMeet: [
    { id: 1, title: "The First Day", description: "Two people. One ordinary day. A memory that wasn't ordinary at all." },
    { id: 2, title: "The First Conversation", description: "A few words that somehow felt like coming home." },
    { id: 3, title: "The Moment I Remember", description: "The exact second I knew something was different." },
    { id: 4, title: "And Somehow, Here We Are", description: "From strangers to the most important people in each other's lives." },
  ] as FirstMeetItem[],

  gifts: [
    { id: 1, title: "A Little Surprise", message: "You were the surprise I never knew I needed. 🎁", emoji: "🎁" },
    { id: 2, title: "A Letter", message: "Dear Shundori, every moment with you is a gift. Thank you for being you. 💌", emoji: "💌" },
    { id: 3, title: "Something Just for You", message: "This whole app — every pixel, every word — is just for you. 🌸", emoji: "🌸" },
    { id: 4, title: "One More Thing", message: "You make the world a better place just by being in it. ⭐", emoji: "⭐" },
  ] as Gift[],

  landMessage: "Some names deserve their own little piece of the world.",
};
