declare module "@saeris/react-mana" {
    export type ManaColorSymbol = "w" | "u" | "b" | "r" | "g" | "c" | "s";
    export type PhyrexianManaSymbol = "p" | "wp" | "up" | "bp" | "rp" | "gp";
    export type HybridManaSymbol = "wu" | "wb" | "ub" | "ur" | "br" | "bg" | "rg" | "rw" | "gw" | "gu" | "2s" | "2u" | "2b" | "2r" | "2g";
    export type GenericManaSymbol = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "11" | "12" | "13" | "14" | "15" | "16" | "17" | "18" | "19" | "20";

    export type ManaSymbol =
        | ManaColorSymbol
        | PhyrexianManaSymbol
        | HybridManaSymbol
        | GenericManaSymbol;
        
    export interface ManaProps {
        symbol: ManaSymbol;
        size?: "2s" | "3x" | "4x" | "5x" | "6x";
        cost?: boolean;
        shadow?: boolean;
        fixed?: boolean;
    }

    export const Mana: React.FC<ManaProps>;
}
