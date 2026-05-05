export type Listing = {
  title: string;
  description: string;
  bullets: string[];
  category: string;
  tags: string[];
  suggestedPriceInr: { min: number; max: number };
  attributes: Record<string, string>;
};

export type ListingResult = {
  listing: Listing;
  images: string[];
};
