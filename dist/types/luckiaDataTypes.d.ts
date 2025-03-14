export interface Market {
    marketHeadingTitle: string;
    marketsText: {
        [key: string]: string;
    };
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
export {};
