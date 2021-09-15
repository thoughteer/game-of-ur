import { BiDizzy, BiFace } from "react-icons/bi";
import { Badge } from "../../components/badge";
import { Side } from "../../components/game/model";
import { Selector } from "../../components/selector";
import { createSelectorModel } from "../../components/selector/model";
import { createBadgeModel } from "../../components/badge/model";
import { createStarterModel } from "../../components/starter/model";
import { Starter } from "../../components/starter";
import { BotKind } from "../../bots";
import { createStore } from "effector";
import styles from "./index.module.css";

const opponentKindSelectorModel = createSelectorModel([
    {
        id: "random",
        icon: <BiDizzy size="3em"/>,
        title: "Random",
    },
    {
        id: "friend",
        icon: <BiFace size="3em"/>,
        title: "Friend",
        content: <span>URI?</span>,
    },
], "random");

const $opponentKind = opponentKindSelectorModel.$selectedOptionId.map(id => id as BotKind);

const badgeModel = createBadgeModel(Side.WHITE);

const $opponentSettings = createStore<any>({});

const starterModel = createStarterModel(styles.starter, badgeModel.$side, $opponentKind, $opponentSettings);

export const Select: React.FC<{}> = () => {
    return <>
        <Selector {...opponentKindSelectorModel}/>
        <div className={styles.panel}>
            <Badge {...badgeModel}/>
            <Starter {...starterModel}>START</Starter>
        </div>
    </>;
};
