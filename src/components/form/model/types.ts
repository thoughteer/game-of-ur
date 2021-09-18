import { Store } from "effector";
import { FieldModel } from "../field/model";

export type FormModel = {
    fieldModels: FieldModel[];
    $valid: Store<boolean>;
    $state: Store<any>;
};
