import { parse } from "qs";
import { useLocation, useParams } from "react-router";
import { botFactory, BotKind } from "../../bot";
import { Game } from "../../components/game";
import { createGameModel, Side } from "../../components/game/model";

type Params = {
    side: Side;
    opponentKind: BotKind;
};

export const Play: React.FC<{}> = () => {
    const {side, opponentKind} = useParams<Params>();
    const opponentSettings = parse(useLocation().search);
    const opponent = botFactory.create(opponentKind, opponentSettings);
    const gameModel = createGameModel(side, opponent);
    return <Game {...gameModel}/>;
};
