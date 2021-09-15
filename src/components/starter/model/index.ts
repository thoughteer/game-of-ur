import { combine, Store } from "effector";
import { stringify } from "qs";
import { BotKind } from "../../../bots";
import { Side } from "../../game/model";
import { StarterModel } from "./types";

export * from "./types";

export const createStarterModel = (
    className: string,
    $side: Store<Side>,
    $opponentKind: Store<BotKind>,
    $opponentSettings: Store<any>,
): StarterModel => {
    const $path = combine(
        [$side, $opponentKind, $opponentSettings],
        ([side, opponentKind, opponentSettings]) => {
            return `/play/${side}/vs/${opponentKind}?${stringify(opponentSettings)}`;
        },
    );
    return {
        className,
        $path,
    };
};
