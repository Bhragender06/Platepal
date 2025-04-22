from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Define the path to the menu data file
MENU_DATA_FILE = 'menu_data.json'

# Function to load menu data from file
def load_menu_data():
    if os.path.exists(MENU_DATA_FILE):
        try:
            with open(MENU_DATA_FILE, 'r') as f:
                return json.load(f)
        except Exception as e:
            print(f"Error loading menu data: {e}")
            return get_default_menu()
    else:
        # Create default menu file if it doesn't exist
        default_menu = get_default_menu()
        save_menu_data(default_menu)
        return default_menu

# Function to save menu data to file
def save_menu_data(menu_data):
    try:
        with open(MENU_DATA_FILE, 'w') as f:
            json.dump(menu_data, f, indent=4)
        return True
    except Exception as e:
        print(f"Error saving menu data: {e}")
        return False

# Function to get default menu items
def get_default_menu():
    return {
        "1": {
            "name": "Pizza",
            "price": "$12",
            "calories": 266,
            "protein": 11,
            "carbs": 33,
            "fat": 10,
            "ingredients": ["Flour", "Tomato sauce", "Cheese", "Pepperoni", "Olives"],
            "preparation": "Baked at 450°F for 15-20 minutes",
            "category": "Main Course"
        },
        "2": {
            "name": "Burger",
            "price": "$10",
            "calories": 354,
            "protein": 20,
            "carbs": 29,
            "fat": 17,
            "ingredients": ["Beef patty", "Bun", "Lettuce", "Tomato", "Onion", "Pickles"],
            "preparation": "Grilled for 5-7 minutes on each side",
            "category": "Main Course"
        },
        "3": {
            "name": "Salad",
            "price": "$8",
            "calories": 120,
            "protein": 5,
            "carbs": 15,
            "fat": 6,
            "ingredients": ["Mixed greens", "Cherry tomatoes", "Cucumber", "Red onion", "Olive oil", "Balsamic vinegar"],
            "preparation": "Tossed with dressing and served fresh",
            "category": "Appetizer"
        },
        "4": {
            "name": "Pasta",
            "price": "$15",
            "calories": 371,
            "protein": 14,
            "carbs": 71,
            "fat": 3,
            "ingredients": ["Spaghetti", "Tomato sauce", "Garlic", "Basil", "Parmesan cheese"],
            "preparation": "Boiled for 10-12 minutes, tossed with sauce",
            "category": "Main Course"
        },
        "5": {
            "name": "Sandwich",
            "price": "$9",
            "calories": 250,
            "protein": 12,
            "carbs": 35,
            "fat": 8,
            "ingredients": ["Bread", "Turkey", "Lettuce", "Tomato", "Mayonnaise"],
            "preparation": "Assembled fresh and served with chips",
            "category": "Main Course"
        },
        "6": {
            "name": "Soup",
            "price": "$7",
            "calories": 150,
            "protein": 6,
            "carbs": 20,
            "fat": 5,
            "ingredients": ["Vegetables", "Broth", "Herbs", "Salt", "Pepper"],
            "preparation": "Simmered for 30 minutes until vegetables are tender",
            "category": "Appetizer"
        }
    }

# Load menu data at startup
MENU_ITEMS = load_menu_data()

def get_response_for_option(option_number):
    options = {
        "1": {
            'type': 'menu_selection',
            'response': '🍽️ Please select a dish number to view details or type "exit" to return to the main menu:',
            'options': [
                f"{i}. {item['name']} - {item['price']} ({item['category']})" for i, item in MENU_ITEMS.items()
            ] + ["exit. Return to main menu"]
        },
        "2": {
            'type': 'text',
            'response': '🥗 Our ingredients are fresh and locally sourced. Which dish would you like to know more about?',
            'options': [f"{i}. {item['name']}" for i, item in MENU_ITEMS.items()]
        },
        "3": {
            'type': 'text',
            'response': '📊 Please select dishes to compare (enter numbers separated by spaces, e.g., "1 2 3"):\n' + 
                       '\n'.join([f"{i}. {item['name']}" for i, item in MENU_ITEMS.items()])
        },
        "4": {
            'type': 'text',
            'response': '🛒 Great! What would you like to order? I can show you our menu if needed.'
        },
        "5": {
            'type': 'text',
            'response': '⏰ We are open:\nMon-Fri: 11am-10pm\nSat-Sun: 12pm-11pm'
        },
        "6": {
            'type': 'text',
            'response': '📞 To make a reservation, please call us at (555) 123-4567 or use our online booking system. What date and time would you prefer?'
        },
        "7": {
            'type': 'text',
            'response': '🥦 We offer various dietary options including vegetarian, vegan, gluten-free, and dairy-free dishes. What are your specific dietary requirements?'
        },
        "8": {
            'type': 'text',
            'response': '📞 You can reach our support team at support@restaurant.com or call us at (555) 123-4567. How can we assist you?'
        },
        "9": {
            'type': 'text',
            'response': '❓ Feel free to ask me anything about our restaurant. What would you like to know?'
        }
    }
    return options.get(option_number)

def compare_nutrition(selected_items):
    try:
        # Parse the selected item numbers
        item_numbers = [int(num) for num in selected_items.split()]
        
        # Get the selected items
        selected_dishes = {str(num): MENU_ITEMS[str(num)] for num in item_numbers if str(num) in MENU_ITEMS}
        
        if not selected_dishes:
            return {
                'type': 'text',
                'response': f'Please select valid menu items (1-{len(MENU_ITEMS)}) to compare.'
            }
        
        # Create a comparison table
        comparison = "Nutrition Comparison:\n\n"
        comparison += "Item      | Calories | Protein | Carbs | Fat\n"
        comparison += "-" * 40 + "\n"
        
        for num, item in selected_dishes.items():
            comparison += f"{item['name']:<9} | {item['calories']:<8} | {item['protein']:<7} | {item['carbs']:<5} | {item['fat']}\n"
        
        return {
            'type': 'text',
            'response': comparison
        }
    except Exception as e:
        return {
            'type': 'error',
            'response': f"Error comparing nutrition: {str(e)}"
        }

def get_dish_details(dish_number):
    try:
        dish = MENU_ITEMS.get(str(dish_number))
        if not dish:
            return {
                'type': 'text',
                'response': f'Dish number {dish_number} not found. Please select a valid dish number.'
            }
        
        details = f"Details for {dish['name']}:\n\n"
        details += f"Price: {dish['price']}\n"
        details += f"Category: {dish['category']}\n"
        details += f"Calories: {dish['calories']}\n"
        details += f"Protein: {dish['protein']}g\n"
        details += f"Carbs: {dish['carbs']}g\n"
        details += f"Fat: {dish['fat']}g\n\n"
        details += f"Ingredients: {', '.join(dish['ingredients'])}\n\n"
        details += f"Preparation: {dish['preparation']}"
        
        return {
            'type': 'text',
            'response': details
        }
    except Exception as e:
        return {
            'type': 'error',
            'response': f"Error getting dish details: {str(e)}"
        }

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        user_message = data.get('message', '').lower().strip()
        conversation_state = data.get('conversationState', {})
        last_response = conversation_state.get('lastResponse')
        last_response_type = conversation_state.get('lastResponseType')

        # Check if this is a nutrition comparison request
        if user_message.replace(" ", "").isdigit() and len(user_message.split()) > 1:
            return jsonify(compare_nutrition(user_message))
        
        # Check if this is a request for dish details
        if user_message.isdigit() and 1 <= int(user_message) <= len(MENU_ITEMS):
            return jsonify(get_dish_details(user_message))
        
        # Handle exit command
        if user_message == 'exit':
            return jsonify({
                'type': 'text',
                'response': '👋 Returning to main menu. How can I help you today?'
            })
        
        # Handle numeric menu selections
        if user_message.isdigit() and 1 <= int(user_message) <= 9:
            response = get_response_for_option(user_message)
            # Store the response type for future reference
            response['type'] = response.get('type', 'text')
        # Handle keyword-based queries
        elif 'menu' in user_message or 'food' in user_message:
            response = get_response_for_option("1")
            response['type'] = 'menu_selection'
        elif 'ingredient' in user_message:
            response = get_response_for_option("2")
        elif 'nutrition' in user_message or 'compare' in user_message:
            response = get_response_for_option("3")
        elif 'order' in user_message:
            response = get_response_for_option("4")
        elif 'hours' in user_message or 'time' in user_message or 'open' in user_message:
            response = get_response_for_option("5")
        elif 'reservation' in user_message or 'book' in user_message or 'table' in user_message:
            response = get_response_for_option("6")
        elif 'dietary' in user_message or 'vegan' in user_message or 'vegetarian' in user_message:
            response = get_response_for_option("7")
        elif 'support' in user_message or 'help' in user_message or 'contact' in user_message:
            response = get_response_for_option("8")
        else:
            response = {
                'type': 'text',
                'response': '👋 I can help you with our menu, hours, reservations, or any other questions. Please choose an option from the menu or ask me anything specific.'
            }

        # Check if this response is the same as the last one
        if last_response and response == last_response:
            response = {
                'type': 'text',
                'response': '❓ Is there something specific you\'d like to know? I can help you with our menu, hours, reservations, or dietary options.'
            }

        return jsonify(response)

    except Exception as e:
        return jsonify({
            'type': 'error',
            'response': str(e)
        })

# Admin route to add a new dish
@app.route('/api/admin/add_dish', methods=['POST'])
def add_dish():
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'price', 'calories', 'protein', 'carbs', 'fat', 'ingredients', 'preparation', 'category']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'success': False,
                    'message': f'Missing required field: {field}'
                }), 400
        
        # Generate a new ID (next available number)
        new_id = str(len(MENU_ITEMS) + 1)
        
        # Add the new dish to the menu
        MENU_ITEMS[new_id] = data
        
        # Save the updated menu
        if save_menu_data(MENU_ITEMS):
            return jsonify({
                'success': True,
                'message': f'Dish "{data["name"]}" added successfully with ID {new_id}',
                'dish_id': new_id
            })
        else:
            return jsonify({
                'success': False,
                'message': 'Failed to save menu data'
            }), 500
            
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error adding dish: {str(e)}'
        }), 500

# Admin route to update an existing dish
@app.route('/api/admin/update_dish/<dish_id>', methods=['PUT'])
def update_dish(dish_id):
    try:
        if dish_id not in MENU_ITEMS:
            return jsonify({
                'success': False,
                'message': f'Dish with ID {dish_id} not found'
            }), 404
        
        data = request.get_json()
        
        # Update the dish with new data
        for key, value in data.items():
            if key in MENU_ITEMS[dish_id]:
                MENU_ITEMS[dish_id][key] = value
        
        # Save the updated menu
        if save_menu_data(MENU_ITEMS):
            return jsonify({
                'success': True,
                'message': f'Dish "{MENU_ITEMS[dish_id]["name"]}" updated successfully'
            })
        else:
            return jsonify({
                'success': False,
                'message': 'Failed to save menu data'
            }), 500
            
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error updating dish: {str(e)}'
        }), 500

# Admin route to delete a dish
@app.route('/api/admin/delete_dish/<dish_id>', methods=['DELETE'])
def delete_dish(dish_id):
    try:
        if dish_id not in MENU_ITEMS:
            return jsonify({
                'success': False,
                'message': f'Dish with ID {dish_id} not found'
            }), 404
        
        dish_name = MENU_ITEMS[dish_id]['name']
        del MENU_ITEMS[dish_id]
        
        # Save the updated menu
        if save_menu_data(MENU_ITEMS):
            return jsonify({
                'success': True,
                'message': f'Dish "{dish_name}" deleted successfully'
            })
        else:
            return jsonify({
                'success': False,
                'message': 'Failed to save menu data'
            }), 500
            
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error deleting dish: {str(e)}'
        }), 500

if __name__ == '__main__':
    app.run(debug=True) 