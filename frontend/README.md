# QuizLearn Platform

A comprehensive React + TypeScript quiz learning platform with AWS Cognito authentication, supporting both user and admin workflows.

## Features

### User Features
- 🔐 **AWS Cognito Hosted UI Authentication** - Secure login without manual forms
- 📚 **Interactive Quizzes** - Take quizzes with instant feedback
- 📊 **Score Tracking** - View your quiz history and performance
- 🏆 **Leaderboards** - Compare your scores with other users
- 📈 **Progress Analytics** - Track your learning journey

### Admin Features
- 👥 **User Management** - View, edit, and manage platform users
- 📝 **Quiz CRUD** - Create, update, and delete quizzes
- ❓ **Question Management** - Build question banks for quizzes
- 📖 **Chapter Organization** - Structure content by subjects and chapters
- 📊 **Score Analytics** - View all attempts and leaderboards

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Framework**: Tailwind CSS, shadcn/ui
- **Authentication**: AWS Cognito Hosted UI
- **Routing**: React Router v6
- **State Management**: React Query (TanStack Query)
- **Forms**: React Hook Form with Zod validation

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- AWS Cognito User Pool configured with:
  - Hosted UI enabled
  - App client with implicit grant flow
  - Admin and User groups set up
  - Callback and logout URLs configured

### Installation

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd <YOUR_PROJECT_NAME>
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your AWS Cognito configuration:
   ```env
   VITE_COGNITO_DOMAIN=your-cognito-domain.auth.region.amazoncognito.com
   VITE_COGNITO_CLIENT_ID=your-client-id
   VITE_REDIRECT_URI=http://localhost:8080/callback
   VITE_LOGOUT_URI=http://localhost:8080/login
   VITE_API_BASE_URL=http://localhost:3000/api
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   
   The app will be available at `http://localhost:8080`

### AWS Cognito Setup

1. **Create User Pool**
   - Go to AWS Cognito Console
   - Create a new User Pool
   - Configure required attributes (email)

2. **Configure App Client**
   - Create an app client
   - Enable "Implicit grant" flow
   - Set callback URL: `http://localhost:8080/callback`
   - Set sign out URL: `http://localhost:8080/login`

3. **Configure Hosted UI**
   - Go to App Integration > Domain
   - Set up a Cognito domain
   - Note the domain URL

4. **Create User Groups**
   - Create "Admin" group for admin users
   - Create "User" group (optional) for regular users

5. **Add Users to Groups**
   - Create test users
   - Assign users to appropriate groups

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── Header.tsx      # App header with user info
│   ├── AdminSidebar.tsx # Admin navigation
│   └── LoadingSpinner.tsx
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication state
├── lib/               # Utility functions
│   ├── api.ts         # API client
│   └── utils.ts       # Helper functions
├── pages/             # Page components
│   ├── admin/         # Admin pages
│   │   ├── AdminDashboard.tsx
│   │   ├── AdminQuizzes.tsx
│   │   ├── AdminQuestions.tsx
│   │   ├── AdminChapters.tsx
│   │   ├── AdminScores.tsx
│   │   └── AdminUsers.tsx
│   ├── Index.tsx      # Landing page
│   ├── Login.tsx      # Login page
│   ├── Callback.tsx   # OAuth callback
│   ├── Dashboard.tsx  # User dashboard
│   ├── QuizAttempt.tsx # Quiz taking page
│   └── Scores.tsx     # User scores
└── App.tsx            # Main app with routing
```

## API Routes Coverage

### Chapters
- `GET /chapters/:subjectId` - List chapters
- `POST /chapters/:subjectId` - Create chapter (admin)
- `PUT /chapters/:subjectId/:chapterId` - Update chapter (admin)
- `DELETE /chapters/:subjectId/:chapterId` - Delete chapter (admin)

### Questions
- `GET /questions/:quizId` - List questions
- `POST /questions/:quizId` - Create question (admin)
- `PUT /questions/:quizId/:questionId` - Update question (admin)
- `DELETE /questions/:quizId/:questionId` - Delete question (admin)

### Quizzes
- `GET /quizzes` - List all quizzes
- `GET /quizzes/:id` - Get quiz details
- `POST /quizzes` - Create quiz (admin)
- `PUT /quizzes/:id` - Update quiz (admin)
- `DELETE /quizzes/:id` - Delete quiz (admin)

### Scores
- `GET /scores` - User's scores
- `POST /scores` - Submit score
- `GET /scores/all` - All scores (admin)
- `GET /scores/:quizId` - User's scores for quiz

### Users
- `GET /users` - List users (admin)
- `GET /users/:id` - Get user details (admin)
- `PUT /users/:id` - Update user (admin)
- `DELETE /users/:id` - Delete user (admin)
- `GET /profile` - Current user profile

### Admin
- `GET /admin` - Admin dashboard stats

## Authentication Flow

1. User clicks "Sign In" on login page
2. Redirects to AWS Cognito Hosted UI
3. User authenticates with Cognito
4. Cognito redirects to `/callback` with ID token
5. App decodes JWT token and checks for "Admin" group
6. Redirects to `/admin` (if admin) or `/dashboard` (if user)
7. Token stored in localStorage for API calls

## Deployment

### Production Build
```bash
npm run build
```

### Deploy to Lovable
Simply open [Lovable](https://lovable.dev/projects/b3ffd805-5f48-4e96-9476-974433038e5e) and click on Share → Publish.

### Environment Variables for Production
Update your `.env` with production URLs:
```env
VITE_REDIRECT_URI=https://yourdomain.com/callback
VITE_LOGOUT_URI=https://yourdomain.com/login
VITE_API_BASE_URL=https://api.yourdomain.com/api
```

Don't forget to update AWS Cognito callback URLs to match your production domain.

## Security Considerations

- ✅ No credentials stored in code
- ✅ JWT tokens used for API authentication
- ✅ Protected routes for authenticated users only
- ✅ Admin-only routes for privileged operations
- ✅ Token expiration checking
- ✅ Secure redirect flow with AWS Cognito

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## License

MIT License - feel free to use this project for learning and development.

## Support

For questions or issues, please open an issue on GitHub or contact the development team.
