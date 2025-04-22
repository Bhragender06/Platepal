console.log('Debug: Chatbot.js file loaded');

class RestaurantChatbot {
    constructor() {
        console.log('Debug: Initializing RestaurantChatbot');
        this.messageInput = document.getElementById('chatbot-input');
        this.sendButton = document.getElementById('chatbot-send');
        this.messagesContainer = document.querySelector('.chatbot-messages');
        
        if (!this.messageInput || !this.sendButton || !this.messagesContainer) {
            console.error('Debug: Required elements not found!', {
                messageInput: !!this.messageInput,
                sendButton: !!this.sendButton,
                messagesContainer: !!this.messagesContainer
            });
            return;
        }

        this.lastUserQuestion = '';
        this.showingMenu = false;
        this.apiUrl = 'http://127.0.0.1:5000/api';
        this.conversationState = {
            menuShown: false,
            lastResponse: null,
            errorCount: 0
        };

        // Show welcome message immediately
        this.showWelcomeMessage();
        console.log('Debug: RestaurantChatbot initialized successfully');
    }

    showWelcomeMessage() {
        console.log('Debug: Showing welcome message');
        if (!this.conversationState.menuShown) {
            this.addMessage('bot', 'Hello! I\'m your restaurant assistant. How can I help you today?');
            this.showMenu();
            this.conversationState.menuShown = true;
        }
    }

    showMenu() {
        console.log('Debug: Showing menu');
        if (!this.showingMenu) {
            this.addMessage('bot', '🍽️ Main Menu Options:');
            
            // Create a container for menu options
            const optionsContainer = document.createElement('div');
            optionsContainer.className = 'menu-options';
            
            // Define menu options
            const menuOptions = [
                '1. 🍴 View our menu',
                '2. 🥗 Learn about ingredients',
                '3. 📊 Compare nutrition',
                '4. 🛒 Place an order',
                '5. ⏰ Check hours',
                '6. 📞 Make a reservation',
                '7. 🥦 Dietary options',
                '8. 📞 Contact support',
                '9. ❓ Ask a question'
            ];
            
            // Create clickable options
            menuOptions.forEach(option => {
                const optionElement = document.createElement('div');
                optionElement.className = 'menu-option';
                optionElement.textContent = option;
                
                // Extract the option number from the option text
                const optionNumber = option.split('.')[0].trim();
                optionElement.addEventListener('click', () => {
                    this.messageInput.value = optionNumber;
                    this.handleUserInput();
                });
                
                optionsContainer.appendChild(optionElement);
            });
            
            this.messagesContainer.appendChild(optionsContainer);
            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
            this.showingMenu = true;
        }
    }

    async handleUserInput() {
        console.log('Debug: Handling user input');
        if (!this.messageInput) {
            console.error('Debug: Message input element not found');
            return;
        }

        const userInput = this.messageInput.value.trim();
        console.log('Debug: User input:', userInput);
        
        if (!userInput) {
            console.log('Debug: Empty input, ignoring');
            return;
        }

        // Prevent duplicate messages
        if (userInput === this.lastUserQuestion) {
            console.log('Debug: Duplicate message detected');
            this.messageInput.value = '';
            return;
        }

        this.addMessage('user', userInput);
        this.messageInput.value = '';
        this.lastUserQuestion = userInput;
        
        try {
            console.log('Debug: Sending request to API');
            this.showTypingIndicator();

            const response = await fetch(`${this.apiUrl}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    message: userInput,
                    conversationState: this.conversationState
                })
            });

            this.removeTypingIndicator();

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Debug: API Response:', data);

            // Reset error count on successful response
            this.conversationState.errorCount = 0;

            // Store last response to prevent repetition
            if (JSON.stringify(data) === JSON.stringify(this.conversationState.lastResponse)) {
                console.log('Debug: Duplicate response detected');
                return;
            }
            this.conversationState.lastResponse = data;

            switch (data.type) {
                case 'text':
                    this.addMessage('bot', data.response);
                    // If the response includes options, display them as clickable menu items
                    if (data.options && data.options.length > 0) {
                        const optionsContainer = document.createElement('div');
                        optionsContainer.className = 'menu-options';
                        
                        data.options.forEach(option => {
                            const optionElement = document.createElement('div');
                            optionElement.className = 'menu-option';
                            optionElement.textContent = option;
                            
                            // Extract the option number from the option text
                            const optionNumber = option.split('.')[0].trim();
                            optionElement.addEventListener('click', () => {
                                this.messageInput.value = optionNumber;
                                this.handleUserInput();
                            });
                            
                            optionsContainer.appendChild(optionElement);
                        });
                        
                        this.messagesContainer.appendChild(optionsContainer);
                        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
                    }
                    break;
                case 'menu':
                    if (!this.showingMenu) {
                        this.addMessage('bot', data.response);
                        if (data.options) {
                            const optionsContainer = document.createElement('div');
                            optionsContainer.className = 'menu-options';
                            
                            data.options.forEach(option => {
                                const optionElement = document.createElement('div');
                                optionElement.className = 'menu-option';
                                optionElement.textContent = option;
                                
                                // Extract the option number from the option text
                                const optionNumber = option.split('.')[0].trim();
                                optionElement.addEventListener('click', () => {
                                    this.messageInput.value = optionNumber;
                                    this.handleUserInput();
                                });
                                
                                optionsContainer.appendChild(optionElement);
                            });
                            
                            this.messagesContainer.appendChild(optionsContainer);
                            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
                        }
                        this.showingMenu = true;
                    }
                    break;
                case 'error':
                    this.addMessage('bot', 'Sorry, I encountered an error: ' + data.response);
                    break;
                case 'chart':
                    this.addMessage('bot', data.response);
                    if (data.chart_data) {
                        this.displayChart(data.chart_data);
                    }
                    break;
                case 'menu_selection':
                    this.addMessage('bot', data.response);
                    // Add clickable menu options
                    const optionsContainer = document.createElement('div');
                    optionsContainer.className = 'menu-options';
                    
                    data.options.forEach(option => {
                        const optionElement = document.createElement('div');
                        optionElement.className = 'menu-option';
                        optionElement.textContent = option;
                        
                        // Check if this is the exit option
                        if (option.toLowerCase().includes('exit') || option.toLowerCase().includes('return to main menu')) {
                            optionElement.addEventListener('click', () => {
                                this.messageInput.value = 'exit';
                                this.handleUserInput();
                            });
                        } else {
                            // Extract the dish number from the option text
                            const dishNumber = option.split('.')[0].trim();
                            optionElement.addEventListener('click', () => {
                                this.messageInput.value = dishNumber;
                                this.handleUserInput();
                            });
                        }
                        optionsContainer.appendChild(optionElement);
                    });
                    
                    this.messagesContainer.appendChild(optionsContainer);
                    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
                    break;
                default:
                    this.addMessage('bot', "I'm not sure how to handle that response. Please try again.");
            }
        } catch (error) {
            console.error('Debug: API Error:', error);
            this.removeTypingIndicator();
            
            // Increment error count
            this.conversationState.errorCount++;
            
            // Only show error message and menu if we haven't shown too many errors
            if (this.conversationState.errorCount <= 2) {
                this.addMessage('bot', 'Sorry, I encountered an error while processing your request. Please try again later.');
                if (!this.showingMenu) {
                    this.showMenu();
                }
            }
        }
    }

    showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message typing-indicator';
        typingDiv.innerHTML = '<span>.</span><span>.</span><span>.</span>';
        this.messagesContainer.appendChild(typingDiv);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    removeTypingIndicator() {
        const typingIndicator = this.messagesContainer.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    displayChart(chartData) {
        const chartContainer = document.createElement('div');
        chartContainer.className = 'chart-container';
        this.messagesContainer.appendChild(chartContainer);
        
        try {
            Plotly.newPlot(chartContainer, chartData.data, chartData.layout);
        } catch (error) {
            console.error('Debug: Chart Error:', error);
            this.addMessage('bot', 'Sorry, I couldn\'t display the chart properly.');
        }
    }

    addMessage(sender, message) {
        console.log('Debug: Adding message:', { sender, message });
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        // Check if message contains HTML
        if (message.includes('<') && message.includes('>')) {
            messageDiv.innerHTML = message;
        } else {
            messageDiv.textContent = message;
        }
        
        this.messagesContainer.appendChild(messageDiv);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
}

// Add CSS for chatbot styling
const style = document.createElement('style');
style.textContent = `
    .message {
        margin: 10px;
        padding: 10px 15px;
        border-radius: 15px;
        max-width: 80%;
    }

    .user-message {
        background-color: #ff4757;
        color: white;
        margin-left: auto;
    }

    .bot-message {
        background-color: #f1f1f1;
        color: #333;
        margin-right: auto;
        white-space: pre-wrap;
    }

    .menu-options {
        display: flex;
        flex-direction: column;
        margin-top: 10px;
        margin-bottom: 10px;
        width: 100%;
    }

    .menu-option {
        background-color: #f8f9fa;
        border: 1px solid #ddd;
        border-radius: 5px;
        padding: 10px 15px;
        margin: 5px 0;
        cursor: pointer;
        transition: all 0.2s ease;
        font-weight: 500;
    }

    .menu-option:hover {
        background-color: #e9ecef;
        transform: translateY(-2px);
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }

    .typing-indicator {
        padding: 10px;
    }

    .typing-indicator span {
        display: inline-block;
        width: 8px;
        height: 8px;
        background-color: #90949c;
        border-radius: 50%;
        margin-right: 5px;
        animation: typing 1s infinite ease-in-out;
    }

    .typing-indicator span:nth-child(2) {
        animation-delay: 0.2s;
    }

    .typing-indicator span:nth-child(3) {
        animation-delay: 0.4s;
    }

    .chart-container {
        width: 100%;
        height: 300px;
        margin: 10px 0;
    }

    @keyframes typing {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-5px); }
    }
`;

document.head.appendChild(style); 