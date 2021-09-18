import { ActionModel } from "./model";
import styles from "./index.module.css";

export const Action: React.FC<ActionModel> = (model) => {
    return <button className={styles.action} onClick={() => model.act()}>{model.title}</button>;
};
