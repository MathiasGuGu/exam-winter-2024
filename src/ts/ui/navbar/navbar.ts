import { clear } from "..";
import { BASE_URL } from "../../constants";
import { load, remove, save } from "../../storage";
import { generateToast } from "../toast/toaster";

const manageAccount = document.querySelector(
  "#manage-account"
) as HTMLButtonElement;
const logout = document.querySelector("#logout") as HTMLButtonElement;

const accountContainer = document.querySelector(
  "#account-container"
) as HTMLDivElement;

const accountManager = document.querySelector(
  "#account-manager"
) as HTMLDivElement;
const accountManagerBackdrop = document.querySelector(
  "#account-manager-backdrop"
) as HTMLDivElement;
const accountAvatarForm = document.querySelector(
  "#account-avatar-form"
) as HTMLFormElement;
const accountManagerClose = document.querySelector(
  "#account-manager-close"
) as HTMLButtonElement;

const userManagerAvatar = document.querySelector(
  "#user-manager-avatar"
) as HTMLImageElement;

if (isLoggedIn()) {
  manageAccount.addEventListener("click", () => {
    let user = load("user");
    user = JSON.parse(user!);
    if (!user) return;
    // @ts-ignore
    userManagerAvatar.src = user.avatar;
    accountManager.classList.toggle("hidden");
    accountContainer.classList.toggle("hidden");
    accountManagerBackdrop.classList.toggle("hidden");
  });
  accountManagerBackdrop.addEventListener("click", () => {
    accountManager.classList.add("hidden");
    accountManagerBackdrop.classList.add("hidden");
  });
  accountManagerClose.addEventListener("click", () => {
    accountManager.classList.add("hidden");
    accountManagerBackdrop.classList.add("hidden");
  });

  accountAvatarForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    let user = load("user");
    user = JSON.parse(user!);
    if (!user) return;
    try {
      // @ts-ignore
      let res = await fetch(BASE_URL + `/profiles/${user.name}/media`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${load("accessToken")}`,
        },
        body: JSON.stringify({
          // @ts-ignore
          avatar: e.target[0].value,
        }),
      });
      const data = await res.json();
      remove("user");
      save("user", JSON.stringify(data));
      userManagerAvatar.src = data.avatar;
      generateToast("success", "Avatar updated!");
    } catch (err) {}
  });
}
if (logout) {
  logout.addEventListener("click", () => {
    remove("user");
    remove("accessToken");
    window.location.href = "/";
  });
}

export function isLoggedIn() {
  const user = load("user");
  const accessToken = load("accessToken");

  if (user && accessToken) {
    return true;
  } else {
    return false;
  }
}

export const updateUserTokens = () => {
  if (!isLoggedIn()) return;
  clear(userTokens);
  userTokens.innerText = `${user.credits} credits`;
};

const navUserStateComponent = document.querySelector(
  "#nav-user-state"
) as HTMLDivElement;

const noUserTemplate = `
<a id="nav-signin" href="/r/login/" class="text-blue-500 px-4 py-2">Sign in</a>
<a id="nav-register" href="/r/register/" class="px-4 py-2 bg-blue-500 rounded-lg text-blue-50">Register</a>
`;

const userData: any = load("user");
const user = JSON.parse(userData);

const userIcon = document.createElement("img") as HTMLImageElement;
userIcon.addEventListener("click", () => {
  if (!isLoggedIn()) return;
  accountContainer.classList.toggle("hidden");
});
if (user) {
  userIcon.src = user.avatar ? user.avatar : "/public/useravatar.png";
}
const userTokens = document.createElement("div");
userTokens.classList.add(
  "flex",
  "w-auto",
  "h-full",
  "items-center",
  "justify-center"
);

const uploadButton = document.createElement("a");
uploadButton.href = "/r/upload/";
uploadButton.innerText = "Upload";
uploadButton.classList.add(
  "px-6",
  "mr-4",
  "py-2",
  "bg-blue-500",
  "rounded-lg",
  "text-blue-50"
);

isLoggedIn()
  ? ((userTokens.innerText = `${user.credits} credits`),
    userIcon.classList.add(
      "w-10",
      "h-10",
      "border-2",
      "rounded-full",
      "relative"
    ))
  : null;

isLoggedIn()
  ? (navUserStateComponent.appendChild(uploadButton),
    navUserStateComponent.appendChild(userTokens),
    navUserStateComponent.appendChild(userIcon),
    navUserStateComponent.classList.add("flex", "gap-2"))
  : (navUserStateComponent.innerHTML = noUserTemplate);

updateUserTokens();
