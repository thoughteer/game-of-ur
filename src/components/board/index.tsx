import React from "react";
import { BoardModel } from "./model";
import styles from "./index.module.css";

export const Board: React.FC<BoardModel> = (model) => {
    const cells = React.Children.toArray(model.children);
    const table = Array.from(Array(model.height).keys()).map(rowIndex => <div key={rowIndex} className={styles.row}>{cells.slice(rowIndex * model.width, (rowIndex + 1) * model.width)}</div>);
    return <div className={styles.table}>{table}</div>;
};
