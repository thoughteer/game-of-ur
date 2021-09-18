import { ReactChild } from "react";

export type ActionModel = {
    icon?: ReactChild;
    title?: string;
    act: () => void;
};
