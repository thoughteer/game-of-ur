import { P2P } from "./types";
import { createPieSocketP2P } from "./piesocket";

export * from "./types";

export const p2p: P2P = createPieSocketP2P({
    clusterId: "free3",
    version: 3,
    apiKey: "CPsf30DaQRrYzvEWEo6ovTcRRkq9tiWQuqAXFF1j",
});
