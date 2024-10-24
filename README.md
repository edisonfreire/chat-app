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
