/**
 * The user wants to observe the changes in class names and IDs of elements as the webpage loads. This requires monitoring the DOM for mutations, specifically changes to the class and id attributes of elements. We can use a MutationObserver to detect these changes. Since the user is asking about the whole page, we should observe the body element and its descendants. We need to collect the initial state of the class names and IDs, then set up the observer to track changes, and finally, log the changes to the console.
 */

const initialData = [];
const allElements = document.querySelectorAll("*");

allElements.forEach((el) => {
  initialData.push({
    tagName: el.tagName,
    id: el.id,
    className: el.className,
  });
});

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === "attributes") {
      if (
        mutation.attributeName === "class" ||
        mutation.attributeName === "id"
      ) {
        const target = mutation.target;
        console.log(
          `Attribute ${mutation.attributeName} changed on ${target.tagName}`,
          {
            oldValue: mutation.oldValue,
            newValue: target[mutation.attributeName],
          }
        );
      }
    }
  });
});

observer.observe(document.body, {
  attributes: true,
  attributeOldValue: true,
  subtree: true,
  attributeFilter: ["class", "id"],
});

const data = {
  initialData,
  message:
    "MutationObserver is now monitoring class and ID changes. Check the console for updates.",
};
