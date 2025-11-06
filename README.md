# habithole

A personalized habit coaching application that helps users build new habits or break existing ones using AI-powered guidance and evidence-based frameworks.

## Features

- **Personalized Coaching**: AI-powered chatbot guides users through structured habit formation frameworks
- **Two Pathways**: Build new habits or break existing ones with tailored approaches
- **Action Plans**: Generate personalized, downloadable action plans based on your conversation
- **Evidence-Based**: Built on proven habit formation and breaking frameworks

## Tech Stack

- **Vite** - Fast build tool and dev server
- **TypeScript** - Type-safe development
- **React** - UI framework
- **shadcn-ui** - Component library
- **Tailwind CSS** - Styling
- **OpenAI API** - AI-powered coaching

## Getting Started

### Prerequisites

- Node.js & npm (or yarn) - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Installation

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at `http://localhost:8080`

### Environment Variables

Create a `.env` file in the root directory:

```
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## How It Works

1. **Form**: Users answer questions about their goal, priority, timeframe, and support system
2. **Chat**: AI coach guides users through a structured conversation following evidence-based frameworks
3. **Action Plan**: Generate and download a personalized action plan based on the conversation

## License

Private project - All rights reserved
