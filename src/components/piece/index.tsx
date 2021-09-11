import { PieceModel } from "./model";
import styles from "./index.module.css";

export const Piece: React.FC<PieceModel> = (model) => {
    return <div className={styles[model.color]}></div>;
};
