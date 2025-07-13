import { BarChart } from "@mui/x-charts";
import React from "react";

import { CardCount } from "@/common/contracts";

import { parseManaCostToCmc } from "../../util/mana";

export interface CurveGraphProps {
    cards: CardCount[];
}

export function CurveGraph(props: CurveGraphProps) {
    const [mapOfMaps, seenCmc] = props.cards
        .map(x => ({ ...x, cmc: parseManaCostToCmc(x.manaCost)}))
        .reduce(([mapOfMaps, seenCmc], curr) => {
            if(!mapOfMaps.has(curr.type)) {
                mapOfMaps.set(curr.type, new Map());
            }

            const map = mapOfMaps.get(curr.type)!;
            map.set(curr.cmc, (map.get(curr.cmc) ?? 0) + curr.count);
            seenCmc.add(curr.cmc);

            return [mapOfMaps, seenCmc];
        }, [new Map(), new Set()] as [Map<string, Map<number, number>>, Set<number>]);


    const cmcArray = Array.from(seenCmc)
        .sort();

    const data = Array.from(mapOfMaps.entries())
        .map(([type, map]) => ({ data: cmcArray.map(cmc => map.get(cmc) ?? 0), stack: "cmc", label: type }));

    return (
        <BarChart
            height={300}
            series={data}
            slotProps={{
                legend: {
                    direction: "horizontal",
                    position: { vertical: "bottom", horizontal: "center" },
                },
            }}
            width={300}
            xAxis={[{ scaleType: "band", data: cmcArray }]}
        />
    );
}
