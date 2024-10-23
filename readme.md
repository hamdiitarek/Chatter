
# Project Documentation

## Overview
Chatter is divided into two main parts: the server-side application located in the `Server` directory and the client-side application located in the `vite-project` directory.

## Server Directory
The `Server` directory contains the backend logic of the application. Below is a detailed description of its structure:

### Directory Structure `Server/`
```
.env
controller/
    AuthController.js
    ChannelController.js
    ContactsController.js
    MessagesController.js
index.js
middleware/
    AuthMiddleware.js
models/
    ChannelModel.js
    MessagesModel.js
    UserModel.js
package.json
routes/
    AuthRoutes.js
    ...
socket.js
upload/
    files/
    ...Files and Directories
```

### Files and Directories
- **.env**: Environment variables configuration file.
- **controller/**: Contains the controllers that handle the business logic for different parts of the application.
    - **AuthController.js**: Manages authentication-related operations.
    - **ChannelController.js**: Handles operations related to channels.
    - **ContactsController.js**: Manages contact-related operations.
    - **MessagesController.js**: Handles message-related operations.
- **index.js**: The entry point of the server application.
- **middleware/**: Contains middleware functions.
    - **AuthMiddleware.js**: Middleware for handling authentication.
- **models/**: Contains the data models.
    - **ChannelModel.js**: Defines the schema and model for channels.
    - **MessagesModel.js**: Defines the schema and model for messages.
    - **UserModel.js**: Defines the schema and model for users.
- **package.json**: Contains metadata about the project and its dependencies.
- **routes/**: Contains route definitions.
    - **AuthRoutes.js**: Defines routes related to authentication.
    - `...`: Other route files.
- **socket.js**: Manages WebSocket connections.
- **upload/**: Directory for uploaded files.
    - **files/**: Subdirectory for storing uploaded files.

## Vite Project Directory `vite-project/`
```
.
├── README.md
├── components.json
├── eslint.config.js
├── index.html
├── jsconfig.json
├── package-lock.json
├── package.json
├── postcss.config.js
├── public
│   └── vite.svg
├── src
│   ├── App.css
│   ├── App.jsx
│   ├── Auth.jsx
│   ├── assets
│   │   ├── lottie-json.json
│   │   └── react.svg
│   ├── components
│   │   ├── Navbar.jsx
│   │   ├── Statistics.jsx
│   │   ├── contact-list.jsx
│   │   ├── hero.png
│   │   ├── logo.png
│   │   └── ui
│   │       ├── avatar.jsx
│   │       ├── badge.jsx
│   │       ├── button.jsx
│   │       ├── card.jsx
│   │       ├── command.jsx
│   │       ├── dialog.jsx
│   │       ├── input.jsx
│   │       ├── label.jsx
│   │       ├── multipleselect.jsx
│   │       ├── navigation-menu.jsx
│   │       ├── scroll-area.jsx
│   │       ├── sonner.jsx
│   │       └── tooltip.jsx
│   ├── context
│   │   └── SocketContext.jsx
│   ├── index.css
│   ├── lib
│   │   ├── api_client.js
│   │   └── utils.js
│   ├── main.jsx
│   ├── pages
│   │   ├── auth
│   │   │   ├── forgot.jsx
│   │   │   ├── login.jsx
│   │   │   └── signup.jsx
│   │   ├── chat
│   │   │   ├── components
│   │   │   │   ├── chat-container
│   │   │   │   │   ├── components
│   │   │   │   │   │   ├── chat-header
│   │   │   │   │   │   │   └── index.jsx
│   │   │   │   │   │   ├── message-bar
│   │   │   │   │   │   │   └── index.jsx
│   │   │   │   │   │   └── message-container
│   │   │   │   │   │       └── index.jsx
│   │   │   │   └── index.jsx
│   │   │   ├── contacts-container
│   │   │   │   ├── components
│   │   │   │   │   ├── create-channel
│   │   │   │   │   │   └── index.jsx
│   │   │   │   │   ├── new-dm
│   │   │   │   │   │   └── index.jsx
│   │   │   │   │   └── profile-info
│   │   │   │   │       └── index.jsx
│   │   │   └── empty-chat-container
│   │   │       └── index.jsx
│   │   └── index.jsx
│   │   ├── home
│   │   │   ├── Home.css
│   │   │   └── index.jsx
│   │   └── profile
│   │       └── index.jsx
│   ├── store
│   │   └── index.js
│   └── utils
│       └── constants.js
├── tailwind.config.js
└── vite.config.js
```

The `vite-project` directory contains the frontend logic of the application. Below is a detailed description of its structure:

### Files and Directories
- **.env**: Environment variables configuration file.
- **.gitignore**: Specifies files and directories to be ignored by Git.
- **components.json**: Configuration file for components.
- **eslint.config.js**: ESLint configuration file.
- **index.html**: The main HTML file for the frontend application.
- **jsconfig.json**: Configuration file for JavaScript projects.
- **package.json**: Contains metadata about the project and its dependencies.
- **postcss.config.js**: Configuration file for PostCSS.
- **public/**: Directory for static assets.
- **README.md**: Project documentation file.
- **src/**: Contains the source code for the frontend application.
- **tailwind.config.js**: Configuration file for Tailwind CSS.
- **vite.config.js**: Configuration file for Vite.

## Getting Started

### Prerequisites
- Node.js
- npm or yarn

### Installation
1. Clone the repository.
2. Navigate to the `Server` directory and run `npm install` to install server dependencies.
3. Navigate to the `vite-project` directory and run `npm install` to install frontend dependencies.

### Running the Application
1. Start the server:
    ```bash
    cd Server
    npm start
    ```
2. Start the frontend application:
    ```bash
    cd vite-project
    npm run dev
    ```

### Building the Application
To build the frontend application for production, run:
```bash
cd vite-project
npm run build
```

