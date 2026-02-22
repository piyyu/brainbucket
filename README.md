# BrainBucket

BrainBucket is your personal, AI-powered second brain. It allows you to effortlessly save, organize, and interact with your links, notes, and digital content. Using advanced semantic search and AI chat capabilities, BrainBucket makes it incredibly easy to retrieve information without having to remember exact keywords.

## ✨ Features

- **Store Anything**: Save links, text snippets, and notes in your personal "buckets."
- **Semantic Search**: Find your saved content using natural language. No need to memorize exact titles or tags; BrainBucket understands the meaning behind your queries.
- **AI Chat Assistant (Ask)**: Chat directly with your saved content. Ask questions, extract summaries, or connect ideas from across your entire knowledge base.
- **Secure Authentication**: Built-in user registration and JWT-based authentication to keep your second brain private.
- **Beautiful UI**: A highly polished, responsive, and dynamic user interface with a sleek dark mode switch, built using modern web technologies.

## 🛠️ Technology Stack

### Frontend
- **React 19** & **Vite**: Ultra-fast development and optimized production builds.
- **Tailwind CSS v4**: Utility-first styling for rapid UI development.
- **Radix UI**: Unstyled, accessible React components.
- **Framer Motion**: Smooth, cinematic micro-animations and page transitions.
- **React Router**: Client-side routing for seamless navigation.
- **Axios**: HTTP client for API communication.
- **Vercel**: Deployed via Vercel for lightning-fast global delivery.

### Backend
- **Node.js** & **Express**: Robust RESTful API architecture.
- **MongoDB** & **Mongoose**: Flexible NoSQL database for storing users and content embeddings.
- **Voyage AI**: Powerful and optimized embedding models (`voyage-3.5-lite`) for indexing text.
- **Groq**: Blazing fast language model inference for the AI chat assistant.
- **Render**: Deployed via Render for reliable backend hosting.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB account (e.g., MongoDB Atlas)
- API Keys for **Voyage AI** and **Groq**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/piyyu/brainbucket.git
   cd brainbucket
   ```

2. **Setup the Backend:**
   - Navigate to the server folder:
     ```bash
     cd server
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Create a `.env` file in the `server` directory and configure the environment variables:
     ```env
     PORT=3000
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_super_secret_key
     OPENAI_API_KEY=your_voyage_api_key_here # Note: Voyage uses OpenAI's SDK client structure
     GROQ_API_KEY=your_groq_api_key
     ```
   - Start the development server:
     ```bash
     npm run dev
     ```

3. **Setup the Frontend:**
   - Open a new terminal and navigate to the client folder:
     ```bash
     cd client
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Create a `.env` file in the `client` directory:
     ```env
     VITE_BACKEND_URL=http://localhost:3000
     ```
   - Start the Vite development server:
     ```bash
     npm run dev
     ```

4. **Open in Browser:**
   Visit `http://localhost:5173` to start using your local instance of BrainBucket.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/piyyu/brainbucket/issues) if you want to contribute.

## 📄 License

This project is licensed under the [ISC License](LICENSE).
