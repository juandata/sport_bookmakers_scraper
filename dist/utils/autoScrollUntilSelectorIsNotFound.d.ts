import * as puppeteer from "puppeteer";
export default function autoScrollUntilSelectorIsNotFound(page: puppeteer.Page, selector: string): Promise<void>;
