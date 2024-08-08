import pandas as pd
from sklearn.linear_model import LinearRegression
from pymongo import MongoClient
from bson import ObjectId
import sys
import json

def analyze_sales(plant_data):
    # Connect to MongoDB
    client = MongoClient('mongodb+srv://chaudharihrishikesh30:Hrishikesh24@cluster0.zovniun.mongodb.net/GreeneryGrove?retryWrites=true&w=majority&appName=Cluster0')
    db = client['GreeneryGrove']  # Replace with your database name

    # Fetch plant details
    plant_ids = [ObjectId(plant['itemId']) for plant in plant_data]
    plants = list(db.plants.find({"_id": {"$in": plant_ids}}))

    if not plants:
        raise ValueError("No plants found for the provided IDs.")

    # Create DataFrame from plant data
    data = []
    for plant in plant_data:
        plant_details = next((p for p in plants if p['_id'] == ObjectId(plant['itemId'])), None)
        if plant_details:
            data.append({
                'plant_id': plant['itemId'],
                'quantity': plant['quantity'],
                'price': plant['price'],
                'createdAt': plant['createdAt'],
                'nursery_id': plant_details['nurseries']
            })

    # Create DataFrame from data
    df = pd.DataFrame(data)

    # Ensure createdAt is in datetime format
    df['createdAt'] = pd.to_datetime(df['createdAt'])

    # Group by plant_id and aggregate quantities sold
    plant_sales = df.groupby(['plant_id', 'createdAt']).agg({'quantity': 'sum'}).reset_index()

    # Predict future sales using Linear Regression for each plant
    future_timestamp = pd.to_datetime('now').value // 10**9
    future_timestamp_df = pd.DataFrame({'timestamp': [future_timestamp]})
    predictions = []
    
    for plant_id in plant_sales['plant_id'].unique():
        plant_df = plant_sales[plant_sales['plant_id'] == plant_id].copy()
        plant_df.loc[:, 'timestamp'] = plant_df['createdAt'].values.astype(float) // 10**9

        model = LinearRegression()
        X = plant_df[['timestamp']]
        y = plant_df['quantity']
        model.fit(X, y)

        # Predict future sales using a DataFrame with appropriate column names
        predicted_quantity = model.predict(future_timestamp_df)
        predictions.append({
            'plant_id': plant_id,
            'predicted_quantity': float(predicted_quantity[0])  # Convert to standard Python float
        })

    # Identify most sold plant in the future
    most_sold_future = max(predictions, key=lambda x: x['predicted_quantity'])

    # Identify most sold plant in the past
    past_sales = plant_sales.groupby('plant_id').agg({'quantity': 'sum'}).reset_index()
    most_sold_past = past_sales.loc[past_sales['quantity'].idxmax()]

    # Convert results to standard Python types for JSON serialization
    result = {
        "most_sold_plant_id_past": str(most_sold_past['plant_id']),
        "most_sold_quantity_past": int(most_sold_past['quantity']),
        "most_sold_plant_id_future": most_sold_future['plant_id'],
        "predicted_quantity_future": most_sold_future['predicted_quantity']
    }

    return result

if __name__ == "__main__":
    try:
        plant_data = json.loads(sys.argv[1])
        result = analyze_sales(plant_data)
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
