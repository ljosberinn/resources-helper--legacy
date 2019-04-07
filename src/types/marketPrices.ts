export interface IMarketPriceState {
  [key: string]: IMarketPriceDataset;
}

export interface IMarketPriceDataset {
  ai: number;
  player: number;
}
