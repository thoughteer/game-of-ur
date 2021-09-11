import { Event, Store } from "effector";
import { ReactChild } from "react";

export type Option = Readonly<{
    id: string;
    icon?: ReactChild;
    title: string;
    content?: ReactChild;
}>;

export type SelectorModel = {
    options: Option[];
    $selectedOptionId: Store<string>;
    changed: Event<string>;
};
