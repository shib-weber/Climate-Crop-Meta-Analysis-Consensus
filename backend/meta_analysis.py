from google.cloud import bigquery
import pandas as pd
import math

def meta_analysis():
    client = bigquery.Client()

    query = """
        SELECT 
            Year,
            `Temp_Change_C` AS temp,
            `Yield_Impact_pct` AS yield
        FROM `crop-climate.climate_data.crops`
        WHERE `Temp_Change_C` IS NOT NULL
        AND `Yield_Impact_pct` IS NOT NULL
    """

    query_job = client.query(query)
    df = query_job.to_dataframe()

    # Handle empty dataframe
    if df.empty:
        return {
            "message": "No data available",
            "correlation": 0,
            "trend": [],
            "validated": []
        }

    # Correlation
    correlation = df["temp"].corr(df["yield"])
    correlation = 0 if math.isnan(correlation) else float(correlation)

    # Trend data
    trend = []
    if "Year" in df.columns:
        trend_df = df.dropna(subset=["Year"]).groupby("Year").agg({
            "temp": "mean",
            "yield": "mean"
        }).reset_index()

        trend = trend_df.rename(columns={"Year": "year"}).to_dict(orient="records")

    return {
        "message": "Temperature vs Yield Impact Correlation",
        "correlation": correlation,
        "trend": trend,
        "validated": []  # Replace later with MySQL data
    }