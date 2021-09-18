import { combine } from "effector";
import { FieldModel } from "../field/model";
import { FormModel } from "./types";

export * from "./types";

export const createFormModel = (fieldModels: FieldModel[]): FormModel => {
    const fieldValueStoresByName: any = {};
    fieldModels.forEach(field => {
        fieldValueStoresByName[field.name] = field.$value;
    });
    const $valid = combine(fieldModels.map(fieldModel => fieldModel.$valid)).map(flags => flags.reduce((a, b) => a && b, true));
    const $state = combine(fieldValueStoresByName);
    return {
        fieldModels,
        $valid,
        $state,
    };
};
