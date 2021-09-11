import { useStore } from "effector-react";
import { StarterModel } from "./model";
import { Link } from "react-router-dom";

export const Starter: React.FC<StarterModel> = (model) => {
    const path = useStore(model.$path);
    return <Link className={model.className} to={path}>{model.children}</Link>;
};
