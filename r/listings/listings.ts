// TODO: Add pagination
// TODO: Add search
// TODO: Add filters
// TODO: Add sorting
// TODO: Add cards for listings

import { BASE_URL } from "../../src/ts/constants";
import { clear } from "../../src/ts/ui";
import { generateToast } from "../../src/ts/ui/toast/toaster";
import { Listing } from "../../src/types/listing";

const generateCard = (listing: Listing) => {
  const { description, updated, title, tags, media, endsAt } = listing;
  return `<div class="w-[23%] h-auto border flex flex-col gap-2 rounded-xl">
    <div class="w-full aspect-video relative">
      <img
        src=${media[0]}
        class="w-full aspect-video rounded-t-xl"
      />
      <div
        class="absolute right-3 -bottom-3 bg-background shadow w-32 h-8 rounded-full flex items-center justify-center text-sm"
      >
        Ends in 2 days
      </div>
    </div>
    <div class="flex flex-col h-auto px-4 text-sm text-text">
      <p class="text-text/50">${title}</p>
      <p class="font-heading text-base">
        ${description}
      </p>
      <div class="flex items-center gap-3">

      </div>
      <div class="w-full h-auto mt-8 flex items-center gap-2 mb-2">
        <div class="w-10 aspect-square rounded-full bg-blue-600"></div>
        <p>Magugu</p>
      </div>
    </div>
    </div>`;
};

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
    mainContainer.innerHTML += data.map((listing) => {
      return generateCard(listing);
    });
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
