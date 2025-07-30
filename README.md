# Arogya Sahayak - AI Medical Assistant

A comprehensive medical AI web application built with Next.js that provides personalized health guidance, symptom checking, diet planning, and medical exam preparation.

## Features

🧠 **AI Chat Assistant** - Get instant medical guidance powered by Kimi K2 AI
📊 **Symptom Checker** - Analyze symptoms and get preliminary health assessments  
🩺 **Medical Profile** - Complete user health profiles with medical history
📖 **Exam Preparation** - Support for NEET, UPSC, and other medical entrance exams
🔒 **Secure Authentication** - Google OAuth and email/password login
🌐 **Multilingual Support** - Available in Hindi, English, and regional Indian languages
📱 **Responsive Design** - Works seamlessly on desktop and mobile devices
📄 **PDF Export** - Download chat conversations and health reports

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: SQLite (development), PostgreSQL (production)
- **Authentication**: NextAuth.js with Google OAuth
- **AI Integration**: Kimi K2 API via OpenRouter
- **PDF Generation**: jsPDF
- **UI Components**: Headless UI, Lucide React Icons

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Google OAuth credentials (optional)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd arogya-sahayak
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```


4. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Environment Variables

Create a `.env.local` file with the following variables:

- `NEXTAUTH_URL` - Your application URL
- `NEXTAUTH_SECRET` - Secret for NextAuth.js
- `GOOGLE_CLIENT_ID` - Google OAuth client ID (optional)
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret (optional)
- `DATABASE_URL` - Database connection string
- `KIMI_API_KEY` - OpenRouter API key for Kimi K2 model

## Usage

### User Registration
- Complete medical profile during signup
- Include health metrics, allergies, medications, and medical history
- Choose dietary preferences (vegetarian/non-vegetarian/vegan)

### AI Chat Assistant
- Ask medical questions in natural language
- Get personalized responses based on your health profile
- Download chat history as PDF
- Multilingual support for regional languages

### Symptom Checker
- Select from common symptoms or add custom ones
- Specify duration and severity
- Get AI-powered analysis and recommendations
- Emergency warnings for severe symptoms

### Medical Exam Preparation
- Practice questions for NEET, UPSC, and other exams
- Get explanations and study guidance
- Track preparation progress

## Security & Privacy

- Secure password hashing with bcrypt
- JWT-based session management
- Medical data encryption
- HIPAA-compliant data handling practices
- Clear medical disclaimers throughout the app

## Medical Disclaimer

**Important**: Arogya Sahayak provides general health information and should not replace professional medical advice. Always consult with qualified healthcare providers for medical decisions and treatment plans.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please open an issue on GitHub or contact the development team.

---

**Arogya Sahayak** - Empowering health decisions with AI-powered medical assistance