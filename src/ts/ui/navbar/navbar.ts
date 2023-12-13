import { load } from "../../storage";

function isLoggedIn() {
  const user = load("user");
  const accessToken = load("accessToken");

  if (user && accessToken) {
    return true;
  } else {
    return false;
  }
}

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

userIcon.src = user.avatar ? user.avatar : "/public/useravatar.png";

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
  ? ((userTokens.innerText = `${user.credit} credits`),
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
