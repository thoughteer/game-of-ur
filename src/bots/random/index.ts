import { EngineState, getRandomElement } from "../../engine";
import { Bot, BotMove, BotStrategy, createBot } from "../../bot";

export const createRandomBot = (): Bot => {
    return createBot(createRandomBotStrategy());
};

export const createRandomBotStrategy = (): BotStrategy => {
    return async (engineState: EngineState): Promise<BotMove> => {
        await sleep(1);
        const options = (
            engineState.players[engineState.currentPlayerId].pieces
                .map((piece, pieceId) => ({pieceId, movable: piece.movable}))
                .filter(({movable}) => movable)
                .map(({pieceId}) => pieceId)
        );
        return options.length > 0 ? getRandomElement(options) : null;
    };
};

// TODO: move to helpers
const sleep = (duration: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, duration * 1000));
};
