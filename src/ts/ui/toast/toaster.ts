export function generateToast(type: string, message: string) {
  const toast = document.createElement("div");

  const types = {
    error: [
      "absolute",
      "bottom-6",
      "right-6",
      "px-6",
      "py-3",
      "bg-red-400",
      "text-red-950",
      "flex",
      "items-center",
      "justify-center",
    ],
    success: [
      "absolute",
      "bottom-6",
      "right-6",
      "px-6",
      "py-3",
      "bg-green-400",
      "text-green-950",
      "flex",
      "items-center",
      "justify-center",
    ],
  };

  // @ts-ignore
  toast.classList.add(...types[type]);
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.classList.add("flex");
  }, 100);
  setTimeout(() => {
    toast.classList.remove("flex");
    toast.classList.add("hidden");

    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}
