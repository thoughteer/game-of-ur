import { useStore } from "effector-react";
import { FieldKind, FieldModel, TextFieldModel } from "./model";
import styles from "./index.module.css";

export const Field: React.FC<FieldModel> = (model) => {
    if (model.kind === FieldKind.TEXT) {
        return <TextField {...(model as TextFieldModel)}/>;
    }
    return <></>;
};

export const TextField: React.FC<TextFieldModel> = (model) => {
    const valid = useStore(model.$valid);
    const value = useStore(model.$value);
    return <div>
        <input
            type="text"
            className={`${styles.text} ${valid ? "" : styles.invalid}`}
            placeholder={model.placeholder}
            value={value}
            onChange={e => model.change(e.target.value)}
        />
        {model.satellite}
    </div>;
};

