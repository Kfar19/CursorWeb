# Birdai Landing Page - Technical Specifications

## 🚀 **Technology Stack**

### **Frontend Framework**
- **Next.js 15.4.4** - React-based full-stack framework
- **React 19.1.0** - UI library with hooks and functional components
- **TypeScript 5** - Type-safe JavaScript development

### **Styling & Design**
- **Tailwind CSS 4** - Utility-first CSS framework
- **Lucide React** - Modern icon library
- **Custom gradients** - Purple/blue theme with glass-morphism effects

### **Development Tools**
- **ESLint** - Code quality and linting
- **PostCSS** - CSS processing
- **Turbopack** - Fast bundler for development

## 📁 **Project Structure**

```
birdai/
├── src/
│   └── app/
│       ├── page.tsx          # Main landing page component
│       ├── layout.tsx        # Root layout with metadata
│       └── globals.css       # Global styles and Tailwind imports
├── public/                   # Static assets
├── package.json             # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── next.config.ts          # Next.js configuration
```

## 🎨 **Design System**

### **Color Palette**
- **Primary:** Purple/blue gradients (`from-blue-400 to-purple-400`)
- **Background:** Dark theme (`slate-900` to `purple-900`)
- **Text:** White, gray-300, gray-400
- **Accents:** Red for warnings, green for success metrics

### **Typography**
- **Font:** Geist Sans (system font fallback)
- **Headings:** 5xl-7xl for hero, 4xl-5xl for sections
- **Body:** xl-2xl for main content, lg for secondary

### **Components**
- **Responsive navbar** with mobile hamburger menu
- **Hero section** with gradient text effects
- **Feature cards** with glass-morphism styling
- **Interactive elements** with hover animations
- **Footer** with social links and navigation

## 🔧 **Key Features**

### **Responsive Design**
- **Mobile-first** approach
- **Breakpoints:** sm (640px), md (768px), lg (1024px)
- **Flexible grid system** with Tailwind CSS

### **Performance**
- **Static generation** with Next.js
- **Optimized images** and assets
- **Minimal bundle size** with tree shaking
- **Fast loading** with Turbopack

### **Accessibility**
- **Semantic HTML** structure
- **Keyboard navigation** support
- **Screen reader** friendly
- **High contrast** color scheme

## 🌐 **Deployment**

### **Hosting Platform**
- **Vercel** - Next.js optimized hosting
- **Automatic deployments** from GitHub
- **Global CDN** for fast loading
- **SSL certificates** included

### **Domain Configuration**
- **Custom domain:** birdai.xyz
- **DNS:** Vercel nameservers
- **HTTPS:** Automatic SSL/TLS

### **Version Control**
- **GitHub:** https://github.com/Kfar19/CursorWeb.git
- **Branch:** main
- **CI/CD:** Automatic deployment on push

## 📱 **Browser Support**

- **Chrome** 90+
- **Firefox** 88+
- **Safari** 14+
- **Edge** 90+
- **Mobile browsers** (iOS Safari, Chrome Mobile)

## 🛠 **Development Commands**

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## 📊 **Performance Metrics**

- **Lighthouse Score:** 90+ (Performance, Accessibility, Best Practices, SEO)
- **First Contentful Paint:** < 1.5s
- **Largest Contentful Paint:** < 2.5s
- **Cumulative Layout Shift:** < 0.1

## 🔒 **Security**

- **Content Security Policy** headers
- **HTTPS enforcement**
- **XSS protection**
- **No sensitive data** in client-side code

## 📈 **Analytics & Monitoring**

- **Vercel Analytics** (optional)
- **Error tracking** via Vercel
- **Performance monitoring** built-in

---

**Built with modern web technologies for optimal performance, accessibility, and user experience.** 