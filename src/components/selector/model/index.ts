import { createEvent, restore } from "effector";
import { Option, SelectorModel } from "./types";

export * from "./types";

export const createSelectorModel = (options: Option[], defaultOptionId: string = options[0].id): SelectorModel => {
    const changed = createEvent<string>();
    const $selectedOptionId = restore(changed, defaultOptionId);
    return {
        options,
        $selectedOptionId,
        changed,
    };
};
