// TODO: Add pagination
// TODO: Add search
// TODO: Add filters
// TODO: Add sorting
// TODO: Edit cards to fit theme and UI design

import { getTimeRemaining } from "../../src/lib/utils";
import { BASE_URL } from "../../src/ts/constants";
import { clear } from "../../src/ts/ui";
import { generateToast } from "../../src/ts/ui/toast/toaster";
import { Listing } from "../../src/types/listing";

const filterButton = document.querySelector("#filter-button") as HTMLElement;
const filterForm = document.querySelector("#filter-form") as HTMLFormElement;
const searchInput = document.querySelector("#search-input") as HTMLInputElement;
// get all parameters from url

// remove the page parameter from the url
let searchFiltersUrl = new URLSearchParams(window.location.search);
searchFiltersUrl.delete("page");
let searchFilters = searchFiltersUrl.toString();

filterButton.addEventListener("click", () => {
  filterButton.classList.toggle("bg-zinc-200");
  filterForm.classList.toggle("hidden");
});

filterForm.addEventListener("submit", (e) => {
  e.preventDefault();
  clear(mainContainer);
  // get the state of all elements in the form

  let filters = [];

  const radioButtons = filterForm.querySelectorAll('input[type="radio"]');
  const radioStates = Array.from(radioButtons)
    .filter((radio: any) => radio.checked)
    .map((radio: any) => radio.id);
  filters.push(...radioStates);

  const checkboxes = filterForm.querySelectorAll('input[type="checkbox"]');
  const checkboxStates = Array.from(checkboxes)
    .filter((check: any) => check.checked)
    .map((check: any) => check.id);
  filters.push(...checkboxStates);

  filters = filters.map((filter) =>
    filter
      .replace("popularity", "sort=endsAt")
      .replace("date", "sort=created")
      .replace("any", "sortOrder=desc")
      .replace("low", "sortOrder=asc")
      .replace("high", "sortOrder=desc")
      .replace("active", "_active=true")
      .replace("-", "&")
  );

  // add ? to start of string
  let urlFilters = filters.join("&");
  // add url filters to end of url

  console.log(urlFilters);

  searchFilters = urlFilters;

  const filterSearchUrl =
    BASE_URL +
    `/listings?limit=20&offset=${offset}&_bids=true&_seller=true&` +
    urlFilters;

  pushState(1, searchFilters);

  getListings(filterSearchUrl);
  clear(paginationsContainer);
  generatePaginationButtons(1);
});

const generateCard = (listing: Listing) => {
  const { description, updated, title, tags, media, endsAt, id } = listing;
  // Check if image exists, if not. Use placeholder

  let { days } = getTimeRemaining(endsAt);

  if (days < 0) {
    days = 0;
  }

  return `
  <a href="/r/listing/?id=${id}" class="md:w-[23%] w-1/2 h-auto border flex flex-col gap-2 rounded-xl">
    <div class="w-full aspect-video relative">
      <img
        src=${media.length > 0 ? media[0] : "/public/placeholderimage.ong.webp"}
        class="w-full aspect-video object-cover rounded-t-xl"
      />
      <div
        class="absolute right-3 -bottom-3 bg-background shadow w-32 h-8 rounded-full flex items-center justify-center text-sm"
      >
        Ends in ${days} days
      </div>
    </div>
    <div class="flex flex-col h-auto px-4 text-sm text-text">
      <p class="text-text/50 overflow-hidden">${title}</p>
      <p class="font-heading text-base overflow-hidden">
        ${description}
      </p>
      <div class="flex items-center gap-3">
      </div>
      <div class="w-full h-auto mt-8 flex items-center gap-2 mb-2">
      </div>
    </div>
    </a>`;
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

const pushState = (page: number, filter: string) => {
  history.pushState({}, "", `?page=${page}&${filter}`);
};

// defining offset for pagination
let baseOffset: number = 20;
let urlSearchParams = new URLSearchParams(window.location.search);
let page = parseInt(urlSearchParams.get("page")!)
  ? parseInt(urlSearchParams.get("page")!)
  : 1;

let offset: number = parseInt(urlSearchParams.get("page")!)
  ? (parseInt(urlSearchParams.get("page")!) - 1) * baseOffset
  : 0;

function updatePage(difference: number) {
  page = difference;
}

// push page and filter state to url
function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
}
// Get the user from API
const getListings = async (url: any) => {
  try {
    // create a new url search params object to add to the fetch
    let res;
    if (!isValidUrl(url)) {
      res = await fetch(BASE_URL + `/listings?limit=20&offset=${offset}`);
    } else {
      console.log(isValidUrl(url));
      res = await fetch(url);
    }
    let data: Listing[] = await res.json();
    mainContainer.innerHTML += data
      .map((listing) => {
        return generateCard(listing);
      })
      .join("");
  } catch (error) {
    generateToast("error", "Something went wrong");
  }
};

const paginate = (difference: number) => {
  // Reset offset
  offset = 0;
  offset = baseOffset * difference;
  updatePage(difference);
  pushState(page + 1, searchFilters);
  clear(mainContainer);
  clear(paginationsContainer);
  generatePaginationButtons(page);

  getListings(
    BASE_URL + `/listings?limit=20&offset=${offset}&` + searchFilters
  );
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
  active && paginationButton.classList.add("bg-blue-500/10", "aria-current");

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

function debounce(func: Function, wait: number) {
  let timeout: any;
  return function run(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

async function getAllListings(searchQuery: string) {
  const res = await fetch(BASE_URL + `/listings?_tag=${searchQuery}`);
  const data = await res.json();
  return await data;
}

searchInput.addEventListener(
  "input",
  debounce(async (e: any) => {
    clear(mainContainer);

    if (e.target.value.length == 0) {
      clear(mainContainer);
      getListings(
        BASE_URL + `/listings?limit=20&offset=${offset}&` + searchFilters
      );
      return;
    }

    const data = await getAllListings(e.target.value);

    mainContainer.innerHTML += data
      .map((listing: any) => {
        return generateCard(listing);
      })
      .join("");
  }, 500)
);

generatePaginationButtons(page - 1);
getListings(BASE_URL + `/listings?limit=20&offset=${offset}&` + searchFilters);
