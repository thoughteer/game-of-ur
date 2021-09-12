import { Event, Store } from "effector";

export type Board = Readonly<{
    cells: Readonly<Cell[]>;
    paths: Readonly<Path[]>;
}>;

export type Cell = Readonly<{
    kind: CellKind;
}>;

export enum CellKind {
    START = "start",
    NORMAL = "normal",
    LUCKY = "lucky",
    SAFE = "safe",
    FINISH = "finish",
};

export type Path = Readonly<number[]>;

export type Player = Readonly<{
    pieces: Readonly<Piece[]>;
}>;

export type Piece = Readonly<{
    cellId: number;
    movable: boolean;
}>;

export type Dice = Readonly<{
    possibleValues: Readonly<number[]>;
}>;

export type Roll = Readonly<number[]>;

export type EngineState = Readonly<{
    currentPlayerId: number;
    players: Readonly<Player[]>;
    roll: Roll | null;
    ended: boolean;
}>;

export type Engine = {
    $state: Store<EngineState>;
    start: Event<number>;
    rollDices: Event<Roll | null>;
    skipMove: Event<void>;
    movePiece: Event<number>;
};
