import { createFriendBot } from "./friend";
import { createRandomBot } from "./random";
import { BotKind, BotFactory } from "./types";

export * from "./types";

export const botFactory: BotFactory = {
    create: (kind, settings) => {
        if (kind === BotKind.RANDOM) {
            return createRandomBot();
        }
        if (kind === BotKind.FRIEND) {
            // TODO: asset settings.roomId is not undefined
            return createFriendBot(settings.roomId);
        }
        // TODO: report an error
        throw {};
    },
};
