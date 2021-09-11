import styles from "./index.module.css";

export const Overlay: React.FC<{}> = ({children}) => {
    return <div className={styles.overlay}>{children}</div>;
};
