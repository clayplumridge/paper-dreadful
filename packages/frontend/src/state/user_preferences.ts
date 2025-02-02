import { atom } from "recoil";

export const enum PriceDisplayMode {
    TOTAL = "total", PER_CARD = "per_card",
}

export const enum Theme {
    DARK = "dark",
    LIGHT = "light",
}

export const userPreferences = {
    priceDisplayMode: userPreferenceAtom<PriceDisplayMode>("priceDisplayMode", PriceDisplayMode.TOTAL),
    theme: userPreferenceAtom<Theme>("theme", Theme.DARK),
};

function userPreferenceAtom<T extends string>(key: string, defaultValue: T) {
    const fullKey = `userPreferences.${key}`;

    return atom<T>({
        key: fullKey,
        default: localStorage.getItem(fullKey) as T ?? defaultValue,
        effects: [
            ({onSet}) => {
                onSet(newVal => localStorage.setItem(fullKey, newVal));
            },
        ],
    });
}
