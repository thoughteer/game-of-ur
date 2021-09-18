import { createFriendBot, validateRoomId } from "./friend";
import { createRandomBot } from "./random";
import { BotKind, BotFactory } from "./types";

export * from "./types";

export const botFactory: BotFactory = {
    create: (kind, settings) => {
        if (kind === BotKind.RANDOM) {
            return createRandomBot();
        }
        if (kind === BotKind.FRIEND) {
            // TODO: handle properly
            if (!validateRoomId(settings.roomId)) {
                throw {};
            }
            return createFriendBot(settings.roomId);
        }
        // TODO: report an error
        throw {};
    },
};
