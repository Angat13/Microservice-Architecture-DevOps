from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from pymongo import MongoClient
import jwt
from bson.objectid import ObjectId

app = Flask(__name__)
CORS(app, supports_credentials=True)

# === Constants ===
SECRET = "supersecretkey"
MONGO_URI = "mongodb://host.docker.internal:27017/"

# === MongoDB Connection ===
client = MongoClient(MONGO_URI)
db = client["MicroService"]
orders_collection = db["orders"]
products_collection = db["products"]  # ✅ Added this line

# === /order: Place Order ===
@app.route('/order', methods=['POST', 'OPTIONS'])
@cross_origin(origin='http://localhost:3000', methods=['POST'], headers=['Authorization', 'Content-Type'])
def place_order():
    if request.method == 'OPTIONS':
        return '', 200

    auth_header = request.headers.get('Authorization')
    print("🔐 Header:", auth_header)

    if not auth_header or not auth_header.startswith("Bearer "):
        return jsonify({"error": "Missing or malformed token"}), 403

    try:
        token = auth_header.split(" ")[1]
        decoded = jwt.decode(token, SECRET, algorithms=["HS256"])
        print("✅ Token decoded:", decoded)
    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token expired"}), 401
    except jwt.InvalidTokenError as e:
        return jsonify({"error": "Invalid token", "details": str(e)}), 401

    data = request.json
    product = data.get("product")
    if not product:
        return jsonify({"error": "Product is required"}), 400

    order = {
        "username": decoded["username"],
        "product": product,
        "paid": False
    }
    result = orders_collection.insert_one(order)
    order["_id"] = str(result.inserted_id)

    print(f"🛒 Order added: {order}")

    return jsonify({
        "message": "Product added to cart successfully.",
        "order": order
    })

# === /pay: Process Payment ===
@app.route("/api/pay", methods=["POST"])
def pay():
    auth = request.headers.get("Authorization")
    if not auth or not auth.startswith("Bearer "):
        return jsonify({"error": "Unauthorized"}), 401

    try:
        token = auth.split(" ")[1]
        decoded = jwt.decode(token, SECRET, algorithms=["HS256"])
        username = decoded.get("username")
    except jwt.InvalidTokenError as e:
        return jsonify({"error": "Invalid Token", "details": str(e)}), 401

    data = request.json
    first_name = data.get("firstName")
    last_name = data.get("lastName")
    address = data.get("address")
    product = data.get("product")

    if not (first_name and last_name and address and product):
        return jsonify({"error": "Missing fields"}), 400

    orders_collection.insert_one({
        "username": username,
        "firstName": first_name,
        "lastName": last_name,
        "address": address,
        "product": product,
        "paid": True
    })

    return jsonify({"message": "Payment recorded."}), 200

# === /unpaid-orders: Check for unpaid orders ===
@app.route('/unpaid-orders', methods=['GET', 'OPTIONS'])
@cross_origin(origin='http://localhost:3000', methods=['GET'], headers=['Authorization', 'Content-Type'])
def unpaid_orders():
    if request.method == 'OPTIONS':
        return '', 200

    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith("Bearer "):
        return jsonify({"error": "Missing or malformed token"}), 403

    try:
        token = auth_header.split(" ")[1]
        decoded = jwt.decode(token, SECRET, algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token expired"}), 401
    except jwt.InvalidTokenError as e:
        return jsonify({"error": "Invalid token", "details": str(e)}), 401

    username = decoded["username"]
    unpaid = list(orders_collection.find({"username": username, "paid": False}))

    for o in unpaid:
        o["_id"] = str(o["_id"])

    return jsonify({"unpaidOrders": unpaid})

# === /api/health-food: Suggest Food Based on Preferences ===
@app.route("/api/health-food", methods=["POST", "OPTIONS"])
@cross_origin(origin='http://localhost:3000', methods=['POST'], headers=['Content-Type'])
def suggest_food():
    if request.method == 'OPTIONS':
        return '', 200

    data = request.json
    preferences = data.get("preferences")

    if not preferences:
        return jsonify({"error": "No preferences selected"}), 400

    # Separate category and suitability preferences
    categories = ["Veg", "Non-Veg", "Vegan"]
    selected_category = next((p for p in preferences if p in categories), None)
    suitable_tags = [p for p in preferences if p not in categories]

    query = {}
    if selected_category:
        query["category"] = selected_category
    if suitable_tags:
        query["suitableFor"] = {"$all": suitable_tags}

    results = list(products_collection.find(query, {"_id": 0}))

    if not results:
        return jsonify({"message": "Out of stock"}), 200

    return jsonify({"available": results}), 200

# === Health Check ===
@app.route('/', methods=['GET'])
def home():
    return jsonify({"message": "Python Order & Payment Service is running"})

# === Start Server ===
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002)
