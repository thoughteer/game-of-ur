import { useStore } from "effector-react";
import { StarterModel } from "./model";
import { Link } from "react-router-dom";
import styles from "./index.module.css";

export const Starter: React.FC<StarterModel> = (model) => {
    const path = useStore(model.$path);
    const disabled = useStore(model.$disabled);
    return <Link className={disabled ? `${styles.disabled} ${model.disabledClassName}` : model.className} to={path}>{model.children}</Link>;
};
