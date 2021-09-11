import { DiceModel } from "./model";
import { ReactComponent as BlackDiceImage } from "./images/black.svg";
import { ReactComponent as WhiteDiceImage } from "./images/white.svg";
import styles from "./index.module.css";

export const Dice: React.FC<DiceModel> = (model) => {
    return model.value === 0 ? <BlackDiceImage className={styles.dice}/> : <WhiteDiceImage className={styles.dice}/>;
};
