import { FactoryIDs } from './factory';

export interface IMineState {
  avgHQBoost: number;
  avgPenalty: number;
  avgQuality: number;
  avgTechFactor: number;
  avgTechedQuality: number;
  amount: number;
  readonly basePrice: MinePrices;
  readonly maxHourlyRate: MaxMineRates;
  readonly resourceID: ResourceIDs;
  sumAttacks: number;
  sumAttacksLost: number;
  sumDef1: number;
  sumDef2: number;
  sumDef3: number;
  sumRawRate: number;
  sumTechRate: number;
  readonly dependantFactories: FactoryIDs[];
}

export type ResourceIDs = 2 | 3 | 8 | 10 | 12 | 13 | 14 | 15 | 20 | 26 | 49 | 53 | 81 | 90;
export type MinePrices =
  | 1000000
  | 5000000
  | 50000000
  | 100000000
  | 600000000
  | 10000000
  | 1500000000
  | 1250000000
  | 2500000
  | 400000000
  | 1000000000
  | 200000000
  | 2000000000
  | 800000000;
export type MaxMineRates = 1530 | 542 | 510 | 306 | 306 | 382 | 2040 | 673 | 510 | 408 | 281 | 765 | 1275 | 2040;
