import { combine, createEvent, restore, Store } from "effector";
import { Option, SelectorModel } from "./types";

export * from "./types";

export const createSelectorModel = (options: Option[], defaultOptionId: string = options[0].id): SelectorModel => {
    const changed = createEvent<string>();
    const $id = restore(changed, defaultOptionId);
    const $index = $id.map(id => options.findIndex(option => option.id === id));
    const optionStates = options.map(option => option.formModel?.$state) as Store<any>[];
    const $state = combine([$index, ...optionStates]).map(([index, ...states]) => states[index]);
    return {
        options,
        $id,
        $state,
        changed,
    };
};
