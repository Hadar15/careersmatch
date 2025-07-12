# 🚀 CareerMatch AI - Platform Pencarian Karir dengan AI

Platform AI terdepan untuk membantu profesional Indonesia menemukan karir impian mereka dengan analisis CV cerdas, tes kepribadian MBTI, dan pencocokan pekerjaan yang akurat.

## ✨ Fitur Utama

### 🤖 AI-Powered Analysis
- **Analisis CV Cerdas**: AI membaca dan memahami CV Anda secara mendalam
- **Tes Kepribadian MBTI**: Analisis kepribadian untuk mencocokkan budaya kerja
- **Smart Job Matching**: Pencocokan pekerjaan dengan akurasi tinggi

### 🎯 Platform Lengkap
- **Filter Lokasi Indonesia**: Temukan pekerjaan berdasarkan lokasi preferensi
- **Info Gaji & Kontak**: Estimasi gaji akurat dan informasi kontak langsung
- **Rekomendasi Course**: Saran kursus untuk meningkatkan skill
- **Learning Roadmap**: Rencana pembelajaran terstruktur

### 🔒 Keamanan & Privasi
- **Data Terjamin**: Enkripsi tingkat enterprise
- **Privasi Lengkap**: Kontrol penuh atas data pribadi Anda
- **Compliance**: Mengikuti standar keamanan internasional

## 🛠️ Teknologi yang Digunakan

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI Components
- **State Management**: React Hooks, Context API
- **Authentication**: Custom Auth System dengan localStorage
- **API Integration**: Remotive API (dengan fallback mock data)
- **Deployment**: Vercel, Netlify, atau GitHub Pages

## 🚀 Cara Menjalankan Project

### Prerequisites
- Node.js 18+ 
- npm atau pnpm

### Installation

1. **Clone repository**
```bash
git clone https://github.com/Hadar15/careersmatch.git
cd careersmatch
```

2. **Install dependencies**
```bash
npm install
# atau
pnpm install
```

3. **Setup environment variables**
```bash
# Buat file .env.local
NEXT_PUBLIC_REMOTIVE_API_KEY=demo-api-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Jalankan development server**
```bash
npm run dev
# atau
pnpm dev
```

5. **Buka browser**
```
http://localhost:3000
```

## 📁 Struktur Project

```
CareerMatch/
├── app/                    # Next.js App Router
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # User dashboard
│   ├── job-matching/     # Job matching features
│   ├── mbti-test/        # MBTI personality test
│   └── upload-cv/        # CV upload & analysis
├── components/            # Reusable components
│   ├── ui/               # UI components (Radix UI)
│   ├── auth-guard.tsx    # Authentication guard
│   ├── job-card.tsx      # Job card component
│   └── jobs-section.tsx  # Jobs listing section
├── lib/                   # Utility libraries
│   ├── mock-auth.tsx     # Mock authentication
│   ├── mock-data.ts      # Mock data for demo
│   ├── remotive-api.ts  # API integration
│   └── utils.ts          # Utility functions
├── hooks/                 # Custom React hooks
└── public/               # Static assets
```

## 🎯 Fitur Demo

### 🔐 Authentication
- **Login/Register**: Sistem autentikasi dengan demo credentials
- **Profile Management**: Kelola profil pengguna
- **Session Management**: Persistent login dengan localStorage

### 💼 Job Matching
- **Job Listings**: Daftar pekerjaan dari Remotive API
- **Smart Filtering**: Filter berdasarkan lokasi, skill, experience
- **Match Percentage**: Persentase kecocokan dengan profil Anda
- **Apply Directly**: Langsung apply ke lowongan

### 🧠 MBTI Personality Test
- **Interactive Test**: Tes kepribadian interaktif
- **Result Analysis**: Analisis hasil dan rekomendasi karir
- **Career Matching**: Pencocokan karir berdasarkan personality type

### 📄 CV Analysis
- **Upload CV**: Upload dan analisis CV
- **Skill Extraction**: Ekstraksi skill dari CV
- **Hidden Skills**: Identifikasi skill tersembunyi
- **Career Recommendations**: Rekomendasi karir berdasarkan CV

### 📚 Learning & Development
- **Course Recommendations**: Rekomendasi kursus berdasarkan skill gap
- **Learning Roadmap**: Roadmap pembelajaran terstruktur
- **Progress Tracking**: Tracking progress pembelajaran

## 🎨 UI/UX Features

### 🎨 Modern Design
- **Gradient Design**: Beautiful gradient color scheme
- **Responsive Layout**: Mobile-first responsive design
- **Smooth Animations**: Smooth hover and transition effects
- **Accessibility**: WCAG compliant components

### 📱 Mobile Optimized
- **Mobile Navigation**: Optimized for mobile devices
- **Touch Friendly**: Touch-friendly interface elements
- **Fast Loading**: Optimized for mobile networks

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript check
```

### Code Quality
- **ESLint**: Code linting dengan Next.js rules
- **TypeScript**: Type safety untuk semua components
- **Prettier**: Code formatting (dapat ditambahkan)

## 🚀 Deployment

### Vercel (Recommended)
1. Connect repository ke Vercel
2. Set environment variables
3. Deploy otomatis

### Netlify
1. Connect repository ke Netlify
2. Set build command: `npm run build`
3. Set publish directory: `.next`

### GitHub Pages
1. Enable GitHub Pages di repository settings
2. Set source ke GitHub Actions
3. Configure workflow untuk build dan deploy

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Contact

**CareerMatch AI** - [@Hadar15](https://github.com/Hadar15)

Project Link: [https://github.com/Hadar15/careersmatch](https://github.com/Hadar15/careersmatch)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React Framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS Framework
- [Radix UI](https://www.radix-ui.com/) - UI Components
- [Lucide React](https://lucide.dev/) - Icons
- [Remotive API](https://remotive.io/) - Job Data API

---

⭐ **Star repository ini jika project ini membantu Anda!** 