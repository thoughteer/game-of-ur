import { useStore } from "effector-react";
import { SelectorModel } from "./model";
import styles from "./index.module.css";
import { Form } from "../form";

export const Selector: React.FC<SelectorModel> = (model) => {
    const id = useStore(model.$id);
    const formModel = model.options.find(option => option.id === id)!.formModel;
    return <div className={styles.selector}>
        <div className={styles.panel}>{
            model.options.map(option => <div key={option.id} className={option.id === id ? styles.selectedButton : styles.button} onClick={() => model.changed(option.id)}>
                {option.icon}
                <div className={styles.title}>{option.title}</div>
            </div>)
        }</div>
        <div className={styles.form}>{ formModel ? <Form {...formModel}/> : null}</div>
    </div>
};
