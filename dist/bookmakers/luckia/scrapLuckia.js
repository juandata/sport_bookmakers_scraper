var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import puppeteer from "puppeteer-extra";
import colors from "colors";
import fs from "fs/promises";
import * as path from "path";
import { fileURLToPath } from "url";
import autoScrollUntilSelectorIsNotFound from "../../utils/autoScrollUntilSelectorIsNotFound";
import { delay } from "../../utils/index";
import { initializeLogStream, closeLogStream } from "../../utils/logger";
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var mockDataDir = path.join(__dirname, "..", "..", "mockData");
var jsonDataName = "luckia_data.json";
var navigationTimeout = 30000;
var elementTimeout = 10000;
var htmlDumpDir = path.join(__dirname, "..", "..", "htmlDumps");
var logFileName = "luckia_scraping.log";
function scrapeLuckia() {
    return __awaiter(this, void 0, void 0, function () {
        var start, allData, browser, page, isWebPageNotWorking, sportGroups, index, sportGroup, sportId, sportName, sportGroupClass, sportGroupId, sportGroupName, contests, index2, contest, error_1, error_2, end, executionTime;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    start = new Date().getTime();
                    allData = {};
                    return [4, initializeLogStream(logFileName)];
                case 1:
                    _b.sent();
                    return [4, puppeteer.launch({
                            headless: "new",
                            slowMo: 50,
                            devtools: true,
                        })];
                case 2:
                    browser = _b.sent();
                    return [4, browser.newPage()];
                case 3:
                    page = _b.sent();
                    return [4, page.setViewport({
                            width: 1600,
                            height: 1200,
                            deviceScaleFactor: 1,
                            isMobile: false,
                        })];
                case 4:
                    _b.sent();
                    page.setDefaultNavigationTimeout(navigationTimeout);
                    page.setDefaultTimeout(elementTimeout);
                    _b.label = 5;
                case 5:
                    _b.trys.push([5, 27, 28, 30]);
                    return [4, page.goto("https://www.luckia.co/apuestas/en-vivo/", {
                            waitUntil: "networkidle2",
                        })];
                case 6:
                    _b.sent();
                    return [4, page.evaluate(function () {
                            var h1Element = document.querySelector("body > section > div > h1");
                            if (h1Element) {
                                return h1Element.textContent.trim() === "Volvemos Ahora";
                            }
                            return false;
                        })];
                case 7:
                    isWebPageNotWorking = _b.sent();
                    if (!isWebPageNotWorking) return [3, 9];
                    console.log(colors.red("Volvemos Ahora is present in the page. Exiting or handling appropriately..."));
                    return [4, browser.close()];
                case 8:
                    _b.sent();
                    return [2];
                case 9: return [4, page.waitForSelector(".psk-sport-group:not(.hidden)")];
                case 10:
                    _b.sent();
                    return [4, autoScrollUntilSelectorIsNotFound(page, ".spinnerUpcoming")];
                case 11:
                    _b.sent();
                    return [4, saveHTML(page, "after_scrolling")];
                case 12:
                    _b.sent();
                    return [4, page.$$(".psk-sport-group:not(.hidden)")];
                case 13:
                    sportGroups = _b.sent();
                    index = 0;
                    _b.label = 14;
                case 14:
                    if (!(index < sportGroups.length)) return [3, 24];
                    console.log("Processing SportGroup iteration number: ".concat(index));
                    sportGroup = sportGroups[index];
                    sportId = void 0, sportName = void 0;
                    return [4, sportGroup.evaluate(function (el) { return el.className; })];
                case 15:
                    sportGroupClass = _b.sent();
                    sportGroupId = sportGroupClass
                        .split(" ")
                        .find(function (className) { return className.startsWith("sportId"); });
                    sportGroupName = (_a = sportGroupClass
                        .split(" ")
                        .find(function (className) { return className.startsWith("sport-group-type"); })) === null || _a === void 0 ? void 0 : _a.split("-");
                    if (sportGroupId && sportGroupName) {
                        sportId = sportGroupId.replace("sportId", "");
                        sportName = sportGroupName[sportGroupName.length - 1];
                        if (!allData[sportName]) {
                            allData[sportName] = {};
                        }
                    }
                    else {
                        console.log(colors.red("Error getting sportName and sportId classes"));
                        return [2];
                    }
                    return [4, sportGroup.$$(".psk-event.live:not(.disabled)")];
                case 16:
                    contests = _b.sent();
                    index2 = 0;
                    _b.label = 17;
                case 17:
                    if (!(index2 < contests.length)) return [3, 23];
                    console.log("processing Contest number: ".concat(index2));
                    contest = contests[index2];
                    _b.label = 18;
                case 18:
                    _b.trys.push([18, 20, , 22]);
                    return [4, processContest(page, contest, allData, sportName)];
                case 19:
                    _b.sent();
                    return [3, 22];
                case 20:
                    error_1 = _b.sent();
                    console.log(colors.red("Error in process contest ".concat(index2, ", inside loop: "), error_1));
                    return [4, goBack(page, "N/A")];
                case 21:
                    _b.sent();
                    return [3, 22];
                case 22:
                    index2++;
                    return [3, 17];
                case 23:
                    index++;
                    return [3, 14];
                case 24: return [4, fs.mkdir(mockDataDir, { recursive: true }).catch(function () { })];
                case 25:
                    _b.sent();
                    return [4, fs.writeFile(path.join(mockDataDir, jsonDataName), JSON.stringify(allData, null, 2))];
                case 26:
                    _b.sent();
                    console.log(colors.green("SAVED ".concat(jsonDataName, " DATA SUCCESSFULLY")));
                    return [3, 30];
                case 27:
                    error_2 = _b.sent();
                    console.log(colors.red("Error saving data or scraping: ", error_2));
                    return [3, 30];
                case 28:
                    end = new Date().getTime();
                    executionTime = end - start;
                    console.log(colors.blue("Execution time: ".concat(executionTime, " ms")));
                    return [4, browser.close()];
                case 29:
                    _b.sent();
                    closeLogStream();
                    return [7];
                case 30: return [2];
            }
        });
    });
}
function processContest(page, contest, allData, sportName) {
    return __awaiter(this, void 0, void 0, function () {
        var eventId, participants, markets, teamNames, parent_1, categoryName, categorySubName, eventHeading, error_3, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, contest.evaluate(function (el) { return (el === null || el === void 0 ? void 0 : el.getAttribute("data-event-id")) || "N/A"; })];
                case 1:
                    eventId = _a.sent();
                    if (eventId === "N/A") {
                        console.log(colors.red("Event id is \"NA\" for contest ".concat(contest)));
                        return [2];
                    }
                    participants = {};
                    markets = [];
                    return [4, contest.$$eval(".lp-event__team-name-text, .lp-event__team-name-text--small", function (teams) { return teams.map(function (team) { return team.innerText; }); })];
                case 2:
                    teamNames = _a.sent();
                    teamNames.forEach(function (teamName, i) {
                        participants["participant".concat(i + 1)] = teamName;
                    });
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 19, , 20]);
                    return [4, contest.evaluateHandle(function (el) {
                            var current = el.parentElement;
                            while (current) {
                                if (current.classList.contains("lp-event-family")) {
                                    return current;
                                }
                                current = current.parentElement;
                            }
                            return null;
                        })];
                case 4:
                    parent_1 = _a.sent();
                    if (!parent_1) {
                        console.log(colors.red("Could not find parent with class lp-event-family for contest ".concat(eventId)));
                        return [2];
                    }
                    return [4, parent_1.$eval(".lp-event-family__name span", function (el) { var _a; return ((_a = el === null || el === void 0 ? void 0 : el.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || "N/A"; })];
                case 5:
                    categoryName = _a.sent();
                    return [4, parent_1.$eval(".lp-event-family__name strong", function (el) { var _a; return ((_a = el === null || el === void 0 ? void 0 : el.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || "N/A"; })];
                case 6:
                    categorySubName = _a.sent();
                    return [4, contest.$(".lp-event__heading")];
                case 7:
                    eventHeading = _a.sent();
                    if (!eventHeading) return [3, 14];
                    return [4, eventHeading.scrollIntoView({
                            behavior: "auto",
                            block: "center",
                            inline: "nearest",
                        })];
                case 8:
                    _a.sent();
                    return [4, delay(500)];
                case 9:
                    _a.sent();
                    _a.label = 10;
                case 10:
                    _a.trys.push([10, 12, , 13]);
                    return [4, Promise.all([
                            page.waitForSelector(".psk-event-details", {
                                timeout: elementTimeout,
                                visible: true,
                            }),
                            eventHeading.click(),
                        ])];
                case 11:
                    _a.sent();
                    return [3, 13];
                case 12:
                    error_3 = _a.sent();
                    console.log(colors.red("Timeout waiting for .psk-event-details for contest ".concat(eventId, ". Skipping markets for this contest.")));
                    return [2];
                case 13: return [3, 15];
                case 14:
                    console.log(colors.red("No .lp-event__heading found for contest ".concat(eventId, ", not possible to click on it")));
                    return [2];
                case 15: return [4, page.waitForSelector(".lp-offers__item", { timeout: 15000 })];
                case 16:
                    _a.sent();
                    return [4, page.$$eval(".lp-offers__item", function (markets) {
                            return markets.map(function (market) {
                                var _a, _b;
                                var marketHeadingTitle = ((_b = (_a = market
                                    .querySelector(".lp-offer__heading-title")) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.trim()) || "N/A";
                                var picksGroup = market.querySelector(".lp-offer__picks-group");
                                var marketsText = {};
                                if (picksGroup) {
                                    Array.from(picksGroup.querySelectorAll(".lp-offer__pick")).forEach(function (pick) {
                                        var titleElement = pick.querySelector(".pick-title");
                                        var oddElement = pick.querySelector(".lp-offer__pick-content-text");
                                        if (titleElement && oddElement) {
                                            marketsText[titleElement.textContent.trim()] =
                                                oddElement.textContent.trim();
                                        }
                                    });
                                }
                                return { marketHeadingTitle: marketHeadingTitle, marketsText: marketsText };
                            });
                        })];
                case 17:
                    markets = _a.sent();
                    if (!allData[sportName][categoryName]) {
                        allData[sportName][categoryName] = {};
                    }
                    if (!allData[sportName][categoryName][categorySubName]) {
                        allData[sportName][categoryName][categorySubName] = [];
                    }
                    allData[sportName][categoryName][categorySubName].push({
                        eventId: eventId,
                        participants: participants,
                        markets: markets,
                    });
                    return [4, goBack(page, eventId)];
                case 18:
                    _a.sent();
                    return [3, 20];
                case 19:
                    error_4 = _a.sent();
                    console.log(colors.red("Error processing contest ".concat(eventId, ":"), error_4));
                    throw error_4;
                case 20: return [2];
            }
        });
    });
}
function goBack(page, eventId) {
    return __awaiter(this, void 0, void 0, function () {
        var breadcrumb, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 9, , 10]);
                    return [4, page.waitForSelector(".l-backarrow", {
                            visible: true,
                            timeout: elementTimeout,
                        })];
                case 1:
                    _a.sent();
                    return [4, page.$(".l-backarrow")];
                case 2:
                    breadcrumb = _a.sent();
                    if (!breadcrumb) return [3, 7];
                    return [4, breadcrumb.hover()];
                case 3:
                    _a.sent();
                    return [4, breadcrumb.click()];
                case 4:
                    _a.sent();
                    console.log("Clicked on the breadcrumb for eventId: ".concat(eventId));
                    return [4, page.waitForSelector(".lp-event__content-details__popup", {
                            hidden: true,
                            timeout: elementTimeout,
                        })];
                case 5:
                    _a.sent();
                    return [4, page.waitForSelector(".psk-sport-group:not(.hidden)", {
                            timeout: elementTimeout,
                        })];
                case 6:
                    _a.sent();
                    console.log("Successfully navigated back for eventId: ".concat(eventId));
                    return [3, 8];
                case 7:
                    console.warn("Breadcrumb not found for eventId: ".concat(eventId, ", Maybe it was closed before."));
                    _a.label = 8;
                case 8: return [3, 10];
                case 9:
                    error_5 = _a.sent();
                    console.warn("Error navigating back for eventId ".concat(eventId, ": ").concat(error_5));
                    return [3, 10];
                case 10: return [2];
            }
        });
    });
}
function saveHTML(page, filename) {
    return __awaiter(this, void 0, void 0, function () {
        var html, filePath, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4, fs.mkdir(htmlDumpDir, { recursive: true }).catch(function () { })];
                case 1:
                    _a.sent();
                    return [4, page.content()];
                case 2:
                    html = _a.sent();
                    filePath = path.join(htmlDumpDir, "".concat(filename, ".html"));
                    return [4, fs.writeFile(filePath, html)];
                case 3:
                    _a.sent();
                    console.log(colors.green("HTML saved to ".concat(filePath)));
                    return [3, 5];
                case 4:
                    error_6 = _a.sent();
                    console.error(colors.red("Error saving HTML: ".concat(error_6)));
                    return [3, 5];
                case 5: return [2];
            }
        });
    });
}
scrapeLuckia();
//# sourceMappingURL=scrapLuckia.js.map