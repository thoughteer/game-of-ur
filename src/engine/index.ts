import assert from "assert";
import { createEvent, createStore } from "effector";
import { Board, CellKind, Dice, Engine, Path, Piece, Roll, EngineState } from "./types";

export * from "./types";

// TODO: add more asserts!
// TODO: introduce CellId's
// TODO: learn to write tests

export const createEngine = (board: Board, dices: Dice[], pieceCount: number): Engine => {
    const $state = createStore<EngineState>({
        currentPlayerId: -1,
        players: board.paths.map(path => ({
            pieces: Array(pieceCount).fill({
                cellId: path[0],
                movable: false,
            }),
        })),
        roll: null,
        ended: false,
    });

    const started = createEvent<number>();
    const rolled = createEvent();
    const moveSkipped = createEvent();
    const pieceMoved = createEvent<number>();

    $state.on(started, (state, firstPlayerId) => start(state, firstPlayerId));
    $state.on(rolled, state => roll(state, board, dices));
    $state.on(moveSkipped, skipMove);
    $state.on(pieceMoved, (state, movedPieceId) => movePiece(state, movedPieceId, board));

    return {
        $state,
        start: started,
        roll: rolled,
        skipMove: moveSkipped,
        movePiece: pieceMoved,
    };
};

const start = (state: EngineState, firstPlayerId: number): EngineState => {
    return { ...state, currentPlayerId: firstPlayerId };
};

const roll = (state: EngineState, board: Board, dices: Dice[]): EngineState => {
    const newRoll = generateRandomRoll(dices);
    const newRollSum = computeRollSum(newRoll);

    const currentPlayerId = state.currentPlayerId;
    const occupation = Array(board.cells.length).fill(null);
    state.players.forEach((player, playerId) => player.pieces.forEach(piece => {
        occupation[piece.cellId] = playerId;
    }));
    const isValidTarget = (cellId: number | null) => {
        if (cellId === null) {
            return false;
        }
        if (occupation[cellId] === currentPlayerId) {
            return false;
        }
        if (occupation[cellId] !== null && board.cells[cellId].kind === CellKind.SAFE) {
            return false;
        }
        return true;
    };
    const isMovable = (piece: Piece) => isValidTarget(followPath(board.paths[currentPlayerId], piece.cellId, newRollSum));

    return {
        ...updateMovables(state, isMovable),
        roll: newRoll,
    }
};

// TODO: move to helpers
const getRandomIndex = (size: number) => Math.floor(Math.random() * size);
export const getRandomElement = (a: Readonly<number[]>) => a[getRandomIndex(a.length)];

const generateRandomRoll = (dices: Dice[]): Roll => {
    return dices.map(dice => getRandomElement(dice.possibleValues));
};

export const computeRollSum = (roll: Roll): number => {
    return roll.reduce((a, b) => a + b, 0);
};

const followPath = (path: Path, start: number, stepCount: number): number | null => {
    const finishIndex = path.findIndex(v => v === start) + stepCount;
    return finishIndex < path.length ? path[finishIndex] : null;
};

const updateMovables = (state: EngineState, isMovable: (piece: Piece) => boolean): EngineState => {
    return {
        ...state,
        players: state.players.map((player, playerId) => ({
            ...player,
            pieces: player.pieces.map(piece => ({
                ...piece,
                movable: playerId === state.currentPlayerId && isMovable(piece),
            })),
        })),
    };
};

const skipMove = (state: EngineState): EngineState => {
    const nextPlayerId = (state.currentPlayerId + 1) % state.players.length;
    return {
        ...updateMovables(state, () => false),
        currentPlayerId: nextPlayerId,
        roll: null,
    };
};

const movePiece = (state: EngineState, movedPieceId: number, board: Board): EngineState => {
    assert(state.roll !== null);
    const rollSum = computeRollSum(state.roll);
    const players = [...state.players];
    const currentPlayerId = state.currentPlayerId;
    const currentPlayer = players[currentPlayerId];
    const movedPiece = currentPlayer.pieces[movedPieceId];
    const path = board.paths[currentPlayerId];
    const sourceCellId = movedPiece.cellId;
    const targetCellId = followPath(path, sourceCellId, rollSum);
    assert(targetCellId !== null);

    // free the target cell
    let free = false;
    for (let i = 0; i < players.length; ++i) {
        if (i === currentPlayerId) {
            continue;
        }
        for (let j = 0; j < players[i].pieces.length; ++j) {
            const piece = players[i].pieces[j];
            if (piece.cellId === targetCellId) {
                const pieces = [...players[i].pieces];
                pieces[j] = { ...pieces[j], cellId: board.paths[i][0] };
                players[i] = { ...players[i], pieces };
                free = true;
                break;
            }
        }
        if (free) {
            break;
        }
    }

    let ended = false;
    let nextPlayerId = currentPlayerId;

    // move the piece to the target cell
    const currentPlayerPieces = [...currentPlayer.pieces];
    if (board.cells[targetCellId].kind === CellKind.FINISH) {
        currentPlayerPieces.splice(movedPieceId, 1);
        ended = currentPlayerPieces.length === 0;
    } else {
        currentPlayerPieces[movedPieceId] = { ...movedPiece, cellId: targetCellId };
    }

    // decide whether it's time to change the current player
    if (!ended && ![CellKind.LUCKY, CellKind.SAFE].includes(board.cells[targetCellId].kind)) {
        nextPlayerId = (currentPlayerId + 1) % state.players.length;
    }
    players[currentPlayerId] = { ...currentPlayer, pieces: currentPlayerPieces };

    return {
        ...updateMovables({ ...state, players }, () => false),
        currentPlayerId: nextPlayerId,
        roll: ended ? state.roll : null,
        ended,
    };
};
