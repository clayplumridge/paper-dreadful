import { ManaSymbol } from "@saeris/react-mana";

export function parseManaCost(manaCost: string) {
    return manaCost.split("")
        .filter(x => x != "{" && x != "}")
        .map(x => x.toLowerCase() as ManaSymbol);
}

export function parseManaCostToCmc(manaCost: string) {
    return manaCost.split("")
        .filter(x => x != "{" && x != "}")
        .reduce((prev, curr) => {
            const asNumber = Number(curr);
            if(isNaN(asNumber)) {
                return prev + 1;
            } else {
                return prev + asNumber;
            }
        }, 0);
}

export function sortByCmc<T extends { displayName: string, cmc: number }>(cards: T[]) {
    return cards.sort((a, b) => {
        if(a.cmc == b.cmc) {
            return a.displayName > b.displayName ? 1 : -1;
        }
        return a.cmc - b.cmc;
    });
}
