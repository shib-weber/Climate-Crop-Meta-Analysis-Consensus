import pandas as pd
import os

def meta_analysis():
    current_dir = os.path.dirname(os.path.abspath(__file__))

    csv_path = os.path.join(current_dir, "..", "data", "studies.csv")
    csv_path = os.path.normpath(csv_path)

    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"CSV not found at {csv_path}")

    df = pd.read_csv(csv_path)

    correlation = df["Temperature Change (°C)"].corr(df["Yield Impact (%)"])

    return {
        "message": "Temperature vs Yield Impact Correlation",
        "correlation": float(correlation)
    }