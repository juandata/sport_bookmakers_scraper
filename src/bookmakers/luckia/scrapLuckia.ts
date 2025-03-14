import puppeteer from "puppeteer";
import puppeteerExtra from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import * as colors from "colors";
import fs from "fs/promises";
import * as path from "path";
import { fileURLToPath } from "url";
import autoScrollUntilSelectorIsNotFound from "../../utils/autoScrollUntilSelectorIsNotFound.ts";
import {
  LuckiaData,
  Market,
  Participant,
} from "../../types/luckiaDataTypes.ts";
import { delay } from "../../utils/index.ts";
import { initializeLogStream, closeLogStream } from "../../utils/logger.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const mockDataDir = path.join(__dirname, "..", "..", "mockData");
const jsonDataName = "luckia_data.json";
const navigationTimeout = 30000;
const elementTimeout = 10000;
const htmlDumpDir = path.join(__dirname, "..", "..", "htmlDumps");
const logFileName = "luckia_scraping.log";

puppeteerExtra.use(StealthPlugin());

async function scrapeLuckia() {
  const start = new Date().getTime();

  let allData: LuckiaData = {};

  await initializeLogStream(logFileName);

  const browser = await puppeteerExtra.launch({
    headless: false, //change for false when working locally and for "new" when working on production
    slowMo: 50,
    devtools: true,
  });
  const page = await browser.newPage();
  await page.setViewport({
    width: 1600,
    height: 1200,
    deviceScaleFactor: 1,
    isMobile: false,
  });
  page.setDefaultNavigationTimeout(navigationTimeout);
  page.setDefaultTimeout(elementTimeout);

  try {
    await page.goto("https://www.luckia.co/apuestas/en-vivo/", {
      waitUntil: "networkidle2",
    });

    const isWebPageNotWorking = await page.evaluate(() => {
      const h1Element = document.querySelector("body > section > div > h1");
      if (h1Element) {
        return h1Element.textContent.trim() === "Volvemos Ahora";
      }
      return false;
    });

    if (isWebPageNotWorking) {
      console.log(
        colors.red(
          "Volvemos Ahora is present in the page. Exiting or handling appropriately..."
        )
      );
      await browser.close();
      return;
    }

    await page.waitForSelector(".psk-sport-group:not(.hidden)");
    await autoScrollUntilSelectorIsNotFound(page, ".spinnerUpcoming"); //.lp-event-layout-skeleton .spinnerUpcoming
    await saveHTML(page, "after_scrolling");

    const sportGroups = await page.$$(".psk-sport-group:not(.hidden)");

    for (let index = 0; index < sportGroups.length; index++) {
      console.log(`Processing SportGroup iteration number: ${index}`);
      const sportGroup = sportGroups[index];
      let sportName;
      const sportGroupClass = await sportGroup.evaluate((el) => el.className);
      const sportGroupId = sportGroupClass
        .split(" ")
        .find((className) => className.startsWith("sportId"));
      const sportGroupName = sportGroupClass
        .split(" ")
        .find((className) => className.startsWith("sport-group-type"))
        ?.split("-");

      if (sportGroupId && sportGroupName) {
        //sportId = sportGroupId.replace("sportId", "");
        sportName = sportGroupName[sportGroupName.length - 1];
        if (!allData[sportName]) {
          allData[sportName] = {};
        }
      } else {
        console.log(colors.red("Error getting sportName and sportId classes"));
        return;
      }

      const contests = await sportGroup.$$(".psk-event.live:not(.disabled)");

      for (let index2 = 0; index2 < contests.length; index2++) {
        console.log(`processing Contest number: ${index2}`);
        const contest = contests[index2];
        try {
          await processContest(page, contest, allData, sportName);
        } catch (error) {
          console.log(
            colors.red(
              `Error in process contest ${index2}, inside loop: ${error}`
            )
          );
          await goBack(page, "N/A");
          continue;
        }
      }
    }

    await fs.mkdir(mockDataDir, { recursive: true }).catch(() => {});
    await fs.writeFile(
      path.join(mockDataDir, jsonDataName),
      JSON.stringify(allData, null, 2)
    );
    console.log(colors.green(`SAVED ${jsonDataName} DATA SUCCESSFULLY`));
  } catch (error) {
    console.log(colors.red(`Error saving data or scraping: ${error} `));
  } finally {
    const end = new Date().getTime();
    const executionTime = end - start;
    console.log(colors.blue(`Execution time: ${executionTime} ms`));
    await browser.close();
    closeLogStream();
  }
}

async function processContest(
  page: puppeteer.Page,
  contest: puppeteer.ElementHandle,
  allData: any,
  sportName: string
): Promise<void> {
  const eventId = await contest.evaluate(
    (el) => el?.getAttribute("data-event-id") || "N/A"
  );
  if (eventId === "N/A") {
    console.log(colors.red(`Event id is "NA" for contest ${contest}`));
    return;
  }

  const participants: Participant = {};
  let markets: Market[] = [];

  const teamNames = await contest.$$eval(
    ".lp-event__team-name-text, .lp-event__team-name-text--small",
    (teams) => teams.map((team) => (team as HTMLElement).innerText)
  );
  teamNames.forEach((teamName, i) => {
    participants[`participant${i + 1}`] = teamName;
  });

  try {
    const parent = await contest.evaluateHandle((el) => {
      let current = el.parentElement;
      while (current) {
        if (current.classList.contains("lp-event-family")) {
          return current;
        }
        current = current.parentElement;
      }
      return null;
    });

    if (!parent) {
      console.log(
        colors.red(
          `Could not find parent with class lp-event-family for contest ${eventId}`
        )
      );
      return;
    }

    const categoryName = await parent.$eval(
      ".lp-event-family__name span",
      (el) => el?.textContent?.trim() || "N/A"
    );
    const categorySubName = await parent.$eval(
      ".lp-event-family__name strong",
      (el) => el?.textContent?.trim() || "N/A"
    );

    const eventHeading = await contest.$(".lp-event__heading");
    if (eventHeading) {
      await eventHeading.scrollIntoView();
      await delay(500);
      try {
        await Promise.all([
          page.waitForSelector(".psk-event-details", {
            timeout: elementTimeout,
            visible: true,
          }),
          eventHeading.click(),
        ]);
      } catch (error) {
        console.log(
          colors.red(
            `Timeout waiting for .psk-event-details for contest ${eventId}. Skipping markets for this contest.`
          )
        );
        return;
      }
    } else {
      console.log(
        colors.red(
          `No .lp-event__heading found for contest ${eventId}, not possible to click on it`
        )
      );
      return;
    }

    await page.waitForSelector(".lp-offers__item", { timeout: 15000 });

    markets = await page.$$eval(".lp-offers__item", (markets) => {
      return markets.map((market) => {
        const marketHeadingTitle =
          market
            .querySelector(".lp-offer__heading-title")
            ?.textContent?.trim() || "N/A";
        const picksGroup = market.querySelector(".lp-offer__picks-group");
        const marketsText = {};

        if (picksGroup) {
          Array.from(picksGroup.querySelectorAll(".lp-offer__pick")).forEach(
            (pick) => {
              const titleElement = pick.querySelector(".pick-title");
              const oddElement = pick.querySelector(
                ".lp-offer__pick-content-text"
              );
              if (titleElement && oddElement) {
                marketsText[titleElement.textContent.trim()] =
                  oddElement.textContent.trim();
              }
            }
          );
        }
        return { marketHeadingTitle, marketsText };
      });
    });

    if (!allData[sportName][categoryName]) {
      allData[sportName][categoryName] = {};
    }
    if (!allData[sportName][categoryName][categorySubName]) {
      allData[sportName][categoryName][categorySubName] = [];
    }

    allData[sportName][categoryName][categorySubName].push({
      eventId,
      participants,
      markets,
    });

    await goBack(page, eventId);
  } catch (error) {
    console.log(colors.red(`Error processing contest ${eventId}:`, error));
    throw error;
  }
}

async function goBack(page: puppeteer.Page, eventId: string): Promise<void> {
  try {
    await page.waitForSelector(".l-backarrow", {
      visible: true,
      timeout: elementTimeout,
    });
    const breadcrumb = await page.$(".l-backarrow");
    if (breadcrumb) {
      await breadcrumb.hover();
      await breadcrumb.click();
      console.log(`Clicked on the breadcrumb for eventId: ${eventId}`);
      await page.waitForSelector(".lp-event__content-details__popup", {
        hidden: true,
        timeout: elementTimeout,
      });
      await page.waitForSelector(".psk-sport-group:not(.hidden)", {
        timeout: elementTimeout,
      });

      console.log(`Successfully navigated back for eventId: ${eventId}`);
    } else {
      console.warn(
        `Breadcrumb not found for eventId: ${eventId}, Maybe it was closed before.`
      );
    }
  } catch (error) {
    console.warn(`Error navigating back for eventId ${eventId}: ${error}`);
  }
}

async function saveHTML(page: puppeteer.Page, filename: string): Promise<void> {
  try {
    await fs.mkdir(htmlDumpDir, { recursive: true }).catch(() => {});
    const html = await page.content();
    const filePath = path.join(htmlDumpDir, `${filename}.html`);
    await fs.writeFile(filePath, html);
    console.log(colors.green(`HTML saved to ${filePath}`));
  } catch (error) {
    console.error(colors.red(`Error saving HTML: ${error}`));
  }
}

scrapeLuckia();
