# Evaly

Online examination platform that makes creating, distributing, and analyzing tests easy and secure.

## ✨ Features

1. **AI Question Generator** - Create questions by specifying topic, difficulty, and type
2. **Flexible Exam Formats** - List or presentation views with rich media support
3. **Flexible Scheduling** - Live synchronized tests or self-paced with custom time limits
4. **AI-Powered Analytics** - Insights into performance and potential issues
5. **Comprehensive Proctoring** - Webcam, tab/window detection, and activity logging
6. **Automatic Certification** - Generate certificates upon completion
7. **Collaboration Tools** - Team creation and external examiner access

## 🚀 Tech Stack

- **Framework**: Next.js 15 with React 19
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS with Radix UI
- **State Management**: Zustand, React Query, tRPC
- **Deployment**: Vercel with Supabase
- **Runtime**: Bun
- **UI**: Radix UI primitives, TipTap editor
- **Auth**: Secure authentication with better-auth
- **AI**: OpenAI and Google AI integration

## 🛠️ Development

### Prerequisites

- Node.js
- Bun
- PostgreSQL database

### Getting Started

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/evaly.git
   cd evaly
   ```

2. Install dependencies
   ```bash
   bun install
   ```

3. Set up environment variables
   ```bash
   cp .env.example .env.local
   ```

4. Start the development server
   ```bash
   bun dev
   ```

5. Database commands
   ```bash
   bun db:generate   # Generate migration files
   bun db:migrate    # Apply migrations
   bun db:studio     # Open Drizzle Studio
   ```

## 🤝 Contributing

Contributions welcome! Fork the repo, create a feature branch, and submit a PR.

## 📝 License

MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- All the amazing open-source libraries and tools that make this project possible
- The community for their continuous support and contributions
