import type { ListingResult } from "@/types/listing";

export type PrototypeUser = {
  id: string;
  email: string;
  password: string;
  name: string;
  createdAt: string;
};

export type SavedGeneration = {
  id: string;
  userId: string;
  sourceCategory: string | null;
  sourceNotes: string | null;
  sourceFilename: string | null;
  createdAt: string;
  result: ListingResult;
};
