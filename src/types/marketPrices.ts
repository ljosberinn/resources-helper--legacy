export interface IMarketPriceState {
  [key: string]: IMarketPriceDataset;
}

interface IMarketPriceDataset {
  ai: number;
  player: number;
}
