import { useStore } from "effector-react";
import { Board } from "../board";
import { Cell } from "../cell";
import { Roll } from "../roll";
import { GameModel } from "./model";
import styles from "./index.module.css";
import { BiPaintRoll, BiSkipNext } from "react-icons/bi";

export * as model from "./model";

export const Game: React.FC<GameModel> = (model) => {
  const rollable = useStore(model.$rollable);
  const skippable = useStore(model.$skippable);
  const outcome = useStore(model.$outcome);
  return <div className={styles.game}>
    <div className={styles.panel}>
      <Roll {...model.rollModel}/>
      <div className={styles.filler}/>
      {
        rollable ? (
          <div className={styles.button} onClick={ () => model.roll() }><BiPaintRoll/></div>
        ) : (
          skippable ? (
            <div className={styles.button} onClick={ () => model.skipMove() }><BiSkipNext/></div>
          ) : <div className={styles.button}></div>
        )
      }
    </div>
    <Board {...model.boardModel}>
      { model.cellModels.map((cellModel, index) => <Cell key={index} {...cellModel}/>) }
    </Board>
  </div>;
};
