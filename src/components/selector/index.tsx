import { useStore } from "effector-react";
import { SelectorModel } from "./model";
import styles from "./index.module.css";

export const Selector: React.FC<SelectorModel> = (model) => {
    const selectedOptionId = useStore(model.$selectedOptionId);
    return <div className={styles.selector}>
        <div className={styles.panel}>{
            model.options.map(option => <div key={option.id} className={option.id === selectedOptionId ? styles.selectedButton : styles.button} onClick={() => model.changed(option.id)}>
                {option.icon}
                <div className={styles.title}>{option.title}</div>
            </div>)
        }</div>
        <div className={styles.content}>{model.options.find(option => option.id === selectedOptionId)?.content}</div>
    </div>
};
