import { combine, createEvent, sample } from "effector";
import { Bot } from "../../../bot";
import { Board, CellKind, createEngine } from "../../../engine";
import { PieceColor } from "../../piece/model";
import { GameModel, Outcome, Side } from "./types";

export * from "./types";

const BOARD: Board = {
    cells: [
        // 1st row
        { kind: CellKind.LUCKY },
        { kind: CellKind.NORMAL },
        { kind: CellKind.NORMAL },
        { kind: CellKind.NORMAL },
        { kind: CellKind.START },
        { kind: CellKind.FINISH },
        { kind: CellKind.LUCKY },
        { kind: CellKind.NORMAL },
        // 2nd row
        { kind: CellKind.NORMAL },
        { kind: CellKind.NORMAL },
        { kind: CellKind.NORMAL },
        { kind: CellKind.SAFE },
        { kind: CellKind.NORMAL },
        { kind: CellKind.NORMAL },
        { kind: CellKind.NORMAL },
        { kind: CellKind.NORMAL },
        // 3rd row
        { kind: CellKind.LUCKY },
        { kind: CellKind.NORMAL },
        { kind: CellKind.NORMAL },
        { kind: CellKind.NORMAL },
        { kind: CellKind.START },
        { kind: CellKind.FINISH },
        { kind: CellKind.LUCKY },
        { kind: CellKind.NORMAL },
    ],
    paths: [
        [20, 19, 18, 17, 16, 8, 9, 10, 11, 12, 13, 14, 15, 23, 22, 21],
        [4, 3, 2, 1, 0, 8, 9, 10, 11, 12, 13, 14, 15, 7, 6, 5],
    ],
};
const DICES = Array(4).fill({ possibleValues: [0, 0, 1, 1] });
const PIECE_COUNT = 7;

const BOARD_WIDTH = 8;
const BOARD_HEIGHT = 3;
const BOARD_SIZE = BOARD_WIDTH * BOARD_HEIGHT;

type CellState = {
    playerId: number;
    pieceId: number;
    clickable: boolean;
} | null;

export const createGameModel = (userSide: Side, opponent: Bot): GameModel => {
    // TODO: clean up this shitty logic
    const userId = userSide === Side.WHITE ? 0 : 1;
    const colorByPlayerId = userSide === Side.WHITE ? [PieceColor.WHITE, PieceColor.BLACK] : [PieceColor.BLACK, PieceColor.WHITE];
    const firstPlayerId = userSide === Side.WHITE ? 0 : 1;
    const engine = createEngine(BOARD, DICES, PIECE_COUNT, firstPlayerId);
    opponent.attach(engine, 1 - userId);
    const $cells = engine.$state.map<CellState[]>(state => {
        const result = Array(BOARD_SIZE).fill(null);
        state.players.forEach((player, playerId) => {
            player.pieces.forEach((piece, pieceId) => {
                const cellIndex = piece.cellId; // TODO
                result[cellIndex] = {
                    playerId,
                    pieceId,
                    clickable: piece.movable && (playerId === userId),
                };
            });
        });
        return result;
    });
    return {
        rollModel: {
            $state: engine.$state.map(state => state.roll),
        },
        boardModel: {
            width: BOARD_WIDTH,
            height: BOARD_HEIGHT,
        },
        cellModels: Array.from(Array(BOARD_SIZE).keys()).map(cellIndex => {
            const $cell = $cells.map(cells => cells[cellIndex]);
            const clicked = createEvent();
            sample({
                source: $cell.map(cell => cell !== null ? cell.pieceId : -1), // TODO
                clock: clicked,
                target: engine.movePiece,
            });
            return {
                kind: BOARD.cells[cellIndex].kind, // TODO
                $pieces: $cell.map(cell => cell === null ? [] : [{ color: colorByPlayerId[cell.playerId] }]),
                $clickable: $cell.map(cell => cell === null ? false : cell.clickable),
                clicked,
            };
        }),
        $rollable: engine.$state.map(state => state.currentPlayerId === userId && state.roll === null),
        $skippable: combine(engine.$state, $cells).map(([state, cells]) => state.currentPlayerId === userId && cells.findIndex(cell => cell?.clickable) === -1),
        $outcome: engine.$state.map(state => !state.ended ? Outcome.UNKNOWN : (state.currentPlayerId === userId ? Outcome.WIN : Outcome.LOSS)),
        roll: engine.roll,
        skipMove: engine.skipMove,
    };
};
