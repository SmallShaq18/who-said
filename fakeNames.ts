import fakeNamesData from "./fakeNames.json";

const params = new URLSearchParams(window.location.search);
const mode = params.get("mode") || "default";

const fakeNames =
  fakeNamesData[mode as keyof typeof fakeNamesData] ||
  fakeNamesData.default;

export default fakeNames;
