# DuelForge

https://duelforge.onrender.com/

## About DuelForge



DuelForge is a web application tailored for Yu-Gi-Oh! card enthusiasts. It empowers users to create, customize, and manage their own decks with an intuitive interface. Users can explore a diverse array of decks shared by the community, facilitating collaboration and inspiration among players. In addition, DuelForge offers robust event management features, allowing users to discover, participate in, and organize Yu-Gi-Oh! events. This comprehensive platform enhances the player experience by providing essential tools for both deck-building and community engagement within the Yu-Gi-Oh! ecosystem.

### Setting up the project

# DuelForge

DuelForge is a web application designed for Yu-Gi-Oh! card players. It allows users to create and manage decks, view other decks, and participate in events.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- **Node.js** (version 14 or higher)
- **Python** (version 3.7 or higher)
- **pip** (Python package installer)

## Installation Instructions

### 1. Clone the Repository

First, clone the repository to your local machine:

```bash
git clone https://github.com/yourusername/duelForge.git
cd duelForge
2. Set Up the Backend
``````
Navigate to the backend directory:
bash

```
cd backend
Create a virtual environment (optional but recommended):
bash
```
```
python -m venv venv
Activate the virtual environment:
On macOS/Linux:
bash
```
```
source venv/bin/activate
On Windows:
bash
``````
venv\Scripts\activate
Install the required Python packages:
bash

```
pip install -r requirements.txt
Run the Flask server:
bash
```
flask run
Set Up the Frontend
Open a new terminal window and navigate to the frontend directory:
bash

```
cd frontend
Install the necessary Node packages:
bash
```
npm install
Start the Vite development server:
bash
```
npm run dev
4. Access the Application
Once both servers are running, you can access the application in your web browser at:

arduino

```
http://localhost:3000

**Note:** Add any other keys and values that may be present in your local
__.env__ file. As you work to further develop your project, you may need to add
more environment variables to your local __.env__ file. Make sure you add these
environment variables to the Render GUI as well for the next deployment.
``````

## Technologies Used

### Frontend
- **React**: A JavaScript library for building user interfaces.
- **Vite**: A fast development server and build tool for modern web applications.
- **CSS**: For styling the application.
- **Redux**: For state management across the application.

### Backend
- **Flask**: A lightweight WSGI web application framework for Python.
- **SQLAlchemy**: An SQL toolkit and Object-Relational Mapping (ORM) system for Python.
- **Flask-CORS**: A Flask extension for handling Cross-Origin Resource Sharing (CORS).
- **Flask-Migrate**: A Flask extension for handling SQLAlchemy database migrations.

### Database
- **PostgreSQL**: An open-source relational database management system.

### APIs
- **Yu-Gi-Oh! API**: For accessing Yu-Gi-Oh! card data (if applicable).

### Development Tools
- **Git**: Version control system for tracking changes in the code.
- **Node.js**: JavaScript runtime for executing JavaScript code outside the browser.
- **npm**: Package manager for Node.js, used for managing frontend dependencies.

### Miscellaneous
- **dotenv**: A module to load environment variables from a `.env` file.

## To-Dos / Future Features

- **Comment CRUD**: Implement create, read, update, and delete functionality for comments on decks and events.
- **User Decks/Events View**: Allow users to view all decks and events associated with their account.
- **Messaging Feature**: Develop a messaging system for users to communicate with each other regarding decks and events.


## Technical Implementation Details

### Yu-Gi-Oh! API Integration
Integrating the Yu-Gi-Oh! API required careful consideration of their usage rules and limitations. To comply with their guidelines, I ensured that:
- **Rate Limiting**: I implemented caching strategies to minimize the number of requests sent to the API.
- **Data Storage**: Only necessary data is stored locally, ensuring that I respect the API's data usage policies.
- **Error Handling**: Robust error handling was implemented to gracefully manage API request failures.

**Code Snippet**: Below is an example of how I integrated the Yu-Gi-Oh! API to fetch card details:

```javascript
// Fetch card details from the Yu-Gi-Oh! API
const fetchCardDetails = async (cardId) => {
    try {
        const response = await fetch(`https://db.ygoprodeck.com/api/v7/cardinfo.php?id=${cardId}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const cardData = await response.json();
        return cardData;
    } catch (error) {
        console.error('Error fetching card details:', error);
    }
};
``````
Google Maps API Integration
Integrating the Google Maps API posed challenges in handling geolocation and map rendering. Key considerations included:

API Key Management: Ensuring the API key is securely managed to prevent unauthorized access.
Dynamic Rendering: Implementing dynamic rendering based on user interactions with event locations.
Code Snippet: Here’s how I implemented the Google Maps API to display event locations:

javascript

// Initialize and display Google Map
``````
const initMap = () => {
    const map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8,
    });

    const marker = new google.maps.Marker({
        position: { lat: -34.397, lng: 150.644 },
        map,
        title: "Event Location",
    });
};
``````
Drag and Drop Feature
Implementing a drag-and-drop feature for deck building required careful consideration of user experience and state management:

State Management: Ensured smooth updates to the deck state during drag-and-drop operations.
Accessibility: Made the feature accessible to all users, including keyboard navigation support.
Code Snippet: Below is an example of handling drag-and-drop events in a React component:

javascript
``````
const handleDrop = (event) => {
    event.preventDefault();
    const cardId = event.dataTransfer.getData("text/plain");
    // Update the deck state with the dropped card
    setDeck(prevDeck => [...prevDeck, cardId]);
};

const handleDragStart = (event, cardId) => {
    event.dataTransfer.setData("text/plain", cardId);
};
``````
Challenges Faced
During development, I encountered several challenges, including:

API Rate Limits: Managing request limits imposed by the Yu-Gi-Oh! API required optimizing data fetching.
User Experience: Balancing functionality and user experience, particularly for the drag-and-drop feature, took iterative design and testing.
Cross-Origin Requests: Addressing CORS issues when making requests to external APIs required proper server configuration.
