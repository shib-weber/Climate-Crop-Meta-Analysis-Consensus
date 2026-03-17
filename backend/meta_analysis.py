import pandas as pd

df = pd.read_csv("../data/studies.csv")

correlation = df["Temperature Change (°C)"].corr(df["Yield Impact (%)"])

print("Temperature vs Yield Impact Correlation:", correlation)