import { Event, Store } from "effector";
import { Roll } from "../../../engine";
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
    rollModel: RollModel;
    boardModel: BoardModel;
    cellModels: CellModel[];
    $rollable: Store<boolean>;
    $skippable: Store<boolean>;
    $outcome: Store<Outcome>;
    rollDices: Event<void>;
    skipMove: Event<void>;
};
