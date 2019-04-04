import { action } from 'typesafe-actions';
import { IMineState } from '../../types/mines';

export enum MineActions {
  SET_MINES = '@@factories/SET_MINES',
  SET_TECHED_MINING_RATE = '@@factories/SET_TECHED_MINING_RATE',
  SET_AMOUNT = '@@factories/SET_AMOUNT',
}

export const setMines = (mines: IMineState[]) => action(MineActions.SET_MINES, mines);

export const setTechedMiningRate = (id: number, techedRate: number) =>
  action(MineActions.SET_TECHED_MINING_RATE, { id, techedRate });

export const setMineCount = (id: number, amount: number) => action(MineActions.SET_AMOUNT, { id, amount });
