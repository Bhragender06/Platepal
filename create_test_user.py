import requests
import json

def create_test_user():
    url = 'http://localhost:5000/api/auth/register'
    data = {
        'email': 'test@example.com',
        'password': 'test123',
        'name': 'Test User'
    }
    
    try:
        response = requests.post(url, json=data)
        print(f'Status Code: {response.status_code}')
        print(f'Response: {response.json()}')
    except Exception as e:
        print(f'Error: {str(e)}')

if __name__ == '__main__':
    create_test_user() 