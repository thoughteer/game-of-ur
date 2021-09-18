import { combine, sample } from "effector";
import { FieldModel } from "../field/model";
import { FormModel } from "./types";

export * from "./types";

export const createFormModel = (fieldModels: FieldModel[]): FormModel => {
    const fieldValueStoresByName: any = {};
    fieldModels.forEach(field => {
        fieldValueStoresByName[field.name] = field.$value;
    });
    const $valid = combine(fieldModels.map(fieldModel => fieldModel.$valid)).map(flags => flags.reduce((a, b) => a && b, true));
    const $unvalidatedState = combine(fieldValueStoresByName);
    const $state = sample({
        source: [$valid, $unvalidatedState],
        fn: ([valid, state]) => valid ? state : null,
    });
    return {
        fieldModels,
        $valid,
        $state,
    };
};
