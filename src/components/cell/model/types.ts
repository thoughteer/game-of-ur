import { Event, Store } from "effector";
import { CellKind } from "../../../engine";
import { PieceModel } from "../../piece/model";

export type CellModel = {
    kind: CellKind;
    $clickable: Store<boolean>;
    $pieces: Store<PieceModel[]>;
    clicked: Event<void>;
};
