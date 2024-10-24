# Chat App

[Link to the site](https://chat-app-topaz-nu.vercel.app/)

A real-time chat application built using Socket.io that enables instant messaging between users. The project features:
### Core Functionality:
- Secure user authentication via CLERK
- Individual and group chat capabilities
- Real-time message delivery
- Access to a complete list of registered users

### User Features:
- Profile customization with profile pictures
- Group creation and management
- Unread message counter in chat list
- Typing indicators
- Message read receipts
- Image sharing and emoji support

### Technical Architecture:
- Socket.io implementation in a dedicated Express.js backend for real-time event handling
- MongoDB database for persistent storage of messages, user data, and chat history
- Frontend-backend communication through WebSocket events for instant updates
- Ant Design components for a clean, responsive user interface
- Real-time events include:
  - Message delivery and status updates
  - User typing notifications
  - Online/offline status changes
  - New message notifications

The application combines persistent data storage with real-time communication capabilities. While Socket.io handles immediate message delivery and status updates, MongoDB ensures all chat history and user data is properly stored and retrievable. The separate backend architecture allows for efficient handling of WebSocket connections while maintaining a clean separation of concerns.

## Backend
[Backend](https://github.com/edisonfreire/chat-app-backend)

## Key Learning Outcomes:
### Socket.io & Real-Time Architecture:
- Deep dive into WebSocket communication, understanding the fundamental difference between traditional REST APIs (request-response cycle) and event-driven Socket.io architecture where real-time data flows through event emissions and listeners
- Gained practical experience in managing real-time connections, handling disconnections, and implementing event-based communication patterns

### NextJS Features:
- Leveraged Next.js server actions for database operations, eliminating the need for a separate REST API backend for MongoDB/Firestore interactions
- Enhanced understanding of modern full-stack development patterns in Next.js

### Data Modeling & Relationships:
- Developed complex data modeling skills through interconnected entities:
  - Users linking to multiple chats and messages
  - Messages referencing both senders and chat rooms
  - Groups containing multiple users and messages
  - Read receipts tracking user interactions with messages

### Deployment & DevOps:
- Gained experience deploying and managing a separate Socket.io backend on Render
- Learned to handle environment configurations and production deployments
