import { Bot } from "../bot";

export enum BotKind {
    RANDOM = "random",
    FRIEND = "friend",
};

export type BotFactory = {
    create: (kind: BotKind, settings: any) => Bot;
}
