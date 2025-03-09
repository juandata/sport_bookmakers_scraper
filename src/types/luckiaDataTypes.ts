/**
 * Market: Represents a single market (e.g., "1X2," "Doble oportunidad"). marketsText uses a string key to accommodate variable pick names.

Participant: Represents the participants in a contest (e.g., team names). The string key (participant1, participant2, etc.) is flexible to handle varying numbers of participants.

Contest: Represents a single sporting event.

SubCategory: A subcategory within a sport (e.g., "Liga De Campeones De La Afc").

Category: A category within a sport (e.g., "Fútbol Internacional Clubs").

Sport: A major sport category (e.g., "soccer," "tennis").

LuckiaData: The top-level interface representing the entire JSON data structure.
 */
export interface Market {
  marketHeadingTitle: string;
  marketsText: { [key: string]: string };
}

export interface Participant {
  [key: string]: string;
}

interface Contest {
  eventId: string;
  participants: Participant;
  markets: Market[];
}

interface SubCategory {
  [key: string]: Contest[];
}

interface Category {
  [key: string]: SubCategory;
}

interface Sport {
  [key: string]: Category;
}

export interface LuckiaData {
  [key: string]: Sport;
}
