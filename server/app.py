from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import numpy as np
import pandas as pd
import plotly.express as px
import plotly.utils
from datetime import datetime
import traceback
import os
from google.cloud import dialogflow_v2beta1 as dialogflow
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://127.0.0.1:3000", "http://localhost:3000", "http://127.0.0.1:5000", "http://localhost:5000"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization", "Accept"],
        "supports_credentials": True
    }
})

# Initialize Dialogflow client
try:
    DIALOGFLOW_PROJECT_ID = os.getenv('DIALOGFLOW_PROJECT_ID', 'search-456914')
    DIALOGFLOW_SESSION_ID = 'unique-session-id'
    parent = f"projects/{DIALOGFLOW_PROJECT_ID}/agent/sessions/{DIALOGFLOW_SESSION_ID}"
    
    if os.path.exists('dialogflow_credentials.json'):
        dialogflow_client = dialogflow.SessionsClient.from_service_account_json('dialogflow_credentials.json')
    else:
        print("Warning: dialogflow_credentials.json file not found")
        dialogflow_client = None
except Exception as e:
    print(f"Warning: Could not initialize Dialogflow: {e}")
    dialogflow_client = None

# Google Custom Search API credentials
GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY', 'AIzaSyCs50HLdAxaYeuvnoZbKIu4oNucqkc6jQw')
GOOGLE_CSE_ID = os.getenv('GOOGLE_CSE_ID', 'e2a2231eefded4e06')

# Load menu data (in production, this would come from a database)
MENU_DATA = {
    "items": [
        {
            "id": 1,
            "name": "Classic Burger",
            "price": 12.99,
            "ingredients": ["beef patty", "lettuce", "tomato", "cheese", "brioche bun"],
            "nutrition": {
                "calories": 650,
                "protein": 35,
                "fat": 32,
                "carbs": 45
            },
            "healthiness_score": 7.5,
            "customization_options": ["extra cheese", "bacon", "gluten-free bun"]
        },
        {
            "id": 2,
            "name": "Veggie Pizza",
            "price": 14.99,
            "ingredients": ["tomato sauce", "mozzarella", "bell peppers", "mushrooms", "olives"],
            "nutrition": {
                "calories": 550,
                "protein": 22,
                "fat": 25,
                "carbs": 65
            },
            "healthiness_score": 8.0,
            "customization_options": ["extra cheese", "whole wheat crust", "add spinach"]
        },
        {
            "id": 3,
            "name": "Grilled Chicken Salad",
            "price": 10.99,
            "ingredients": ["grilled chicken", "mixed greens", "cherry tomatoes", "cucumber", "balsamic dressing"],
            "nutrition": {
                "calories": 380,
                "protein": 32,
                "fat": 18,
                "carbs": 25
            },
            "healthiness_score": 9.5,
            "customization_options": ["extra chicken", "no dressing", "add avocado"]
        }
    ]
}

def get_dish_info(dish_name):
    """Get information about a specific dish"""
    for item in MENU_DATA["items"]:
        if item["name"].lower() == dish_name.lower():
            return item
    return None

def generate_nutrition_chart(dish_names):
    """Generate a nutrition comparison chart for specified dishes"""
    try:
        dishes = [item for item in MENU_DATA["items"] if item["name"] in dish_names]
        if not dishes:
            return None
        
        df = pd.DataFrame([{
            "name": dish["name"],
            "calories": dish["nutrition"]["calories"],
            "protein": dish["nutrition"]["protein"],
            "fat": dish["nutrition"]["fat"],
            "carbs": dish["nutrition"]["carbs"]
        } for dish in dishes])
        
        fig = px.bar(df, x="name", y=["calories", "protein", "fat", "carbs"],
                     title="Nutritional Comparison",
                     barmode="group")
        
        return json.loads(plotly.utils.PlotlyJSONEncoder().encode(fig))
    except Exception as e:
        print(f"Debug: Error generating chart: {str(e)}")
        return None

def get_main_menu():
    return {
        "type": "menu",
        "response": "Please choose an option:",
        "options": [
            "1. View our menu 🍽️",
            "2. Ask about ingredients 🥗",
            "3. Compare nutrition information 📊",
            "4. Place an order 🛒",
            "5. Ask about restaurant hours ⏰",
            "6. Make a reservation 📅",
            "7. Special dietary options 🌱",
            "8. Contact support 📞",
            "9. Ask anything else ❓"
        ]
    }

def handle_menu_option(option):
    try:
        option_num = int(option.split('.')[0])
        if option_num == 1:
            menu_items = [f"{item['name']} (${item['price']})" for item in MENU_DATA["items"]]
            return {
                "type": "text",
                "response": "Here's our menu:\n" + "\n".join(menu_items) + "\n\n" + get_numbered_response()
            }
        elif option_num == 2:
            return {
                "type": "text",
                "response": "Which dish would you like to know about? Choose a number:\n" + 
                          "\n".join([f"{i+1}. {item['name']}" for i, item in enumerate(MENU_DATA["items"])]) + 
                          "\n\n" + get_numbered_response()
            }
        elif option_num == 3:
            dish_names = [item["name"] for item in MENU_DATA["items"]]
            chart = generate_nutrition_chart(dish_names)
            if chart:
                return {
                    "type": "chart",
                    "response": "Here's the nutritional comparison of our dishes:",
                    "data": chart
                }
            return {
                "type": "text",
                "response": "Sorry, I couldn't generate the nutrition chart right now.\n\n" + get_numbered_response()
            }
        elif option_num == 4:
            return {
                "type": "order_confirmation",
                "response": "What would you like to order? Choose from our menu:\n" + 
                          "\n".join([f"{i+1}. {item['name']} (${item['price']})" for i, item in enumerate(MENU_DATA["items"])]) + 
                          "\n\n" + get_numbered_response()
            }
        elif option_num == 5:
            return {
                "type": "text",
                "response": "Our restaurant is open:\nMonday-Friday: 11:00 AM - 10:00 PM\nSaturday-Sunday: 10:00 AM - 11:00 PM\n\n" + 
                          get_numbered_response()
            }
        elif option_num == 6:
            return {
                "type": "text",
                "response": "To make a reservation, please provide:\n1. Date\n2. Time\n3. Number of people\n4. Special requests\n\n" + 
                          get_numbered_response()
            }
        elif option_num == 7:
            return {
                "type": "text",
                "response": "We offer the following dietary options:\n1. Vegetarian 🥗\n2. Vegan 🌱\n3. Gluten-Free ⭐\n4. Dairy-Free 🥛\n" + 
                          "Please specify your dietary preference when ordering.\n\n" + get_numbered_response()
            }
        elif option_num == 8:
            return {
                "type": "text",
                "response": "You can reach our support team through:\n" +
                          "1. Phone: 93737286382\n" +
                          "2. Email: platepal@restaurant.com\n" +
                          "3. Live Chat: Available 24/7\n\n" +
                          get_numbered_response()
            }
        elif option_num == 9:
            return {
                "type": "text",
                "response": "I'm here to help with anything else you might need. Please tell me more about your question.\n\n" + 
                          get_numbered_response()
            }
    except (ValueError, IndexError):
        pass
    return None

def get_numbered_response():
    return "Type a number to select an option from the menu above."

def handle_ingredient_query(query):
    # Extract dish number from query (e.g., "1", "2", "3")
    try:
        dish_index = int(query.strip()) - 1
        if 0 <= dish_index < len(MENU_DATA["items"]):
            dish = MENU_DATA["items"][dish_index]
            return {
                "type": "text",
                "response": f"{dish['name']} contains: {', '.join(dish['ingredients'])}\n\n" + get_numbered_response()
            }
    except ValueError:
        pass
    
    # If not a number, search for dish name in query
    query = query.lower()
    for item in MENU_DATA["items"]:
        if item["name"].lower() in query:
            return {
                "type": "text",
                "response": f"{item['name']} contains: {', '.join(item['ingredients'])}\n\n" + get_numbered_response()
            }
    
    return {
        "type": "text",
        "response": "I couldn't find that dish. Please choose a number from the menu:\n" + 
                   "\n".join([f"{i+1}. {item['name']}" for i, item in enumerate(MENU_DATA["items"])]) + 
                   "\n\n" + get_numbered_response()
    }

def search_google(query):
    try:
        if not GOOGLE_API_KEY or not GOOGLE_CSE_ID:
            print("Warning: Google Search API credentials not configured")
            return None

        url = "https://www.googleapis.com/customsearch/v1"
        params = {
            'key': GOOGLE_API_KEY,
            'cx': GOOGLE_CSE_ID,
            'q': query,
            'num': 1
        }
        
        print(f"Debug: Making Google Search API request for query: {query}")
        print(f"Debug: Using API Key: {GOOGLE_API_KEY[:10]}...")  # Only print first 10 chars for security
        print(f"Debug: Using CSE ID: {GOOGLE_CSE_ID}")
        
        response = requests.get(url, params=params)
        print(f"Debug: Google Search API Response Status: {response.status_code}")
        
        if response.status_code != 200:
            print(f"Error: Google Search API returned status code {response.status_code}")
            print(f"Error Response: {response.text}")
            return None
            
        results = response.json()
        print(f"Debug: Google Search API response received")
        print(f"Debug: Response keys: {list(results.keys())}")
        
        if 'items' in results and results['items']:
            answer = results['items'][0]['snippet']
            print(f"Debug: Found answer: {answer[:100]}...")  # Print first 100 chars
            return {
                "type": "text",
                "response": f"Here's what I found:\n{answer}\n\n" + get_numbered_response()
            }
        else:
            print(f"Debug: No search results found. Response: {results}")
            return None
            
    except Exception as e:
        print(f"Error in Google Search: {str(e)}")
        traceback.print_exc()  # Print full error traceback
        return None

def detect_intent_text(text):
    if not dialogflow_client:
        print("Debug: Dialogflow client not initialized, skipping intent detection")
        return None
        
    try:
        text_input = dialogflow.TextInput(text=text, language_code="en-US")
        query_input = dialogflow.QueryInput(text=text_input)
        
        print(f"Debug: Making Dialogflow API request for text: {text}")
        response = dialogflow_client.detect_intent(request={"session": parent, "query_input": query_input})
        print(f"Debug: Dialogflow API response received")
        
        if response.query_result.fulfillment_text:
            return response.query_result.fulfillment_text
        return None
        
    except Exception as e:
        print(f"Error in Dialogflow API call: {str(e)}")
        return None

@app.route("/api/chat", methods=["POST", "OPTIONS"])
def chat():
    if request.method == "OPTIONS":
        return jsonify({"status": "ok"})

    try:
        print("\nDebug: Received chat request")
        print(f"Debug: Request method: {request.method}")
        print(f"Debug: Request headers: {dict(request.headers)}")
        
        if not request.data:
            print("Debug: Empty request data")
            return jsonify(get_main_menu()), 200

        try:
            data = request.get_json()
            print(f"Debug: Parsed JSON data: {data}")
        except Exception as json_error:
            print(f"Debug: JSON parsing error: {str(json_error)}")
            return jsonify({
                "type": "error",
                "response": "Invalid JSON data received\n\n" + get_numbered_response()
            }), 400

        if not data or "message" not in data:
            print("Debug: No message field in request")
            return jsonify(get_main_menu()), 200

        user_message = data["message"].lower().strip()
        print(f"Debug: Processing user message: {user_message}")

        # Check for menu option selection
        menu_response = handle_menu_option(user_message)
        if menu_response:
            print("Debug: Returning menu response")
            return jsonify(menu_response)

        # Handle ingredient queries
        if any(item["name"].lower() in user_message for item in MENU_DATA["items"]) or user_message.isdigit():
            return jsonify(handle_ingredient_query(user_message))

        # Try Dialogflow for restaurant-specific questions
        dialogflow_response = detect_intent_text(user_message)
        if dialogflow_response:
            return jsonify({
                "type": "text",
                "response": dialogflow_response + "\n\n" + get_numbered_response()
            })

        # Try Google Search for general questions
        print("Debug: Attempting Google Search")
        google_response = search_google(user_message)
        if google_response:
            print("Debug: Returning Google Search response")
            return jsonify(google_response)

        # Default to showing the menu
        print("Debug: No specific response found, returning main menu")
        return jsonify(get_main_menu())

    except Exception as e:
        print(f"Debug: Unexpected error in chat endpoint: {str(e)}")
        print(f"Debug: Full traceback: {traceback.format_exc()}")
        return jsonify({
            "type": "error",
            "response": f"An unexpected error occurred. Please try again.\n\n" + get_numbered_response()
        }), 500

@app.route("/api/order", methods=["POST", "OPTIONS"])
def process_order():
    if request.method == "OPTIONS":
        return jsonify({"status": "ok"})

    try:
        order_data = request.get_json()
        return jsonify({
            "status": "success",
            "message": "Order received and being processed",
            "order_id": str(datetime.now().timestamp())
        })
    except Exception as e:
        print(f"Debug: Error in order endpoint: {str(e)}")
        return jsonify({
            "status": "error",
            "message": "Error processing order"
        }), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000) 