import { useStore } from "effector-react";
import { Piece } from "../piece";
import { CellModel } from "./model";
import styles from "./index.module.css";

export const Cell: React.FC<CellModel> = (model) => {
    const clickable = useStore(model.$clickable);
    const handleClick = () => {
        if (!clickable) {
            return false;
        }
        model.clicked();
    };
    const topPieceModel = useStore(model.$pieces.map(pieces => pieces.length > 0 ? pieces[0] : null));
    const pieceCount = useStore(model.$pieces.map(pieces => pieces.length));
    return <div className={styles[`${model.kind}-cell`]} onClick={handleClick}>
        { topPieceModel === null ? null : <Piece {...topPieceModel}/> }
        { pieceCount <= 1 ? null : <div className={styles.counter}>&times;{pieceCount}</div> }
    </div>;
};
