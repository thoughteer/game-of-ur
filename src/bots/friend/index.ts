import { EngineState } from "../../engine";
import { Bot, BotHand, BotMove, BotStrategy, createBot } from "../../bot";
import { attach, createEffect, guard, restore } from "effector";
import { Channel, p2p } from "../../p2p";

export const createFriendBot = (roomId: string): Bot => {
    const channel = p2p.connect(roomId);
    const result = createBot(createFriendBotStrategy(channel), createFriendBotHand(channel));
    const sendFx = createEffect(async (item: any): Promise<void> => {
        await channel.put(item);
    });
    return {
        ...result,
        attach: (engine, playerId) => {
            guard({
                source: engine.$state,
                clock: engine.$state.map(state => state.roll),
                filter: (state, roll) => roll !== null && state.currentPlayerId !== playerId,
                target: sendFx.prepend((state: EngineState) => state.roll),
            });

            const $stateAfterRoll = guard({
                source: engine.$state,
                filter: state => state.roll !== null,
            });

            const $movedPieceId = restore(engine.movePiece, -1).reset(engine.skipMove);

            guard({
                source: $stateAfterRoll,
                clock: [engine.skipMove, engine.movePiece],
                filter: stateAfterRoll => stateAfterRoll.currentPlayerId !== playerId,
                target: attach({
                    effect: sendFx,
                    source: $movedPieceId,
                    mapParams: (_, movedPieceId) => {
                        return movedPieceId < 0 ? null : movedPieceId;
                    },
                }),
            });

            result.attach(engine, playerId);
        },
        detach: () => channel.shutdown(),
        $broken: channel.$coherent.map(coherent => !coherent),
    };
};

export const createFriendBotHand = (channel: Channel): BotHand => {
    return async () => {
        return await channel.get();
    };
};

export const createFriendBotStrategy = (channel: Channel): BotStrategy => {
    return async (engineState: EngineState): Promise<BotMove> => {
        return await channel.get();
    }
};
