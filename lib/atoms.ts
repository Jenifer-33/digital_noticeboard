import { atom } from "jotai";
import type { User, Headline, ViewMode } from "./types";

// Auth atoms
export const userAtom = atom<User | null>(null);
export const isLoadingAtom = atom<boolean>(true);
export const isAdminAtom = atom<boolean>((get) => {
  const user = get(userAtom);
  return user?.role === "admin";
});

// Headlines atoms
export const headlinesAtom = atom<Headline[]>([]);
export const currentCursorAtom = atom<string | null>(null);
export const hasMoreAtom = atom<boolean>(true);
export const headlinesLoadingAtom = atom<boolean>(false);
export const viewModeAtom = atom<ViewMode>("grid");
