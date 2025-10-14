# 🧪 AI Career Navigator - Testing & Validation Guide

## Quick Start Checklist

### ✅ Initial Setup (5 minutes)

1. **Install Dependencies**
```bash
# Backend
cd server && npm install

# Frontend
cd client && npm install
```

2. **Configure Environment**
```bash
cd server
cp .env.example .env
# Add your OPENAI_API_KEY
```

3. **Start Servers**
```bash
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend  
cd client && npm run dev
```

---

## 🧪 Testing the Application

### Test Case 1: Basic Career Transition

**Input:**
- Current Role: "Marketing Manager with 5 years experience"
- Target Role: "Product Manager"
- Hours/Week: 10
- Location: Bangalore

**Expected Output:**
- ✅ Skill gap analysis with transferable skills identified
- ✅ 6-month roadmap with specific courses
- ✅ Salary range for Product Manager in Bangalore
- ✅ Job search strategy with timing
- ✅ Unique angle leveraging marketing background

**How to Test:**
1. Fill in the form with above details
2. Click "Generate My 6-Month Roadmap"
3. Wait 20-30 seconds
4. Verify all sections are populated

---

### Test Case 2: Student Entry

**Input:**
- Current Role: "Final year Computer Science student"
- Target Role: "Frontend Developer"
- Hours/Week: 15
- Location: Mumbai

**Expected Output:**
- ✅ Entry-level appropriate courses
- ✅ Focus on building portfolio projects
- ✅ Internship strategy
- ✅ Entry-level salary expectations

---

### Test Case 3: Technical to Technical

**Input:**
- Current Role: "Backend Developer"
- Target Role: "Full Stack Developer"
- Hours/Week: 8
- Location: Delhi

**Expected Output:**
- ✅ Focus on frontend skills (React, etc.)
- ✅ Recognize existing backend knowledge
- ✅ Shorter timeline due to related skills
- ✅ Higher starting salary expectations

---

## 🔍 Component Testing

### Test: Chat Interface

**What to Check:**
- [ ] Form fields accept input
- [ ] Example prompts populate fields
- [ ] Loading state shows progress
- [ ] Error messages display properly
- [ ] Form validation works

**Manual Test:**
1. Try submitting empty form (should show error)
2. Click example prompts (should populate)
3. Submit valid data (should show loading state)

---

### Test: Skill Gap Chart

**What to Check:**
- [ ] Gap score displays (0-100)
- [ ] Progress bar animates
- [ ] Current skills shown in green
- [ ] Skills needed shown in blue
- [ ] Transferable skills highlighted

**Manual Test:**
1. Generate a roadmap
2. Check "Overview" tab
3. Verify skill visualization

---

### Test: Roadmap Timeline

**What to Check:**
- [ ] All 6 months displayed
- [ ] Each month shows focus area
- [ ] Courses listed with platforms
- [ ] Projects described
- [ ] Hours/week shown
- [ ] Timeline visual connects months

**Manual Test:**
1. Go to "6-Month Plan" tab
2. Verify month-by-month breakdown
3. Check for specific course names (not generic)

---

### Test: Course Cards

**What to Check:**
- [ ] Course name displayed
- [ ] Platform shown (Coursera, Udemy, etc.)
- [ ] Skills covered listed
- [ ] Duration and price shown
- [ ] Rating displayed
- [ ] "View Course" link works

**Manual Test:**
1. Go to "Courses" tab
2. Click a course link (opens in new tab)
3. Verify details are complete

---

### Test: Salary Insights

**What to Check:**
- [ ] Salary range displayed
- [ ] Location shown
- [ ] Experience level indicated
- [ ] Data source cited
- [ ] Realistic numbers

**Manual Test:**
1. Check salary section in Overview
2. Verify numbers make sense for location/role

---

### Test: Job Strategy

**What to Check:**
- [ ] Start applying month indicated
- [ ] Target companies listed
- [ ] Networking strategy provided
- [ ] Interview prep timeline
- [ ] Specific, actionable advice

---

## 🔧 Backend API Testing

### Test: `/api/career/health`

```bash
curl http://localhost:3001/api/career/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-...",
  "service": "AI Career Navigator API"
}
```

---

### Test: `/api/career/analyze`

```bash
curl -X POST http://localhost:3001/api/career/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "currentRole": "Marketing Manager",
    "targetRole": "Product Manager",
    "hoursPerWeek": 10,
    "location": "Bangalore"
  }'
```

**Expected Response:** JSON with:
- `userProfile`
- `skillGapAnalysis`
- `roadmap` (months 1-6)
- `courses` (array)
- `salary`
- `jobSearchStrategy`
- `uniqueAngle`

---

## 🐛 Common Issues & Solutions

### Issue: "Vector store initialization failed"

**Solution:**
```bash
cd server
rm -rf vectorstore/
npm run dev  # Recreates vector stores
```

---

### Issue: "OpenAI API rate limit"

**Solution:**
- Check OpenAI dashboard for usage
- Add delay between requests
- Upgrade OpenAI plan if needed

---

### Issue: "No courses recommended"

**Cause:** Course catalog empty or vector store not initialized

**Solution:**
1. Check `server/data/course_catalog.csv` exists
2. Verify CSV has valid data
3. Reinitialize vector store

---

### Issue: "Generic responses from AI"

**Cause:** Prompts need tuning or context too vague

**Solution:**
1. Edit prompts in `server/langchain/chains.js`
2. Add more specific instructions
3. Increase context in vector search
4. Provide more detailed user input

---

## 📊 Quality Checklist

### AI Response Quality

- [ ] **Specific**: Course names, not "take a course"
- [ ] **Realistic**: "8-12 weeks", not "master in 2 days"
- [ ] **Actionable**: Concrete next steps
- [ ] **Personalized**: References user's background
- [ ] **Encouraging**: Positive but honest tone

### Data Accuracy

- [ ] Course URLs work
- [ ] Salary ranges realistic for location
- [ ] Skills match actual job requirements
- [ ] Timeline achievable given hours/week

### User Experience

- [ ] Loading states clear
- [ ] Error messages helpful
- [ ] Navigation intuitive
- [ ] Mobile responsive
- [ ] Fast load times (< 30s)

---

## 🎯 Performance Benchmarks

| Metric | Target | Typical |
|--------|--------|---------|
| Roadmap Generation | < 40s | 20-30s |
| Vector Store Init | < 2min | 30-60s |
| API Response | < 30s | 15-25s |
| Frontend Load | < 2s | < 1s |

---

## 🔐 Security Checklist

- [ ] API key not exposed in frontend
- [ ] CORS properly configured
- [ ] Input validation on backend
- [ ] No SQL injection vulnerabilities
- [ ] Rate limiting considered

---

## 📝 Test Scenarios

### Scenario 1: Complete Beginner

**User:** Never coded before, wants to be a developer

**Test:** Should recommend beginner courses, longer timeline, fundamentals focus

---

### Scenario 2: Career Pivoter

**User:** 10 years in finance, wants data science

**Test:** Should highlight transferable skills (Excel, analysis), acknowledge domain expertise

---

### Scenario 3: Limited Time

**User:** Only 5 hours/week available

**Test:** Should adjust roadmap timeline, recommend focused learning

---

### Scenario 4: Ambitious Goal

**User:** Entry-level to Senior role in 6 months

**Test:** Should set realistic expectations, explain typical timeline

---

## 🚀 Production Readiness

Before deploying to production:

- [ ] Environment variables secured
- [ ] Error logging implemented
- [ ] Rate limiting added
- [ ] Data regularly updated
- [ ] Monitoring setup
- [ ] Backup strategy
- [ ] Documentation complete
- [ ] Load testing performed

---

## 📈 Success Metrics

Track these metrics post-deployment:

- **User Engagement**: % who complete form
- **Roadmap Quality**: User ratings/feedback
- **Course Click-through**: % who click course links
- **API Performance**: Average response time
- **Error Rate**: % of failed requests

---

## 🎓 Advanced Testing

### Load Testing

```bash
# Install Apache Bench
sudo apt-get install apache2-utils

# Test 100 requests, 10 concurrent
ab -n 100 -c 10 -p test-data.json -T application/json \
  http://localhost:3001/api/career/analyze
```

### Vector Store Testing

```javascript
// Test similarity search quality
const results = await searchJobs("Frontend Developer", 5);
console.log("Relevance scores:", results.map(r => r.score));
```

---

## ✅ Pre-Launch Checklist

- [ ] All test cases pass
- [ ] No console errors
- [ ] Data files up-to-date
- [ ] API key secured
- [ ] README complete
- [ ] Code commented
- [ ] Git repo clean
- [ ] Demo video recorded

---

**Happy Testing! 🎉**

If you find bugs or have suggestions, document them and iterate on the prompts and data!