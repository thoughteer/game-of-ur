import { FormModel } from "./model";
import { Field } from "./field";
import styles from "./index.module.css";

export const Form: React.FC<FormModel> = (model) => {
    return <div className={styles.form}>{
        model.fieldModels.map(fieldModel => {
            return <Field key={fieldModel.name} {...fieldModel}/>;
        })
    }</div>;
};
