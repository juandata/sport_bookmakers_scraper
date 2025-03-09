export const checkIfClassExist = async (page, className) => {
  const classExists = await page.$eval(`.${className}`, (el) => !!el);
  return classExists;
};

export const checkIfClassExistInDOM = (document, className) => {
  let classExists = document.querySelector(`.${className}`);
  do {
    classExists = document.querySelector(`.${className}`);
  } while (!classExists);

  return classExists;
};

export const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

