import { save, login, register, load } from "../../src/index";
import { generateToast } from "../../src/ts/ui/toast/toaster";
import {
  LoginResponse,
  RegisterResponse,
  fetchError,
} from "../../src/types/listing";

const form = document.querySelector("#register-form") as HTMLFormElement;

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = new FormData(form);

  const username = data.get("username") as string;
  const email = data.get("email") as string;
  const password = data.get("password") as string;

  if (!username || !email || !password) {
    generateToast("error", "Please fill out all necessary fields");
    return;
  }

  let registerData: RegisterResponse | fetchError = await register(
    username,
    email,
    password
  );

  let registerDataError: fetchError = registerData as fetchError;

  if (registerDataError.errors !== undefined) {
    console.log(registerDataError.errors[0]);
    generateToast("error", registerDataError.errors[0].message);
    return;
  }
  let loginResults: LoginResponse | fetchError = await login(email, password);
  let loginResultsError: fetchError = loginResults as fetchError;

  if (loginResultsError.errors !== undefined) {
    generateToast("error", registerDataError.errors[0]);
    return;
  }

  loginResults = loginResults as LoginResponse;

  const user = {
    name: loginResults.name,
    email: loginResults.email,
    avatar: loginResults.avatar,
    credits: loginResults.credits,
  };

  save("user", JSON.stringify(user));
  save("accessToken", loginResults.accessToken);

  const isLoggedIn = load("accessToken") !== undefined;

  isLoggedIn
    ? (window.location.href = "/listings")
    : (window.location.href = "/register");
});
