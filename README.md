# AI-Powered Collaborative Editor

A modern, AI-enhanced text editor built with Next.js, featuring real-time AI assistance, web search capabilities, and intelligent text editing tools.

## ✨ Features

### 🤖 AI-Powered Text Editing
- **Floating Toolbar**: Select any text to access AI editing options
- **Smart Suggestions**: Get AI-powered improvements for your content
- **Multiple Edit Modes**:
  - Improve text quality and flow
  - Shorten or expand content
  - Make text more professional or casual
  - General editing and enhancement

### 🤖 AI Chat Assistant
- **Interactive Sidebar**: Chat with an AI assistant while editing
- **Context-Aware**: The AI understands your selected text and document context
- **Web Search Simulation**: AI can provide information and summaries
- **Direct Integration**: AI can insert content directly into your document

### 🎨 Modern UI/UX
- **Clean Interface**: Built with Radix UI and Tailwind CSS
- **Responsive Design**: Works seamlessly across different screen sizes
- **Dark/Light Theme**: Automatic theme switching support
- **Smooth Animations**: Polished interactions and transitions

### 🛠 Technical Features
- **TipTap Editor**: Rich text editing with extensible architecture
- **Real-time Preview**: See AI suggestions before applying them
- **TypeScript**: Full type safety throughout the application
- **Modern Stack**: Next.js 15, React 19, and latest web technologies

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm, yarn, or pnpm
- Google AI API key (for Gemini integration)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd collaborative-editor
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **TipTap** - Extensible rich text editor

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Google AI SDK** - Gemini 1.5 Flash integration
- **Vercel AI SDK** - AI model integration

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 📖 Usage Guide

### Basic Editing
1. Start typing in the main editor area
2. Use standard keyboard shortcuts for formatting
3. The editor supports rich text with headings, lists, and more

### AI Text Enhancement
1. **Select any text** in the editor
2. **Floating toolbar appears** with AI options
3. **Choose an action**:
   - Edit with AI (general improvement)
   - Improve (enhance quality)
   - Shorten/Expand (adjust length)
   - Make Professional/Casual (tone adjustment)
4. **Preview the suggestion** in the modal
5. **Apply or cancel** the changes

### AI Chat Assistant
1. **Open the chat sidebar** (right panel)
2. **Ask questions** or request help
3. **Request web searches** or information
4. **Ask for content insertion** into your document
5. **Get contextual help** based on your selected text

### Example Commands
- "Search for the latest Next.js 15 features and insert a summary"
- "Find React best practices and add them to this document"
- "What are the current trends in web development?"
- "Make this paragraph more professional"
- "Shorten this section while keeping the key points"

## 🛠 API Endpoints

### `/api/chat`
Handles AI chat interactions and context-aware responses.

**Request:**
```json
{
  "messages": [
    {
      "role": "user",
      "content": "Your message here"
    }
  ],
  "selectedText": "optional selected text"
}
```

### `/api/edit`
Processes AI-powered text editing requests.

**Request:**
```json
{
  "text": "Text to edit",
  "action": "edit|improve|shorten|expand|professional|casual"
}
```

## 🛠 Customization

### Styling
The app uses Tailwind CSS with a custom design system. Key customization points:

- **Colors**: Defined in `tailwind.config.js`
- **Components**: Located in `components/ui/`
- **Global Styles**: `app/globals.css`

### Extending the Editor
TipTap is highly extensible. Add new features by:

1. Installing TipTap extensions
2. Adding them to the editor configuration in `app/page.tsx`
3. Creating custom UI components for new features

### AI Integration
To use a different AI provider:

1. Install the appropriate SDK
2. Update the API routes in `app/api/`
3. Modify the system prompts as needed

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Acknowledgments

- [TipTap](https://tiptap.dev/) for the excellent rich text editor
- [Radix UI](https://www.radix-ui.com/) for accessible components
- [Google AI](https://ai.google.dev/) for the Gemini API
- [Vercel](https://vercel.com/) for the AI SDK and deployment platform

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Join our community discussions

---

**Happy editing with AI! 🚀**
