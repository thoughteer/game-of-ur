import { useStore } from "effector-react";
import { Dice } from "../dice";
import { RollModel } from "./model";
import styles from "./index.module.css";

export const Roll: React.FC<RollModel> = (model) => {
    const roll = useStore(model.$state);
    return <div className={styles.roll}>{
        roll === null ? Array.of(0, 1, 2, 3).map(index => (
            <span key={index} className={`${styles.dice} ${index % 2 === 0 ? styles.spinningLeft : styles.spinningRight}`}>
                <Dice value={0}/>
            </span>
        )) : roll?.map((value, index) => (
            <span key={index} className={styles.dice} style={{ transform: `rotate(${360 * Math.random()}deg)` }}>
                <Dice value={value}/>
            </span>
        ))
    }</div>;
};
