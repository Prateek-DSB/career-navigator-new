# 🚀 AI Career Navigator

**Your Personalized 6-Month Career Roadmap Generator**

Transform career confusion into an actionable learning plan with AI-powered guidance, personalized course recommendations, and data-driven insights.

![Tech Stack](https://img.shields.io/badge/React-18-blue) ![Node.js](https://img.shields.io/badge/Node.js-Express-green) ![LangChain](https://img.shields.io/badge/LangChain-AI-purple) ![OpenAI](https://img.shields.io/badge/OpenAI-GPT4o--mini-orange)

---

## 📋 What This Does

AI Career Navigator creates personalized 6-month career roadmaps that include:

- ✅ **Skill Gap Analysis** - Visual comparison of your current vs required skills
- 📚 **6-Month Learning Roadmap** - Month-by-month plan with courses and projects
- 🎓 **Course Recommendations** - Specific courses from Coursera, Udemy, freeCodeCamp
- 💰 **Salary Insights** - Realistic expectations by city and experience level
- 🎯 **Job Search Strategy** - When to apply, networking tips, interview prep
- ✨ **Your Unique Angle** - How your background is actually an asset

---

## 🎯 Target Users

- Final year students entering the job market
- Professionals wanting to switch careers (25-35 years)
- Anyone with skill gap anxiety
- People confused about which skills employers actually want

---

## 🛠️ Tech Stack

### Frontend
- **React 18.2** - UI library
- **Vite 5.0** - Build tool
- **Tailwind CSS 3.4** - Styling
- **Recharts 2.10** - Data visualization
- **Lucide React** - Icons
- **Axios** - HTTP client

### Backend
- **Node.js + Express** - Server framework
- **LangChain.js 0.1** - AI orchestration
- **OpenAI GPT-4o-mini** - Language model
- **HNSWLib** - Vector store for RAG
- **Papa Parse** - CSV processing

---

## 📁 Project Structure

```
career-navigator/
├── client/                          # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatInterface.jsx    # Main input form
│   │   │   ├── SkillGapChart.jsx    # Skill visualization
│   │   │   ├── RoadmapTimeline.jsx  # 6-month timeline
│   │   │   ├── CourseCard.jsx       # Course display
│   │   │   ├── SalaryInsights.jsx   # Salary data
│   │   │   ├── Sidebar.jsx          # History sidebar
│   │   │   └── RoadmapDisplay.jsx   # Results container
│   │   ├── config.js                # ✏️ CUSTOMIZABLE
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── server/                          # Node.js Backend
│   ├── langchain/
│   │   ├── chains.js                # ✏️ CUSTOMIZABLE - AI prompts
│   │   ├── config.js                # ✏️ CUSTOMIZABLE - AI settings
│   │   └── vectorStore.js           # Vector database logic
│   ├── data/
│   │   ├── job_descriptions.csv     # Job requirements data
│   │   ├── course_catalog.csv       # Course database
│   │   ├── skills_database.json     # Skills taxonomy
│   │   ├── salary_data.csv          # Salary ranges
│   │   └── transition_stories.txt   # Career switch examples
│   ├── routes/
│   │   └── career.js                # API endpoints
│   ├── utils/
│   │   └── dataLoader.js            # Data utilities
│   ├── index.js                     # Server entry point
│   └── package.json
│
├── README.md
└── .env.example
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- OpenAI API key (with GPT-4o-mini access)
- 2GB free disk space

### Step 1: Clone & Install

```bash
# Clone the repository (or create the project directory)
mkdir career-navigator
cd career-navigator

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### Step 2: Configure Environment

```bash
# In the server directory, create .env file
cd server
cp .env.example .env

# Edit .env and add your OpenAI API key
OPENAI_API_KEY=sk-your-openai-api-key-here
PORT=3001
NODE_ENV=development
```

### Step 3: Start Development Servers

```bash
# Terminal 1: Start backend (from server directory)
cd server
npm run dev

# Terminal 2: Start frontend (from client directory)
cd client
npm run dev
```

### Step 4: Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001

---

## 🎨 Customization Guide

### Frontend Configuration (`client/src/config.js`)

```javascript
export const APP_CONFIG = {
  appName: "AI Career Navigator",
  apiUrl: "http://localhost:3001",
  
  features: {
    skillGapVisualization: true,
    salaryInsights: true,
    courseRecommendations: true,
    // Enable/disable features
  },
  
  examplePrompts: [
    // Add your own example prompts
  ]
};
```

### AI Configuration (`server/langchain/config.js`)

```javascript
export const AI_CONFIG = {
  model: "gpt-4o-mini",
  temperature: 0.7,        // Adjust creativity (0-1)
  maxTokens: 2500,
  
  chains: {
    roadmapGeneration: {
      temperature: 0.7,    // Customize per chain
    }
  }
};
```

### Custom AI Prompts (`server/langchain/chains.js`)

Modify the prompt templates to change:
- Tone and style of responses
- Output format and structure
- Focus areas and priorities
- Roadmap structure

---

## 📊 Data Files

### Required CSV/JSON Files

All data files are in `server/data/`:

1. **job_descriptions.csv**
   - Columns: `role, company, skills_required, experience_level, description`
   - Sample data included (25 roles)

2. **course_catalog.csv**
   - Columns: `course_name, platform, url, skills_covered, duration, price, difficulty, rating`
   - Sample data included (25 courses)

3. **skills_database.json**
   - Technical and soft skills taxonomy
   - Learning time estimates

4. **salary_data.csv**
   - Columns: `role, city, experience_level, salary_min, salary_max, currency`
   - Sample data for Indian cities

5. **transition_stories.txt**
   - Real career transition examples
   - Used for inspiration and "unique angle"

### Adding Your Own Data

Replace sample data with:
- Job descriptions from LinkedIn/Indeed
- Course catalogs from Coursera/Udemy APIs
- Salary data from Glassdoor/Payscale
- Real career transition stories

---

## 🔧 API Endpoints

### POST `/api/career/analyze`

Generate complete career roadmap.

**Request Body:**
```json
{
  "currentRole": "Marketing Manager",
  "targetRole": "Product Manager",
  "hoursPerWeek": 10,
  "location": "Bangalore",
  "additionalContext": "Optional context"
}
```

**Response:**
```json
{
  "userProfile": {...},
  "skillGapAnalysis": {...},
  "roadmap": {
    "month1": {...},
    "month2": {...},
    ...
  },
  "courses": [...],
  "salary": {...},
  "jobSearchStrategy": {...},
  "uniqueAngle": {...}
}
```

### POST `/api/career/courses`

Get course recommendations for specific skills.

### GET `/api/career/salary/:role`

Get salary data for a specific role.

### GET `/api/career/health`

Health check endpoint.

---

## 🎯 How It Works

1. **User Input**: User describes current role and target role
2. **Skill Extraction**: AI extracts skills from user input
3. **Vector Search**: Query job descriptions database for target role requirements
4. **Gap Analysis**: Compare current skills vs required skills
5. **Course Matching**: RAG search for relevant courses
6. **Roadmap Generation**: AI creates 6-month learning plan
7. **Strategy Generation**: AI generates job search and positioning advice

### AI Pipeline

```
User Input → Skill Extraction Chain
             ↓
          Vector Search (Jobs)
             ↓
          Gap Analysis Chain
             ↓
          Vector Search (Courses)
             ↓
          Roadmap Generation Chain
             ↓
          Strategy Generation Chain
             ↓
          Unique Angle Chain
             ↓
          Complete Roadmap Response
```

---

## 🎓 Features in Detail

### 1. Skill Gap Analysis
- Visual comparison of current vs required skills
- Identifies transferable skills from current role
- Calculates readiness score (0-100)
- Prioritizes skills to learn (high/medium/low)

### 2. 6-Month Roadmap
- Month-by-month breakdown
- Specific courses with links
- Portfolio projects to build
- Weekly time commitment
- Key milestones per month

### 3. Course Recommendations
- 8-12 curated courses
- Mix of free and paid options
- Appropriate for experience level
- Includes ratings and duration
- Direct links to course pages

### 4. Salary Insights
- Expected salary range
- Based on location and experience
- Data sources cited
- Negotiation tips

### 5. Job Search Strategy
- When to start applying (Month X)
- Target company types
- Networking strategy
- Interview preparation timeline
- Application approach

### 6. Your Unique Angle
- How your background is an asset
- Unique value proposition
- Elevator pitch template
- Resume positioning advice

---

## 🔒 Environment Variables

```bash
# Required
OPENAI_API_KEY=sk-...           # Your OpenAI API key

# Optional
PORT=3001                        # Server port
NODE_ENV=development             # Environment
CLIENT_URL=http://localhost:5173 # Frontend URL
AI_MODEL=gpt-4o-mini            # OpenAI model
EMBEDDING_MODEL=text-embedding-3-small
VECTOR_STORE_PATH=./vectorstore
TOP_K_RESULTS=5
```

---

## 🐛 Troubleshooting

### Vector Store Issues

If you get vector store errors on first run:
```bash
cd server
rm -rf vectorstore/
npm run dev  # Will recreate vector stores
```

### OpenAI API Errors

- Check your API key is correct in `.env`
- Ensure you have credits in your OpenAI account
- Verify you have access to GPT-4o-mini

### CORS Errors

- Ensure backend is running on port 3001
- Check `CLIENT_URL` in server `.env` matches frontend port

### Port Already in Use

```bash
# Kill process on port 3001 (backend)
lsof -ti:3001 | xargs kill -9

# Kill process on port 5173 (frontend)
lsof -ti:5173 | xargs kill -9
```

---

## 📈 Performance

- **Roadmap Generation**: 20-30 seconds
- **Vector Store Initialization**: 30-60 seconds (first run only)
- **Subsequent Requests**: 15-25 seconds

---

## 🚧 Roadmap (Future Features)

- [ ] User authentication and saved roadmaps
- [ ] Progress tracking with checkboxes
- [ ] Resume analysis and gap detection
- [ ] Job board integration
- [ ] Community features (share roadmaps)
- [ ] More data sources (GitHub, Stack Overflow)
- [ ] Mobile app
- [ ] Multi-language support

---

## 📝 License

MIT License - Feel free to use and modify!

---

## 🤝 Contributing

Contributions welcome! Areas for improvement:
- More comprehensive data files
- Additional AI chains and prompts
- UI/UX enhancements
- Performance optimizations
- Test coverage

---

## 💡 Tips for Best Results

1. **Be Specific**: "Frontend Developer at a startup" > "Web Developer"
2. **Add Context**: Mention your experience level and constraints
3. **Use Real Examples**: Look at actual job descriptions for your target role
4. **Update Data**: Replace sample data with current job/course data
5. **Customize Prompts**: Adjust AI prompts in `chains.js` for your use case

---

## 📞 Support

For issues or questions:
- Check the Troubleshooting section
- Review `server/index.js` logs for errors
- Ensure all dependencies are installed
- Verify OpenAI API key is valid

---

## 🎉 Success Stories

This tool helps people:
- Identify blind spots in their skill set
- Save months on irrelevant courses
- Build confidence for career transitions
- Get concrete, actionable next steps
- Understand realistic timelines

---

**Built with ❤️ using React, Node.js, LangChain, and OpenAI**

**Ready to navigate your career? Start the servers and visit http://localhost:5173!** 🚀