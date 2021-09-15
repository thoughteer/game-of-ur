import { Store } from "effector";
import { Engine, EngineState, Roll } from "../engine";

export type BotHand = () => Promise<Roll | null>;
export type BotMove = number | null;
export type BotStrategy = (engineState: EngineState) => Promise<BotMove>;

export type Bot = {
    attach: (engine: Engine, playerId: number) => void;
    detach: () => void;
    $thinking: Store<boolean>;
    $broken?: Store<boolean>;
};
