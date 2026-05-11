export function setButtonText(
  btn,
  isLoanding,
  defaultText = "Save",
  loandingText = "Saving..."
) {
  if (isLoanding) {
    return res.saving();
  } else {
    return res.save();
  }
}
