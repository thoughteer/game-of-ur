import { createEvent, restore } from "effector";
import { Side } from "../../game/model";
import { BadgeModel } from "./types";

export * from "./types";

export const createBadgeModel = (defaultSide: Side): BadgeModel => {
    const changed = createEvent<Side>();
    const $side = restore(changed, defaultSide);
    return {
        $side,
        changed,
    };
};
