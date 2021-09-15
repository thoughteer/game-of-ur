import { useStore } from "effector-react";
import { Board } from "../board";
import { Cell } from "../cell";
import { Roll } from "../roll";
import { GameModel, Outcome } from "./model";
import { BiDice5, BiFastForward, BiHappyBeaming, BiRefresh, BiSad } from "react-icons/bi";
import { Overlay } from "../overlay";
import { useHistory } from "react-router";
import { useEffect } from "react";
import styles from "./index.module.css";

export * as model from "./model";

export const Game: React.FC<GameModel> = (model) => {
  useEffect(() => (() => { model.destroy(); }), [model]);
  const history = useHistory();
  const broken = useStore(model.$broken);
  const rollable = useStore(model.$rollable);
  const skippable = useStore(model.$skippable);
  const outcome = useStore(model.$outcome);
  return <div className={styles.game}>
  {
    broken ? (
      <Overlay>
        <div className={styles.notification}>Sorry, but you may have to restart the game...</div>
        <div className={styles.retryButton} onClick={() => history.go(0)}>
          <BiRefresh size="3em"/>
          <div>RESTART</div>
        </div>
      </Overlay>
    ) : null
  }
  {
    outcome === Outcome.UNKNOWN ? null : (
      <Overlay>
        <div className={styles.outcome}>{
          outcome === Outcome.WIN ? <>
            {"YOU W"} <BiHappyBeaming size="1em"/> {"N"}
          </> : <>
            {"YOU L"} <BiSad size="1em"/> {"ST"}
          </>
        }</div>
        <div className={styles.retryButton} onClick={() => history.go(0)}>
          <BiRefresh size="3em"/>
          <div>TRY AGAIN</div>
        </div>
      </Overlay>
    )
  }
    <div className={styles.panel}>
      <Roll {...model.rollModel}/>
      <div className={styles.filler}/>
      {
        rollable ? (
          <div className={styles.actionButton} onClick={ () => model.rollDices() }><BiDice5/></div>
        ) : (
          skippable ? (
            <div className={styles.actionButton} onClick={ () => model.skipMove() }><BiFastForward/></div>
          ) : <div className={styles.actionButton}></div>
        )
      }
    </div>
    <Board {...model.boardModel}>
      { model.cellModels.map((cellModel, index) => <Cell key={index} {...cellModel}/>) }
    </Board>
  </div>;
};
