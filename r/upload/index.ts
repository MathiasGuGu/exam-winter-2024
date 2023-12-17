import { load } from "../../src";
import { BASE_URL } from "../../src/ts/constants";
import { generateToast } from "../../src/ts/ui/toast/toaster";

const submitForm = document.querySelector("#submit-form") as HTMLFormElement;

submitForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(submitForm);
  const data = Object.fromEntries(formData);

  console.log(data);

  let title = data.title;
  let description = data.description;
  let media = data.media;
  let tags = data.tags;
  let endsAt = data.endsAt;

  // @ts-ignore
  tags = tags.split("\n");
  // @ts-ignore
  media = media.split("\n");

  const token = load("accessToken");

  if (!token) {
    generateToast("error", "You must be logged in to do that");
    return;
  }

  const validation = validateForm();

  console.log(validation);

  if (validation.errors.length != 0) {
    validation.errors.forEach((error) => {
      const input = document.querySelector(`#${error}`) as HTMLInputElement;
      input.classList.add("border-red-500");
    });
  }

  if (!validation.valid) {
    return;
  }

  try {
    await fetch(BASE_URL + "/listings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        description,
        media,
        tags,
        endsAt,
      }),
    });
  } catch (err) {
    generateToast("error", "Something went wrong, try again later");
  }
});

// create a function to validate the form
const validateForm = () => {
  const formData = new FormData(submitForm);
  const data = Object.fromEntries(formData);

  let title = data.title;
  let description = data.description;
  let media = data.media;
  let tags = data.tags;
  let endsAt = data.endsAt;

  if (!title || !description || !media || !tags || !endsAt) {
    const errors = [];

    if (!title) {
      errors.push("title");
    }
    if (!description) {
      errors.push("description");
    }
    if (!media) {
      errors.push("media");
    }
    if (!tags) {
      errors.push("tags");
    }
    if (!endsAt) {
      errors.push("endsAt");
    }
    generateToast("error", "Please fill out all fields");
    return { valid: false, errors };
  }

  return { valid: true, errors: [] };
};
