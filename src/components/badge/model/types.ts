import { Event, Store } from "effector";
import { Side } from "../../game/model";

export type BadgeModel = {
    $side: Store<Side>;
    changed: Event<Side>;
};
