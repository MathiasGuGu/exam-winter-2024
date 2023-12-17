import { load, save } from "../../src";
import { getTimeRemaining } from "../../src/lib/utils";
import { BASE_URL } from "../../src/ts/constants";
import { clear } from "../../src/ts/ui";
import { isLoggedIn, updateUserTokens } from "../../src/ts/ui/navbar/navbar";
import { generateToast } from "../../src/ts/ui/toast/toaster";
import { Listing } from "../../src/types/listing";

const title = document.querySelector("#title") as HTMLElement;
const body = document.querySelector("#body") as HTMLElement;
const image = document.querySelector("#image") as HTMLImageElement;
const daysContainer = document.querySelector("#days") as HTMLElement;
const hoursContainer = document.querySelector("#hours") as HTMLElement;
const minutesContainer = document.querySelector("#minutes") as HTMLElement;
const secondsContainer = document.querySelector("#seconds") as HTMLElement;
const highestBid = document.querySelector("#highest-bid") as HTMLElement;
const placeBid = document.querySelector("#place-bid") as HTMLElement;

const biddingContainer = document.querySelector(
  "#bidding-container"
) as HTMLElement;
const isUserLoggedIn = isLoggedIn();

if (!isUserLoggedIn) {
  placeBid.classList.add("hidden");
}

// Get the user from API
const getListings = async (id: string) => {
  try {
    let res = await fetch(BASE_URL + `/listings/${id}?_bids=true&_seller=true`);
    let data: Listing = await res.json();
    return data;
  } catch (error) {
    generateToast("error", "Something went wrong");
  }
};
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");

const renderListing = async () => {
  if (id === null) {
    generateToast("error", "No listing found");
  }
  const listing = await getListings(id!);
  if (!listing) {
    return;
  }

  // @ts-ignore because dont want to update the type
  if (listing.bids.length === 0) {
    document.getElementById("top-bids")!.innerHTML = `
    <p class="text-xl text-zinc-600">No bids yet</p>
    `;
  } else {
    listing.bids.map((bid: any, i: number) => {
      biddingContainer.innerHTML += `
      <div>
          <div class="flex items-center justify-between">
            <p class="text-lg">${bid.bidderName}</p>
            <p class="text-lg">${bid.amount} tokens</p>
          </div>
          <div class="border-b"></div>
        </div>`;
    });

    // @ts-ignore because dont want to update the type
    let bids = listing.bids.sort((a, b) => b.amount - a.amount);
    bids.map((bid: any, i: number) => {
      if (i >= 3) {
        return;
      }
      document.getElementById("top-bids")!.innerHTML += `
      <div class="flex items-center gap-2">
                  <p class="text-xl text-zinc-600">${bid.amount} tokens</p>
                  <p class="text-xl font-light text-zinc-500">by ${bid.bidderName}</p>
            </div>`;
    });
  }

  title.innerText = listing.title;
  body.innerText = listing.description;
  // @ts-ignore because dont wanna update the type

  if (listing.bids.length != 0) {
    // @ts-ignore because dont wanna update the type

    highestBid.innerText = `${listing.bids[0].amount} tokens`;
  } else {
    highestBid.innerText = "No bids yet";
  }

  // function that counts down the time remaining
  setInterval(function () {
    let { total, days, hours, minutes, seconds } = getTimeRemaining(
      listing.endsAt
    );

    if (total <= 0) {
      placeBid.classList.add("hidden");
      return;
    }

    daysContainer.innerText = days.toString();
    hoursContainer.innerText = hours.toString();
    minutesContainer.innerText = minutes.toString();
    secondsContainer.innerText = seconds.toString();
  }, 20);

  if (!listing.media) {
    image.src = "/public/placeholderimage.ong.webp";
  }

  image.src = listing.media[0];
};

const placeBidform = document.querySelector("#place-bid") as HTMLFormElement;

placeBidform.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(placeBidform);
  const amount = formData.get("amount") as string;

  if (!amount) {
    generateToast("error", "Please enter an amount");
    return;
  }

  const token = load("accessToken");

  const res = await fetch(BASE_URL + `/listings/${id}/bids`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      amount: parseInt(amount),
    }),
  });
  const data = await res.json();
  if (data.errors) {
    generateToast("error", data.errors[0].message);
    return;
  }

  generateToast("success", "Bid placed");
  clear(document.getElementById("top-bids")!);

  renderListing();
  // remove amount from user.tokens and update user.tokens
  const user = load("user");
  const userObject = JSON.parse(user!);
  userObject.credit -= parseInt(amount);
  save("user", JSON.stringify(userObject));
  updateUserTokens();
});

renderListing();
