import { BiDizzy } from "react-icons/bi";
import { Option } from "../../../components/selector/model";

export const createRandomOption = (): Option => {
    return {
        id: "random",
        icon: <BiDizzy size="3em"/>,
        title: "Random",
    };
};
