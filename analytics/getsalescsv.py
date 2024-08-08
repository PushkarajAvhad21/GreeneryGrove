import pandas as pd
from pymongo import MongoClient
from bson import ObjectId
import sys
import json

def analyze_sales(plant_data):
    # Connect to MongoDB
    client = MongoClient('mongodb+srv://chaudharihrishikesh30:Hrishikesh24@cluster0.zovniun.mongodb.net/GreeneryGrove?retryWrites=true&w=majority&appName=Cluster0')
    db = client['GreeneryGrove']

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
                'createdAt': plant['createdAt'],
                'plant_name': plant_details['name']  # Assuming plant details have 'name' field
            })

    # Create DataFrame from data
    df = pd.DataFrame(data)

    # Ensure createdAt is in datetime format and timezone-aware
    df['createdAt'] = pd.to_datetime(df['createdAt'], utc=True)

    # Filter sales for the last 30 days
    now = pd.Timestamp.now(tz='UTC')
    last_30_days = df[df['createdAt'] >= now - pd.DateOffset(days=30)]

    # Group by plant_id and plant_name, then sum quantities
    sales_last_30_days = last_30_days.groupby(['plant_id', 'plant_name']).agg({'quantity': 'sum'}).reset_index()

    # Save to CSV
    csv_path = './analytics/sales_last_30_days.csv'
    sales_last_30_days.to_csv(csv_path, index=False)

    return csv_path

if __name__ == "__main__":
    try:
        plant_data = json.loads(sys.argv[1])
        csv_path = analyze_sales(plant_data)
        print(json.dumps({"csv_path": csv_path}))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
