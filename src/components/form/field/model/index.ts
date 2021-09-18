import { createEvent, restore } from "effector";
import { ReactChild } from "react";
import { FieldKind, TextFieldModel } from "./types";

export * from "./types";

export const createTextFieldModel = (
    name: string,
    placeholder: string,
    validator: (value: string) => boolean = () => true,
    satellites: ReactChild[] = []
): TextFieldModel => {
    const changed = createEvent<string>();
    const $valid = restore(changed.map(validator), false);
    const $value = restore(changed, "");    
    return {
        kind: FieldKind.TEXT,
        name,
        placeholder,
        satellites,
        $valid,
        $value,
        change: changed,
    };
};
