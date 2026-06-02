import { CorporateAction } from "../types";
// import sql from './db'; // Uncomment for real DB

export async function getDashboardData(): Promise<CorporateAction[]> {
  /**
   * MOCK DATA FOR DEVELOPMENT
   * Comment this block and uncomment the section below to use the real database.
   */
  const mockData: CorporateAction[] = [
    {
      llmResultId: "1",
      eventType: "Dividend Declaration",
      confidence: "high",
      keyDetails:
        "The company has declared a quarterly dividend of $0.50 per share, payable on July 15, 2026, to shareholders of record as of June 30, 2026. This represents a 10% increase from the previous quarter.",
      reasoning:
        "Confirmed by official press release and board meeting minutes.",
      documentPath: "/docs/corp_actions/div_2026_01.pdf",
      sourceCreatedAt: new Date("2026-06-01T10:00:00Z"),
      topTickersWithLiquidity: [
        { ticker: "AAPL", adv: 55000000 },
        { ticker: "MSFT", adv: 22000000 },
      ],
      primaryTickerLiquidity: 55000000,
    },
    {
      llmResultId: "2",
      eventType: "Merger & Acquisition",
      confidence: "medium",
      keyDetails:
        "Acme Corp is in advanced talks to acquire Cyberdyne Systems for approximately $2.5 billion in a cash-and-stock deal. The transaction is expected to close in Q4 2026.",
      reasoning:
        "Inferred from news reports and unusual trading activity; official confirmation pending.",
      documentPath: "/docs/news/merger_rumor_772.pdf",
      sourceCreatedAt: new Date("2026-05-31T14:30:00Z"),
      topTickersWithLiquidity: [
        { ticker: "ACME", adv: 1200000 },
        { ticker: "CYB", adv: 450000 },
      ],
      primaryTickerLiquidity: 1200000,
    },
    {
      llmResultId: "3",
      eventType: "Stock Split",
      confidence: "high",
      keyDetails:
        "Board approved a 7-for-1 forward stock split to make shares more accessible to retail investors. Trading on a split-adjusted basis will begin June 10, 2026.",
      reasoning: "Directly stated in the SEC 8-K filing.",
      documentPath: "/docs/sec/8k_split_nvda.pdf",
      sourceCreatedAt: new Date("2026-05-30T09:15:00Z"),
      topTickersWithLiquidity: [{ ticker: "NVDA", adv: 48000000 }],
      primaryTickerLiquidity: 48000000,
    },
    {
      llmResultId: "4",
      eventType: "Share Buyback",
      confidence: "low",
      keyDetails:
        "Speculation about a new $10 billion share repurchase program following strong quarterly earnings and excess cash reserves.",
      reasoning:
        "Based on analyst commentary; no official company statement yet.",
      documentPath: "/docs/analyst/buyback_report.pdf",
      sourceCreatedAt: new Date("2026-05-29T16:45:00Z"),
      topTickersWithLiquidity: [{ ticker: "GOOGL", adv: 15000000 }],
      primaryTickerLiquidity: 15000000,
    },
  ];

  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockData;

  /**
   * REAL DATABASE LOGIC
   * Uncomment this section and the import at the top to use the real database.
   *
   * try {
   *   const data = await sql<CorporateAction[]>`
   *     SELECT * FROM corporate_actions_dashboard_view
   *     ORDER BY source_created_at DESC
   *   `;
   *   return data;
   * } catch (error) {
   *   console.error('Database Error:', error);
   *   throw new Error('Failed to fetch dashboard data');
   * }
   */
}
