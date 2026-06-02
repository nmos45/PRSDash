CREATE OR REPLACE VIEW corporate_actions_dashboard_view AS
WITH ranked_tickers AS (
    SELECT 
        lt.llm_result_id,
        lt.bpkbl_identifier,
        lm.volume_avg_20day_instrument as avg_20day_volume,
        ROW_NUMBER() OVER (
            PARTITION BY lt.llm_result_id 
            -- Push NULL volumes to the bottom so valid data always ranks 1, 2, 3
            ORDER BY lm.volume_avg_20day_instrument DESC NULLS LAST
        ) as ticker_rank
    FROM llm_result_tickers lt
    LEFT JOIN liquidity_markers lm ON lt.bpkbl_identifier = lm.bpkbl_identifier
)
SELECT 
    cr.llm_result_id,
    cr.event_type,
    cr.confidence,
    cr.key_details,
    cr.reasoning,
    lr.document_path,
    lr.source_created_at,
    
    (
        SELECT jsonb_agg(
            jsonb_build_object(
                'ticker', rt.bpkbl_identifier,
                'adv', COALESCE(rt.avg_20day_volume, 0)
            ) ORDER BY rt.avg_20day_volume DESC NULLS LAST
        )
        FROM ranked_tickers rt
        WHERE rt.llm_result_id = cr.llm_result_id 
          AND rt.ticker_rank <= 3
    ) as top_tickers_with_liquidity,
     
    COALESCE(
        (SELECT avg_20day_volume 
         FROM ranked_tickers rt 
         WHERE rt.llm_result_id = cr.llm_result_id AND rt.ticker_rank = 1), 
        0
    ) as primary_ticker_liquidity

FROM classification_results cr 
LEFT JOIN llm_results lr ON cr.llm_result_id = lr.llm_result_id;
