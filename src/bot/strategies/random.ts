import { EngineState, getRandomElement } from "../../engine";
import { BotMove, BotStrategy } from "../types";

// TODO: move to helpers
const sleep = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

export const createRandomBotStrategy = (): BotStrategy => {
    return async (engineState: EngineState): Promise<BotMove> => {
        await sleep(1000);
        const options = (
            engineState.players[engineState.currentPlayerId].pieces
                .map((piece, pieceId) => ({pieceId, movable: piece.movable}))
                .filter(({movable}) => movable)
                .map(({pieceId}) => pieceId)
        );
        return options.length > 0 ? getRandomElement(options) : null;
    };
};
