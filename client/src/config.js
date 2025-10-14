// ✏️ CUSTOMIZE THIS FILE
// Frontend configuration

export const APP_CONFIG = {
  // App Branding
  appName: "AI Career Navigator",
  tagline: "Your Personalized 6-Month Career Roadmap",
  
  // API Configuration
  apiUrl: import.meta.env.VITE_API_URL || "http://localhost:3001",
  
  // Theme Configuration
  theme: {
    mode: "light", // "light" or "dark"
    primaryColor: "blue", // tailwind color name
    accentColor: "indigo"
  },
  
  // Feature Flags
  features: {
    skillGapVisualization: true,
    salaryInsights: true,
    courseRecommendations: true,
    jobSearchStrategy: true,
    uniqueAngle: true,
    progressTracking: false, // Coming soon
    exportRoadmap: true
  },
  
  // Roadmap Configuration
  roadmap: {
    defaultMonths: 6,
    showTimeline: true,
    showProjects: true
  },
  
  // UI Configuration
  ui: {
    showWelcomeMessage: true,
    animateTransitions: true,
    compactMode: false
  },
  
  // Example Prompts (shown to users as suggestions)
  examplePrompts: [
    {
      current: "Final year Computer Science student",
      target: "Frontend Developer at a startup"
    },
    {
      current: "Marketing Manager with 5 years experience",
      target: "Product Manager in tech"
    },
    {
      current: "Mechanical Engineer",
      target: "Data Scientist"
    },
    {
      current: "Graphic Designer",
      target: "UI/UX Designer with coding skills"
    }
  ]
};

export default APP_CONFIG;