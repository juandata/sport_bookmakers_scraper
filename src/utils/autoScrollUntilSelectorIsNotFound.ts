import * as puppeteer from "puppeteer";

// --- New Function: autoScrollUntilNoMoreGroups ---
export default async function autoScrollUntilSelectorIsNotFound(
  page: puppeteer.Page,
  selector: string
) {
  let previousCount = 0;
  let currentCount = 0;
  let scrollAttempts = 0;
  const maxScrollAttempts = 5; // Stop after 5 unsuccessful scroll attempts

  while (scrollAttempts < maxScrollAttempts) {
    await page.evaluate(() => {
      window.scrollBy(0, window.innerHeight);
    });
    await new Promise((resolve) => setTimeout(resolve, 500));

    currentCount = await page.$$eval(selector, (elements) => elements.length);
    console.log(`Current ${selector} count is : ${currentCount}`);

    if (currentCount > previousCount) {
      // New element found, reset counter
      scrollAttempts = 0;
      previousCount = currentCount;
    } else {
      scrollAttempts++; // Increase the counter
    }
  }
  console.log(`Finished scrolling. Found ${currentCount} elements.`);
}
