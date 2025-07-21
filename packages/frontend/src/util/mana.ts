import { ManaSymbol } from "@saeris/react-mana";

export function parseManaCost(manaCost: string) {
    return manaCost.split("}")
        .map(x => x.substring(1))
        .filter(x => x != "")
        .map(x => {
            // Multi-character symbols here are formatted like "u/w" and "2/w"
            // but the react component requires "uw" or "2w"
            return x.replace("/", "");
        })
        .map(x => x.toLowerCase() as ManaSymbol);
}

export function parseManaCostToCmc(manaCost: string) {
    return parseManaCost(manaCost)
        .reduce((prev, curr) => {
            // Multi-character symbols are formatted like "uw" or "2w"
            if(curr.length > 0) {
                curr = curr.split("")[0] as ManaSymbol;
            }

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
