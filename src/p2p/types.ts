import { Store } from "effector";

export type ChannelID = string;

export type Channel = {
    put: (item: any) => Promise<void>;
    get: () => Promise<any>;
    shutdown: () => void;
    $coherent: Store<boolean>;
};

export type P2P = {
    connect: (channelId: ChannelID) => Channel;
};
