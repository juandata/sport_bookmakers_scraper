export default async function autoScrollUntilSelectorIsNotFound(page, selector) {
    let previousCount = 0;
    let currentCount = 0;
    let scrollAttempts = 0;
    const maxScrollAttempts = 5;
    while (scrollAttempts < maxScrollAttempts) {
        await page.evaluate(() => {
            window.scrollBy(0, window.innerHeight);
        });
        await new Promise((resolve) => setTimeout(resolve, 500));
        currentCount = await page.$$eval(selector, (elements) => elements.length);
        console.log(`Current ${selector} count is : ${currentCount}`);
        if (currentCount > previousCount) {
            scrollAttempts = 0;
            previousCount = currentCount;
        }
        else {
            scrollAttempts++;
        }
    }
    console.log(`Finished scrolling. Found ${currentCount} elements.`);
}
//# sourceMappingURL=autoScrollUntilSelectorIsNotFound.js.map