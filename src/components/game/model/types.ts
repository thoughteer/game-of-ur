import { Event, Store } from "effector";
import { BoardModel } from "../../board/model";
import { CellModel } from "../../cell/model";
import { RollModel } from "../../roll/model";

export enum Side {
    BLACK = "black",
    WHITE = "white",
};

export enum Outcome {
    UNKNOWN,
    LOSS,
    WIN,
};

export type GameModel = {
    destroy: () => void;
    rollModel: RollModel;
    boardModel: BoardModel;
    cellModels: CellModel[];
    $broken: Store<boolean>;
    $rollable: Store<boolean>;
    $skippable: Store<boolean>;
    $outcome: Store<Outcome>;
    rollDices: Event<void>;
    skipMove: Event<void>;
};
