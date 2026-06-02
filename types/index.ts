export interface TickerWithLiquidity {
  ticker: string;
  adv: number;
}

export interface CorporateAction {
  llmResultId: string;
  eventType: string;
  confidence: string;
  keyDetails: string;
  reasoning: string;
  documentPath: string;
  sourceCreatedAt: Date;
  topTickersWithLiquidity: TickerWithLiquidity[];
  primaryTickerLiquidity: number;
}
