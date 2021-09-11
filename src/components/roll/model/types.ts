import { Store } from "effector";
import { Roll } from "../../../engine";

export type RollModel = {
    $state: Store<Roll | null>;
};
