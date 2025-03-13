var initialData = [];
var allElements = document.querySelectorAll("*");
allElements.forEach(function (el) {
    initialData.push({
        tagName: el.tagName,
        id: el.id,
        className: el.className,
    });
});
var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
        if (mutation.type === "attributes") {
            if (mutation.attributeName === "class" ||
                mutation.attributeName === "id") {
                var target = mutation.target;
                console.log("Attribute ".concat(mutation.attributeName, " changed on ").concat(target.tagName), {
                    oldValue: mutation.oldValue,
                    newValue: target[mutation.attributeName],
                });
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
var data = {
    initialData: initialData,
    message: "MutationObserver is now monitoring class and ID changes. Check the console for updates.",
};
//# sourceMappingURL=mutationObserver.js.map