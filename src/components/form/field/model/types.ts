import { Event, Store } from "effector";
import { ReactChild } from "react";

export enum FieldKind {
    TEXT,
};

export type FieldModel = {
    kind: FieldKind;
    name: string;
    $valid: Store<boolean>;
    $value: Store<string>;
    change: Event<string>;
};

export type TextFieldModel = FieldModel & {
    placeholder: string;
    satellites: ReactChild[];
};
