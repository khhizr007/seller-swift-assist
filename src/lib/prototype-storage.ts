import seededUsers from "@/data/prototype-users.json";
import type { SavedGeneration, PrototypeUser } from "@/types/prototype";
import type { ListingResult } from "@/types/listing";

const USERS_KEY = "meesho-boost-prototype-users";
const SESSION_KEY = "meesho-boost-prototype-session";
const GENERATIONS_KEY = "meesho-boost-prototype-generations";

const isBrowser = typeof window !== "undefined";

const readJson = <T,>(key: string, fallback: T): T => {
  if (!isBrowser) return fallback;

  const raw = window.localStorage.getItem(key);
  if (!raw) return fallback;

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

const writeJson = (key: string, value: unknown) => {
  if (!isBrowser) return;
  window.localStorage.setItem(key, JSON.stringify(value));
};

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const createId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

export const initializePrototypeStorage = () => {
  if (!isBrowser) return;

  const users = readJson<PrototypeUser[]>(USERS_KEY, []);
  if (users.length === 0) {
    writeJson(USERS_KEY, seededUsers);
  }

  const generations = readJson<SavedGeneration[]>(GENERATIONS_KEY, []);
  if (!Array.isArray(generations)) {
    writeJson(GENERATIONS_KEY, []);
  }
};

export const getPrototypeUsers = () => readJson<PrototypeUser[]>(USERS_KEY, seededUsers);

export const getPrototypeSessionUser = () => {
  const sessionUserId = isBrowser ? window.localStorage.getItem(SESSION_KEY) : null;
  if (!sessionUserId) return null;

  return getPrototypeUsers().find((user) => user.id === sessionUserId) ?? null;
};

export const registerPrototypeUser = (email: string, password: string) => {
  const users = getPrototypeUsers();
  const normalizedEmail = normalizeEmail(email);

  if (users.some((user) => normalizeEmail(user.email) === normalizedEmail)) {
    throw new Error("An account with this email already exists");
  }

  const newUser: PrototypeUser = {
    id: createId(),
    email: normalizedEmail,
    password,
    name: normalizedEmail.split("@")[0] || "Seller",
    createdAt: new Date().toISOString(),
  };

  const nextUsers = [...users, newUser];
  writeJson(USERS_KEY, nextUsers);
  window.localStorage.setItem(SESSION_KEY, newUser.id);

  return newUser;
};

export const loginPrototypeUser = (email: string, password: string) => {
  const normalizedEmail = normalizeEmail(email);
  const user = getPrototypeUsers().find(
    (candidate) => normalizeEmail(candidate.email) === normalizedEmail && candidate.password === password,
  );

  if (!user) {
    throw new Error("Invalid login credentials");
  }

  window.localStorage.setItem(SESSION_KEY, user.id);
  return user;
};

export const logoutPrototypeUser = () => {
  if (!isBrowser) return;
  window.localStorage.removeItem(SESSION_KEY);
};

export const getSavedGenerations = (userId: string) => {
  const all = readJson<SavedGeneration[]>(GENERATIONS_KEY, []);

  return all
    .filter((item) => item.userId === userId)
    .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime());
};

export const saveGenerationForUser = ({
  userId,
  sourceCategory,
  sourceNotes,
  sourceFilename,
  result,
}: {
  userId: string;
  sourceCategory: string | null;
  sourceNotes: string | null;
  sourceFilename: string | null;
  result: ListingResult;
}) => {
  const all = readJson<SavedGeneration[]>(GENERATIONS_KEY, []);
  const nextItem: SavedGeneration = {
    id: createId(),
    userId,
    sourceCategory,
    sourceNotes,
    sourceFilename,
    createdAt: new Date().toISOString(),
    result,
  };

  writeJson(GENERATIONS_KEY, [nextItem, ...all]);
  return nextItem;
};
