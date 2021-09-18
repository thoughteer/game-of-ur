import { BiCopy, BiFace } from "react-icons/bi";
import { validateRoomId } from "../../../bots/friend";
import { Action } from "../../../components/form/action";
import { createTextFieldModel } from "../../../components/form/field/model";
import { createFormModel } from "../../../components/form/model";
import { Option } from "../../../components/selector/model";

export const createFriendOption = (): Option => {
    const roomIdModel = createTextFieldModel(
        "roomId",
        "Room #",
        validateRoomId,
        [
            <Action icon={<BiCopy/>} act={() => navigator.clipboard.writeText(roomIdModel.$value.getState())}/>,
            // TODO: move to helpers
            <Action title="Generate" act={() => roomIdModel.change(Math.random().toString().slice(2, 12))}/>,
        ],
    );
    const fieldModels = [
        roomIdModel,
    ]
    return {
        id: "friend",
        icon: <BiFace size="3em"/>,
        title: "Friend",
        formModel: createFormModel(fieldModels),
    };
};
