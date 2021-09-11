import { createEffect, guard, sample, split } from "effector";
import { EngineState } from "../engine";
import { createRandomBotStrategy } from "./strategies";
import { Bot, BotError, BotKind, BotMove, BotStrategy } from "./types";

export * from "./types";

export const createBot = (strategy: BotStrategy): Bot => {
    const decideFx = createEffect<EngineState, BotMove, BotError>(strategy);
    return {
        attach: (engine, playerId) => {
            const $botsTurn = engine.$state.map(state => state.currentPlayerId === playerId);
            const $rollable = engine.$state.map(state => state.roll === null);

            guard({
                source: [$botsTurn, $rollable],
                filter: ([botsTurn, rollable]) => botsTurn && rollable,
                target: engine.roll,
            });

            const triggered = guard({
                source: [$botsTurn, $rollable],
                filter: ([botsTurn, rollable]) => botsTurn && !rollable,
            });

            const decided = sample({
                source: engine.$state,
                clock: triggered,
                target: decideFx,
            }).doneData;

            split({
                source: decided,
                match: { skip: move => move === null },
                cases: {
                    skip: engine.skipMove,
                    __: engine.movePiece,
                },
            });
        },
        $thinking: decideFx.pending,
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
