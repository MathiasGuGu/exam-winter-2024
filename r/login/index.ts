import { save, login, load } from "../../src/index";
import { generateToast } from "../../src/ts/ui/toast/toaster";
import { LoginResponse, fetchError } from "../../src/types/listing";

const form = document.querySelector("#register-form") as HTMLFormElement;

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = new FormData(form);

  const email = data.get("email") as string;
  const password = data.get("password") as string;

  if (!email || !password) {
    generateToast("error", "Please fill out all necessary fields");
    return;
  }

  let loginResults: LoginResponse | fetchError = await login(email, password);
  let loginResultsError: fetchError = loginResults as fetchError;

  if (loginResultsError.errors !== undefined) {
    generateToast("error", loginResultsError.errors[0].message);
    return;
  }

  loginResults = loginResults as LoginResponse;

  const user = {
    name: loginResults.name,
    email: loginResults.email,
    avatar: loginResults.avatar,
    credit: loginResults.credits,
  };

  save("user", JSON.stringify(user));
  save("accessToken", loginResults.accessToken);

  const isLoggedIn = load("accessToken") !== undefined;

  isLoggedIn
    ? (window.location.href = "/r/listings")
    : (window.location.href = "/r/register");
});
