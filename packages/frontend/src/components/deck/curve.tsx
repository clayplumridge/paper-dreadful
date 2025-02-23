import { BarChart } from "@mui/x-charts";
import { DatasetElementType } from "@mui/x-charts/internals";
import React from "react";

import { CardCount } from "@/common/contracts";

import { parseManaCostToCmc } from "../../util/mana";

export interface CurveGraphProps {
    cards: CardCount[];
}

export function CurveGraph(props: CurveGraphProps) {
    const dataSet = toDataSet(props.cards);

    return (
        <BarChart 
            barLabel="value"
            dataset={dataSet.data}
            height={300}
            series={
                dataSet.typeKeys.map(x => ({ dataKey: x, label: x, stack: "cmc"}))
            }
            slotProps={{
                legend: {
                    direction: "row",
                    position: { vertical: "bottom", horizontal: "middle" },
                    labelStyle: { fontSize: "0.6em" },
                    itemMarkHeight: 10,
                    itemMarkWidth: 10,
                },
            }}
            width={300}
            xAxis={[{ scaleType: "band", dataKey: "cmc" }]}
        />
    );
}

interface DataSetEntry extends DatasetElementType<string | number | undefined> {
    cmc: number;
    [cardType: string]: number;
}

function toDataSet(cards: CardCount[]): { data: DataSetEntry[], typeKeys: string[] } {
    const seenTypes = new Set<string>();

    const map = cards.reduce((data, curr) => {
        const cmc = parseManaCostToCmc(curr.manaCost);
        let entry = data.get(cmc);

        if(!entry) {
            entry = {cmc};
            data.set(cmc, entry);
        }

        entry[`${curr.type}`] = (entry[`${curr.type}`] ?? 0) + curr.count;
        seenTypes.add(curr.type);

        return data;
    }, new Map<number, DataSetEntry>());

    const typeKeys = [...seenTypes].sort();
    return {
        data: [...map.values()].map(
            val => {
                // Populates all missing typeKeys
                return typeKeys.reduce((prev, curr) => {
                    const merged = {...prev};
                    merged[curr] = val[curr] ?? 0;
                    return merged;
                }, {cmc: val.cmc} as DataSetEntry);
            }
        )
            .sort((a, b) => a.cmc - b.cmc),
        typeKeys,
    };
}
