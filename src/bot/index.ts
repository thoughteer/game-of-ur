import { createEffect, forward, guard, sample, split } from "effector";
import { EngineState, Roll } from "../engine";
import { createRandomBotStrategy } from "./strategies";
import { Bot, BotError, BotKind, BotMove, BotStrategy, DiceRoller } from "./types";

export * from "./types";

export const createBot = (strategy: BotStrategy, diceRoller: DiceRoller = async () => null): Bot => {
    const rollDicesFx = createEffect<void, Roll | null, BotError>(diceRoller);
    const moveFx = createEffect<EngineState, BotMove, BotError>(strategy);
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
        $thinking: moveFx.pending,
    };
};

export const botFactory = {
    create: (kind: BotKind, settings: any) => {
        if (kind === BotKind.RANDOM) {
            return botFactory.createRandomBot();
        }
        throw {};
        // TODO: throw
    },
    createRandomBot: (): Bot => {
        return createBot(createRandomBotStrategy());
    },
};
