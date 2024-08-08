import sys
import os
import pymongo
import pandas as pd
from bson import ObjectId

def fetch_data_from_mongodb(nursery_id):
    # Connect to MongoDB
    client = pymongo.MongoClient('mongodb+srv://chaudharihrishikesh30:Hrishikesh24@cluster0.zovniun.mongodb.net/GreeneryGrove?retryWrites=true&w=majority&appName=Cluster0')
    db = client['GreeneryGrove']
    collection = db['plants']

    try:
        # Convert nursery_id to ObjectId if necessary
        nursery_id = ObjectId(nursery_id)

        # Fetch data for the specified nursery ID
        data = list(collection.find({'nurseries': nursery_id}))

        # Print fetched data for debugging
        print(f"Fetched {len(data)} records from MongoDB for nursery ID {nursery_id}")
    except Exception as e:
        print(f"Error fetching data: {e}")
        data = []

    # Close the MongoDB connection
    client.close()

    return data

def export_data_to_csv(data, filename='data.csv'):
    # Convert data to DataFrame
    df = pd.DataFrame(data)

    # Remove the MongoDB ObjectId column
    if '_id' in df.columns:
        df.drop('_id', axis=1, inplace=True)

    # Export DataFrame to CSV
    df.to_csv(filename, index=False)

if __name__ == '__main__':
    if len(sys.argv) != 2:
        print("Usage: python export_to_csv.py <nursery_id>")
        sys.exit(1)

    nursery_id = sys.argv[1]
    print(f"Nursery ID: {nursery_id}")
    data = fetch_data_from_mongodb(nursery_id)
    if data:
        # Construct the path to save the file in the same directory as the script
        script_dir = os.path.dirname(os.path.abspath(__file__))
        csv_file_path = os.path.join(script_dir, 'mongodb_data.csv')
        
        export_data_to_csv(data, csv_file_path)
        print(f"Data successfully exported to {csv_file_path}")
    else:
        print("No data found or an error occurred.")
