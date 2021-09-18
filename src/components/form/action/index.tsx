import { ActionModel } from "./model";
import styles from "./index.module.css";

export const Action: React.FC<ActionModel> = (model) => {
    return <div className={styles.action} onClick={() => model.act()}>{model.icon} {model.title}</div>;
};
