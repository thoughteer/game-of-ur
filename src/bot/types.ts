import { Store } from "effector";
import { Engine, EngineState, Roll } from "../engine";

export type DiceRoller = () => Promise<Roll | null>;

export type BotMove = number | null;
export type BotStrategy = (engineState: EngineState) => Promise<BotMove>;

export interface BotError extends Error {};

export type Bot = {
    attach: (engine: Engine, playerId: number) => void;
    $thinking: Store<boolean>;
};

export enum BotKind {
    RANDOM = "random",
};
