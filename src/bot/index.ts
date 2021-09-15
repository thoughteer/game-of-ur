import { createEffect, forward, guard, sample, split } from "effector";
import { EngineState, Roll } from "../engine";
import { Bot, BotHand, BotMove, BotStrategy } from "./types";

export * from "./types";

export const createBot = (strategy: BotStrategy, hand: BotHand = async () => null): Bot => {
    const rollDicesFx = createEffect<void, Roll | null, Error>(hand);
    const moveFx = createEffect<EngineState, BotMove, Error>(strategy);
    return {
        attach: (engine, playerId) => {
            const $botsTurn = engine.$state.map(state => state.currentPlayerId === playerId);
            const $rollable = engine.$state.map(state => state.roll === null);

            const diceRollTriggered = guard({
                source: [$botsTurn, $rollable],
                filter: ([botsTurn, rollable]) => botsTurn && rollable,
            });

            const dicesRolled = sample({
                clock: diceRollTriggered,
                target: rollDicesFx,
            }).doneData;

            forward({
                from: dicesRolled,
                to: engine.rollDices,
            });

            const moveTriggered = guard({
                source: [$botsTurn, $rollable],
                filter: ([botsTurn, rollable]) => botsTurn && !rollable,
            });

            const moved = sample({
                source: engine.$state,
                clock: moveTriggered,
                target: moveFx,
            }).doneData;

            split({
                source: moved,
                match: { skip: move => move === null },
                cases: {
                    skip: engine.skipMove,
                    __: engine.movePiece,
                },
            });
        },
        detach: () => {},
        $thinking: moveFx.pending,
    };
};
