CREATE OR REPLACE VIEW corporate_actions_dashboard_view AS
WITH ranked_tickers AS (
    SELECT 
        jt.llm_result_id,
        jt.ticker,
        l.twenty_day_avg_volume,
        ROW_NUMBER() OVER (
            PARTITION BY jt.llm_result_id 
            ORDER BY l.twenty_day_avg_volume DESC NULLS LAST
        ) as ticker_rank
    FROM llm_results_tickers jt
    LEFT JOIN liquidity_table l ON jt.ticker = l.ticker
)
SELECT 
    lr.llm_result_id,
    lr.corporate_action,
    lr.confidence,
    lr.key_details,
    
    -- Construct a clean JSON array of objects for the top 3 tickers
    (
        SELECT jsonb_agg(
            jsonb_build_object(
                'ticker', rt.ticker,
                'adv', COALESCE(rt.twenty_day_avg_volume, 0)
            ) ORDER BY rt.twenty_day_avg_volume DESC
        )
        FROM ranked_tickers rt 
        WHERE rt.llm_result_id = lr.llm_result_id AND rt.ticker_rank <= 3
    ) as top_tickers_with_liquidity,
     
    -- Keep this single numeric value for your hidden TanStack sorting engine
    COALESCE(
        (SELECT twenty_day_avg_volume 
         FROM ranked_tickers rt 
         WHERE rt.llm_result_id = lr.llm_result_id AND rt.ticker_rank = 1), 
        0
    ) as primary_ticker_liquidity

FROM llm_results lr;
