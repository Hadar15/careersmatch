# Job Matching Platform

A modern, AI-powered job matching platform built with Next.js, React, and TypeScript. This platform connects job seekers with opportunities from Remotive API, providing a seamless experience for finding remote and local job opportunities.

## 🚀 Features

### Core Features
- **Real-time Job Listings**: Integrated with Remotive API for live job data
- **Smart Job Matching**: AI-powered job recommendations based on user preferences
- **Responsive Design**: Beautiful, modern UI that works on all devices
- **User Authentication**: Secure login and registration system
- **MBTI Personality Test**: Integrated personality assessment for better job matching
- **CV Upload**: Upload and manage your resume
- **Advanced Search**: Filter jobs by location, type, and company

### Technical Features
- **Next.js 15**: Latest version with App Router
- **TypeScript**: Full type safety
- **Tailwind CSS**: Modern styling with custom components
- **Shadcn/ui**: Beautiful, accessible UI components
- **Real-time API Integration**: Live data from Remotive
- **Error Handling**: Robust fallback mechanisms
- **Performance Optimized**: Fast loading and smooth interactions

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, Shadcn/ui
- **API**: Remotive API integration
- **Authentication**: Supabase Auth
- **Deployment**: Vercel-ready

## ⚡ Quick Start for Developers

### 1. Clone the repository
```bash
git clone https://github.com/Hadar15/careersmatch.git
cd careersmatch
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Create a `.env.local` file in the root directory with the following:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```
- You can find these in your Supabase project dashboard under Project Settings > API.
- **Do not share your anon key publicly.**

### 4. Set up Supabase database
- Run the SQL in `scripts/database-setup.sql` on your Supabase project to create the required tables.
- Make sure your Supabase Auth settings allow `http://localhost:3000` as a redirect URL (for social login).

### 5. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🧩 Troubleshooting & Common Issues

| Issue                        | Symptom                          | Solution/Prevention                |
|------------------------------|----------------------------------|------------------------------------|
| Missing .env.local           | Auth/data not working            | Create `.env.local` as above        |
| Wrong Supabase schema        | Profile/CV/MBTI features break   | Run `scripts/database-setup.sql`    |
| Supabase redirect not set    | Social login fails               | Add `http://localhost:3000` in Supabase Auth settings |
| Cookies blocked              | Always logged out                | Allow cookies for `localhost`       |
| Node/npm version mismatch    | App won't start                  | Use Node.js 18+                    |
| Dependency install fails     | App won't start                  | Ensure build tools are installed    |
| API rate limits/CORS         | Job data missing                 | Use fallback/mock data or check API |
| Prod/dev differences         | Inconsistent auth/session        | Test both environments              |

### Local Development Tips
- **Restart your dev server** after changing environment variables or Supabase client code.
- **Clear cookies** for `localhost:3000` if you have auth/session issues.
- **Check browser settings**: Allow cookies and localStorage for `localhost`.
- **Check for `sb-access-token` and `sb-refresh-token` cookies** after login. If missing, Supabase auth is not persisting.
- **Check the browser console** for errors if something doesn't work.

## 🌐 Live Demo

Visit the live application: [https://careersmatch.vercel.app](https://careersmatch.vercel.app)

## 📱 Screenshots

### Homepage
- Modern landing page with job listings
- Live data from Remotive API
- Responsive design for all devices

### Job Matching
- AI-powered job recommendations
- Advanced filtering options
- Real-time job updates

### User Dashboard
- Personalized job recommendations
- Profile management
- Application tracking

## 🔧 API Integration

### Remotive API
The platform integrates with Remotive API to fetch real job data:

- **Endpoint**: `https://remotive.com/api/remote-jobs`
- **Features**: 
  - Real-time job listings
  - Search functionality
  - Job details and applications
  - Fallback to mock data if API is unavailable

### API Routes
- `/api/remotive/remote-jobs` - Proxy to Remotive API
- Handles CORS and SSL issues
- Provides fallback data when needed

## 🚀 Deployment

### Vercel Deployment
This project is optimized for Vercel deployment:

1. **Connect to GitHub**
   - Go to [Vercel](https://vercel.com)
   - Import your GitHub repository

2. **Automatic Deployment**
   - Every push to `main` branch triggers deployment
   - Preview deployments for pull requests

3. **Environment Variables**
   - Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel dashboard

### Manual Deployment
```bash
# Build the project
npm run build

# Start production server
npm start
```

## 📊 Performance

- **Lighthouse Score**: 95+ across all metrics
- **Core Web Vitals**: Optimized for best user experience
- **Loading Speed**: Fast initial load and smooth interactions
- **SEO Optimized**: Meta tags and structured data

## 🔒 Security

- **CORS Protection**: Proper CORS headers for API requests
- **Input Validation**: All user inputs are validated
- **Error Handling**: Graceful error handling without exposing sensitive data
- **HTTPS Only**: All requests use secure connections

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Remotive API** for providing job data
- **Shadcn/ui** for beautiful UI components
- **Vercel** for seamless deployment
- **Next.js Team** for the amazing framework

## 📞 Support

If you have any questions or need support:

- **GitHub Issues**: [Create an issue](https://github.com/Hadar15/careersmatch/issues)
- **Email**: Contact through GitHub profile
- **Documentation**: Check the code comments for detailed explanations

---

**Made with ❤️ by the Job Matching Platform Team** 