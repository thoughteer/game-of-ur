import { useStore } from "effector-react";
import { BadgeModel } from "./model";
import { BiAdjust } from "react-icons/bi";
import styles from "./index.module.css";
import { Side } from "../game/model";

export const Badge: React.FC<BadgeModel> = (model) => {
    const side = useStore(model.$side);
    const oppositeSide = side === Side.WHITE ? Side.BLACK : Side.WHITE;
    return <div className={styles[side]} onClick={() => model.changed(oppositeSide)}><BiAdjust size="2em"/></div>;
};
