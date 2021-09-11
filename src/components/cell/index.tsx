import { useList, useStore } from "effector-react";
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
    return <div className={styles[`${model.kind}-cell`]} onClick={handleClick}>
        { useList(model.$pieces, pieceModel => <Piece {...pieceModel}/>) }
    </div>;
};
