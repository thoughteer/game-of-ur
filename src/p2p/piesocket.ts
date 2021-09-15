import { createEvent, createStore, Event, Store } from "effector";
import { Channel, ChannelID, P2P } from "./types";

export * from "./types";

type Message = {
    source: string;
    index: number;
    item: any;
};

export class PieSocketChannel implements Channel {
    private id: string;
    private uri: string;
    private index: number;
    private target: string | null;
    private egress: Array<Message>;
    private ingress: Array<Message>;

    private socket: WebSocket | null;
    private open: boolean;
    private down: boolean;

    private invalidated: Event<void>;
    $coherent: Store<boolean>;

    constructor(uri: string) {
        // TODO: move to helpers
        this.id = Math.random().toString().slice(2, 10);
        this.uri = uri;
        this.index = 0;
        this.target = null;
        this.egress = [];
        this.ingress = [];

        this.socket = null;
        this.open = false;
        this.down = false;

        this.invalidated = createEvent();
        this.$coherent = createStore<boolean>(true).on(this.invalidated, () => false);
    }

    async put(item: any): Promise<void> {
        // TODO: assert not down
        await this.prepare();
        await ensure(() => this.open || this.down);

        this.egress.push({ source: this.id, index: this.index, item });
        this.index += 1;
        const currentIndex = this.index;

        await repeat(() => {
            this.socket?.send(JSON.stringify(this.egress));
        }, 5, () => this.index > currentIndex || this.down);
    }

    async get(): Promise<any> {
        // TODO: assert not down
        await this.prepare();
        await ensure(() => this.ingress.length > 0 || this.down);
        return this.ingress.shift()?.item;
    }

    shutdown(): void {
        this.down = true;
        if (this.socket !== null) {
            this.socket.onclose = event => {};
            this.socket.close();
        }
    }

    private async prepare(): Promise<void> {
        if (this.socket !== null) {
            return;
        }

        this.socket = new WebSocket(this.uri);

        this.socket.onopen = event => {
            this.open = true;
        };

        this.socket.onmessage = event => {
            const batch = (JSON.parse(event.data) as Array<any>).filter(message => message.source !== this.target || message.index >= this.index);
            if (batch.length === 0) {
                return;
            } else if ((this.target !== null && batch[0].source !== this.target) || batch[0].index !== this.index) {
                this.invalidated();
                return;
            }
            this.target = batch[0].source;
            this.ingress.push(...batch);
            this.index += batch.length;
            this.egress.length = 0;
        };

        this.socket.onerror = event => {
            this.socket?.close();
        };

        this.socket.onclose = event => {
            this.open = false;
            this.socket = null;
            setTimeout(() => this.prepare(), 1000);
        };
    }
};

export type PieSocketP2POptions = {
    clusterId: string;
    version: number;
    apiKey: string;
};

export const createPieSocketP2P = (options: PieSocketP2POptions): P2P => {
    return {
        connect: (channelId: ChannelID): Channel => {
            const uri = `wss://${options.clusterId}.piesocket.com/v${options.version}/${channelId}?api_key=${options.apiKey}`;
            return new PieSocketChannel(uri);
        },
    };
};

// TODO: move to helpers
const ensure = (condition: () => boolean, timeout?: number): Promise<void> => {
    return new Promise((resolve, reject) => {
        const startTime = Date.now() / 1000;
        (function checkAndResolve() {
            if (condition()) {
                resolve();
            } else {
                if (timeout !== undefined && Date.now() / 1000 - startTime > timeout) {
                    reject();
                } else {
                    setTimeout(checkAndResolve, 50);
                }
            }
        })();
    });
};

// TODO: move to helpers
const repeat = async (action: () => void, delay: number, until: () => boolean): Promise<void> => {
    while (!until()) {
        action();
        await ensure(until, delay).catch(() => {});
    }
};
