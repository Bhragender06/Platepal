import requests
import json

# URL for the API endpoint
API_URL = "http://127.0.0.1:5000/api/admin/add_dish"

# New dishes to add
new_dishes = [
    {
        "name": "Chicken Alfredo",
        "price": "$18",
        "calories": 430,
        "protein": 28,
        "carbs": 35,
        "fat": 22,
        "ingredients": ["Fettuccine pasta", "Chicken breast", "Heavy cream", "Parmesan cheese", "Garlic", "Butter", "Parsley"],
        "preparation": "Pasta boiled until al dente, chicken sautéed and sliced, cream sauce prepared with garlic and parmesan, combined and garnished with parsley",
        "category": "Main Course"
    },
    {
        "name": "Greek Salad",
        "price": "$10",
        "calories": 180,
        "protein": 8,
        "carbs": 12,
        "fat": 14,
        "ingredients": ["Romaine lettuce", "Cucumber", "Tomatoes", "Red onion", "Kalamata olives", "Feta cheese", "Olive oil", "Lemon juice", "Oregano"],
        "preparation": "Vegetables chopped and combined, topped with feta cheese, dressed with olive oil and lemon juice, sprinkled with oregano",
        "category": "Appetizer"
    },
    {
        "name": "Chocolate Lava Cake",
        "price": "$9",
        "calories": 380,
        "protein": 5,
        "carbs": 45,
        "fat": 20,
        "ingredients": ["Dark chocolate", "Butter", "Eggs", "Sugar", "Flour", "Vanilla extract", "Salt"],
        "preparation": "Chocolate melted with butter, batter prepared and baked until edges are set but center remains soft and molten",
        "category": "Dessert"
    },
    {
        "name": "Vegetable Stir Fry",
        "price": "$14",
        "calories": 250,
        "protein": 10,
        "carbs": 30,
        "fat": 12,
        "ingredients": ["Broccoli", "Bell peppers", "Carrots", "Snow peas", "Tofu", "Soy sauce", "Ginger", "Garlic", "Sesame oil", "Rice"],
        "preparation": "Vegetables and tofu stir-fried with ginger and garlic, seasoned with soy sauce and sesame oil, served over steamed rice",
        "category": "Main Course"
    },
    {
        "name": "Mango Smoothie",
        "price": "$6",
        "calories": 180,
        "protein": 3,
        "carbs": 40,
        "fat": 2,
        "ingredients": ["Mango", "Yogurt", "Milk", "Honey", "Ice cubes"],
        "preparation": "All ingredients blended until smooth and creamy, served chilled",
        "category": "Beverage"
    },
    {
        "name": "Beef Tacos",
        "price": "$12",
        "calories": 320,
        "protein": 18,
        "carbs": 25,
        "fat": 16,
        "ingredients": ["Corn tortillas", "Ground beef", "Lettuce", "Tomatoes", "Onions", "Cheddar cheese", "Sour cream", "Taco seasoning"],
        "preparation": "Beef cooked with taco seasoning, tortillas warmed, assembled with beef and fresh toppings",
        "category": "Main Course"
    }
]

# Function to add a dish
def add_dish(dish_data):
    try:
        response = requests.post(API_URL, json=dish_data)
        if response.status_code == 200:
            result = response.json()
            print(f"Success: {result['message']}")
            return True
        else:
            print(f"Error: {response.status_code}, {response.text}")
            return False
    except Exception as e:
        print(f"Exception occurred: {str(e)}")
        return False

# Add all the new dishes
successful = 0
for dish in new_dishes:
    if add_dish(dish):
        successful += 1

print(f"\nAdded {successful} out of {len(new_dishes)} dishes to the menu.") 