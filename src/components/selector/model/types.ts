import { Event, Store } from "effector";
import { ReactChild } from "react";
import { FormModel } from "../../form/model";

export type Option = Readonly<{
    id: string;
    icon?: ReactChild;
    title: string;
    formModel?: FormModel;
}>;

export type SelectorModel = {
    options: Option[];
    $id: Store<string>;
    $state: Store<any>;
    changed: Event<string>;
};
