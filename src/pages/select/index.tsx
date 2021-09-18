import { Badge } from "../../components/badge";
import { Side } from "../../components/game/model";
import { Selector } from "../../components/selector";
import { createSelectorModel } from "../../components/selector/model";
import { createBadgeModel } from "../../components/badge/model";
import { createStarterModel } from "../../components/starter/model";
import { Starter } from "../../components/starter";
import { BotKind } from "../../bots";
import { createFriendOption, createRandomOption } from "./options";
import styles from "./index.module.css";

const badgeModel = createBadgeModel(Side.WHITE);

const opponentKindSelectorModel = createSelectorModel([
    createRandomOption(),
    createFriendOption(),
], "friend");

const $opponentKind = opponentKindSelectorModel.$id.map(id => id as BotKind);
const $opponentSettings = opponentKindSelectorModel.$state;

const starterModel = createStarterModel(
    styles.starter,
    styles.disabledStarter,
    badgeModel.$side,
    $opponentKind,
    $opponentSettings,
);

export const Select: React.FC<{}> = () => {
    return <>
        <Selector {...opponentKindSelectorModel}/>
        <div className={styles.panel}>
            <Badge {...badgeModel}/>
            <Starter {...starterModel}>START</Starter>
        </div>
    </>;
};
