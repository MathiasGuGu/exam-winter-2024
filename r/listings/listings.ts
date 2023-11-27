// TODO: Add pagination
// TODO: Add search
// TODO: Add filters
// TODO: Add sorting
// TODO: Add cards for listings

import { BASE_URL } from "../../src/ts/constants";
import { clear } from "../../src/ts/ui";
import { generateToast } from "../../src/ts/ui/toast/toaster";
import { Listing } from "../../src/types/listing";

const mainContainer = document.querySelector("#main-container") as HTMLElement;
const paginationsContainer = document.querySelector(
  "#pagination-container"
) as HTMLElement;

if (!mainContainer) {
  throw new Error("No main container found");
}

if (!paginationsContainer) {
  throw new Error("No pagination container found");
}

let queryUrl = new URLSearchParams(window.location.search);
const pushState = (page: number, filter: string) => {
  history.pushState({}, "", `?page=${page}&filter=${filter}`);
};
// defining offset for pagination
let baseOffset: number = 20;
let page = parseInt(queryUrl.get("page")!)
  ? parseInt(queryUrl.get("page")!)
  : 1;

pushState(page, "all");

let offset: number = parseInt(queryUrl.get("page")!)
  ? (parseInt(queryUrl.get("page")!) - 1) * baseOffset
  : 0;

function updatePage(difference: number) {
  page = difference;
}

// push page and filter state to url

// Get the user from API
const getListings = async () => {
  try {
    let res = await fetch(BASE_URL + `/listings?limit=20&offset=${offset}`);
    let data: Listing[] = await res.json();
    mainContainer.innerHTML += `<pre class="text-sm max-w-7xl overflow-hidden">${JSON.stringify(
      data,
      null,
      "\t"
    )}</pre>`;
  } catch (error) {
    generateToast("error", "Error");
  }
};

const paginate = (difference: number) => {
  // Reset offset
  offset = 0;
  offset = baseOffset * difference;
  updatePage(difference);
  pushState(page + 1, "all");
  clear(mainContainer);
  clear(paginationsContainer);
  generatePaginationButtons(page);
  getListings();
};

// pagination buttons
const createPaginationButton = (page: number, text = "", active = false) => {
  const paginationButton = document.createElement("button");
  paginationButton.classList.add(
    "text-blue-900",
    "px-4",
    "py-2",
    "rounded-lg",
    "hover:bg-blue-500/10"
  );
  active && paginationButton.classList.add("bg-blue-500/10");

  text
    ? (paginationButton.innerText = text)
    : (paginationButton.innerText = `${page}`);
  paginationButton.addEventListener("click", () => paginate(page - 1));
  paginationsContainer.appendChild(paginationButton);
};

const generatePaginationButtons = (page: number) => {
  createPaginationButton(1, "<<");

  page >= 1 && createPaginationButton(page);

  for (let i = 1; i < 5; i++) {
    let active = page + i - 1 == page;
    createPaginationButton(page + i, "", active);
  }
  createPaginationButton(30, ">>");
};
generatePaginationButtons(page);
getListings();
