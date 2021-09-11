import { BiBookOpen, BiPyramid, BiCoinStack } from "react-icons/bi";
import { NavLink } from "react-router-dom";
import styles from "./index.module.css";

const tabs = [
    {
        path: "/learn",
        icon: <BiBookOpen/>,
        title: "LEARN",
    },
    {
        path: "/play",
        icon: <BiPyramid/>,
        title: "PLAY",
    },
    {
        path: "/donate",
        icon: <BiCoinStack/>,
        title: "DONATE",
    },
];

export const Header: React.FC<{}> = () => {
    return <div className={styles.header}>{
        tabs.map(({path, icon, title}) => {
            return <NavLink key={path} to={path} className={styles.tab} activeClassName={styles.activeTab}>{icon}<span className={styles.title}>&nbsp;{title}</span></NavLink>
        })
    }</div>;
};
