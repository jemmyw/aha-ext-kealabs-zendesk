import { selector, selectorFamily } from "recoil";
import { IDENTIFIER } from "../extension";

export const settingsSelector = selector<Aha.Settings>({
  key: "settingsSelector",
  get: () => aha.settings.get(IDENTIFIER),
});

export const settingSelector = selectorFamily({
  key: "settingSelector",
  get:
    (key: string) =>
    ({ get }) => {
      const settings = get(settingsSelector);
      return settings[key];
    },
});
