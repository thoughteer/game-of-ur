import { Store } from "effector";

export type StarterModel = {
    className: string;
    disabledClassName: string;
    $path: Store<string>;
    $disabled: Store<boolean>;
};
