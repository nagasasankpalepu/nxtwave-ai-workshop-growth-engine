import React, { useState } from 'react';
import RegistrationForm from '../components/RegistrationForm';
import ReferralShareCard from '../components/ReferralShareCard';
import {
  Sparkles,
  Clock,
  Code2,
  Briefcase,
  CheckCircle2,
  ChevronDown,
  HelpCircle,
  Laptop,
  Terminal,
  Calendar,
  ArrowRight,
  Cpu,
  Play,
  FileCode,
  GitBranch,
  ShieldCheck,
  Check,
  ArrowDown,
  FileText,
  Award,
  Sliders,
  AlertCircle
} from 'lucide-react';

const CANDIDATE_PRESETS = [
  {
    id: 'cse',
    name: 'Final-Year CSE (Full-Stack & React)',
    role: 'Junior Full-Stack / AI Engineer',
    snippet: 'Final-Year B.Tech CSE. Experience building full-stack web apps using React, Node.js, Express, and MongoDB. Built college placement portal and worked with REST APIs. Familiar with Python and Git.',
    score: 88,
    stackMatch: 92,
    impactScore: 76,
    deploymentScore: 94,
    suggestions: [
      'Quantify placement portal outcomes: state volume (1,200 students) and 40% latency reduction with caching.',
      'Explicitly highlight practical AI architecture: note integration with LLM APIs, secure key proxies, and JSON schema parsing.',
      'Include clickable GitHub link with automated test suite and live web deployment.'
    ]
  },
  {
    id: 'it',
    name: 'Pre-Final IT (Backend & APIs)',
    role: 'Backend & Cloud AI Developer',
    snippet: '3rd Year Information Technology. Strong in Java, Python, and SQL databases. Developed automated data ingestion pipelines and microservices. Built Telegram automation bots.',
    score: 84,
    stackMatch: 86,
    impactScore: 80,
    deploymentScore: 86,
    suggestions: [
      'Highlight token security: mention environment variable isolation and rate-limiting middleware.',
      'Detail streaming API response handling in real-time UI.',
      'Add system architecture diagram in project repository README.'
    ]
  },
  {
    id: 'ece',
    name: 'ECE Student (Python & Automation)',
    role: 'AI Solutions & Automation Engineer',
    snippet: 'Final Year ECE student passionate about AI. Built sensor data logging tool with Python and Flask. Interested in generative AI applications and computer vision.',
    score: 81,
    stackMatch: 85,
    impactScore: 72,
    deploymentScore: 86,
    suggestions: [
      'Emphasize end-to-end full-stack integration connecting Python backend with interactive React client.',
      'Showcase deployment on free cloud platforms (Render/Vercel) with public URL.',
      'Structure GitHub repo with clean modular code and setup instructions.'
    ]
  }
];

export default function LandingPage({ onExploreDashboard }) {
  const [registeredStudent, setRegisteredStudent] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);
  const [activeProjectTab, setActiveProjectTab] = useState('demo'); // 'demo', 'code', 'resume'
  
  // AI Resume Analyzer Simulation State
  const [selectedPresetId, setSelectedPresetId] = useState('cse');
  const [targetRole, setTargetRole] = useState(CANDIDATE_PRESETS[0].role);
  const [resumeSnippet, setResumeSnippet] = useState(CANDIDATE_PRESETS[0].snippet);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(CANDIDATE_PRESETS[0]);

  function handleSelectPreset(preset) {
    setSelectedPresetId(preset.id);
    setTargetRole(preset.role);
    setResumeSnippet(preset.snippet);
    setAnalysisResult(preset);
  }

  function handleAnalyzeResume() {
    setIsAnalyzing(true);
    setTimeout(() => {
      // Find matching or calculate variation
      const current = CANDIDATE_PRESETS.find(p => p.id === selectedPresetId) || CANDIDATE_PRESETS[0];
      setAnalysisResult({
        ...current,
        role: targetRole,
        snippet: resumeSnippet
      });
      setIsAnalyzing(false);
    }, 600);
  }

  function scrollToRegistration() {
    const el = document.getElementById('registration-card-anchor');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  function scrollToAgenda() {
    const el = document.getElementById('agenda-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  const faqs = [
    {
      q: 'Is this workshop completely free?',
      a: 'Yes, 100% free of charge. There are no registration fees, no hidden course upsells, and no credit card required. The goal is to provide engineering students with a practical, hands-on project experience to boost placement readiness.'
    },
    {
      q: 'Do I need prior experience in AI or Machine Learning?',
      a: 'No prior AI/ML experience is required. If you know basic programming fundamentals (variables, functions, API calls), you will be able to follow along comfortably. We explain the architecture step-by-step from scratch.'
    },
    {
      q: 'What will I build during the 60 minutes?',
      a: 'You will build an interactive AI application from a clean directory to live code using modern AI APIs. You will test the project, manage environment keys securely, and initialize a clean GitHub repository that you can showcase on your resume.'
    },
    {
      q: 'How does this project support internships and campus placements?',
      a: 'Recruiters and hiring managers see dozens of identical academic mini-projects. A functioning AI project with real API integration and clean repository documentation provides tangible proof-of-work during technical interview rounds.'
    },
    {
      q: 'What software or tools do I need on my laptop?',
      a: 'A computer with internet access and a web browser. We will share a cloud coding environment link (and local setup instructions) so you can write and execute code immediately without painful local dependency installations.'
    },
    {
      q: 'How does the student referral and ambassador program work?',
      a: 'When you register, you receive a unique referral link. When your classmates register through your link, your referral count increases. Active student ambassadors receive growth leadership recognition and priority project review access!'
    }
  ];

  return (
    <div className="space-y-20 pb-20 overflow-x-hidden">
      
      {/* 1. HERO AND REGISTRATION SECTION */}
      <section id="overview" className="pt-6 sm:pt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            
            {/* Left Column: Hero Copy */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              {/* Small Category Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-[11px] font-bold tracking-wider uppercase border border-slate-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>FREE LIVE AI WORKSHOP</span>
              </div>

              {/* Strong Headline with Restrained Accent */}
              <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
                Build Your First{' '}
                <span className="text-indigo-600">
                  AI Project
                </span>{' '}
                in 60 Minutes
              </h1>

              {/* Concise Supporting Text */}
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
                Step beyond theoretical slides. Learn by building a practical, beginner-friendly AI project from scratch. Designed for final-year engineering students preparing for internships and campus placement interviews.
              </p>

              {/* Three Short Benefit Indicators */}
              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-semibold text-slate-700">
                <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Beginner-friendly</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Hands-on building</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Free to attend</span>
                </div>
              </div>

              {/* Primary & Secondary CTAs */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={scrollToRegistration}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-1.5 active:scale-[0.99] cursor-pointer"
                >
                  <span>Reserve Free Seat</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={scrollToAgenda}
                  className="bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Explore Agenda</span>
                  <ArrowDown className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>

              {/* Configurable Placeholders Notice */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-xs flex items-start gap-2.5 max-w-xl">
                <Calendar className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-bold text-slate-800">Workshop Details (Configurable Placeholders):</span>
                  <p className="text-slate-500 text-[11px] mt-0.5 leading-normal">
                    Schedule: [Upcoming Weekend Cohort • 11:00 AM IST] • Meeting link will be shared with registered students via email. Mentors: [Senior AI & Full-Stack Engineers].
                  </p>
                </div>
              </div>

            </div>

            {/* Right Column: Compact Registration Card */}
            <div className="lg:col-span-5 w-full" id="registration-card-anchor">
              {registeredStudent ? (
                <ReferralShareCard
                  registration={registeredStudent}
                  onExploreDashboard={onExploreDashboard}
                />
              ) : (
                <RegistrationForm
                  onSuccess={(data) => setRegisteredStudent(data)}
                />
              )}
            </div>

          </div>
        </div>
      </section>

      {/* 2. WHAT STUDENTS WILL BUILD */}
      <section id="project-preview" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-10 border border-slate-800 shadow-xl overflow-hidden">
          
          <div className="max-w-3xl mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-700/50 text-[#818CF8] text-[11px] font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Interactive Workshop Project Preview</span>
            </div>
            <h3 className="text-xl sm:text-3xl font-black text-white tracking-tight">
              What You Will Build: AI Resume Analyzer & Interview Matcher
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
              In 60 minutes, you will build an interactive full-stack AI web application that takes candidate profile inputs, calls generative LLM endpoints via a secure backend proxy, and renders real-time ATS match scores and architectural suggestions.
            </p>
          </div>

          {/* Mandatory Disclaimers & Illustration Notice */}
          <div className="mb-6 p-3 rounded-xl bg-indigo-900/30 border border-indigo-500/30 text-indigo-200 text-xs flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping flex-shrink-0" />
              <span className="font-bold text-white text-[11px] tracking-wide uppercase">
                Sample Project Preview (Illustration Only — Not a Real Student Result)
              </span>
            </div>
            <span className="text-[11px] text-indigo-300">
              Interactive demonstration of the project built during the 60-min session.
            </span>
          </div>

          {/* Clean Code Window Shell */}
          <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-2xl">
            
            {/* Window Header */}
            <div className="bg-slate-900/90 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                <span className="ml-2 font-mono text-[11px] text-slate-400">ai-resume-matcher/workspace.jsx</span>
              </div>

              <div className="flex items-center gap-1 text-xs">
                <button
                  onClick={() => setActiveProjectTab('demo')}
                  className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                    activeProjectTab === 'demo' ? 'bg-indigo-600 text-white font-bold shadow-xs' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Interactive App Demo
                </button>
                <button
                  onClick={() => setActiveProjectTab('code')}
                  className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                    activeProjectTab === 'code' ? 'bg-indigo-600 text-white font-bold shadow-xs' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  API Architecture
                </button>
                <button
                  onClick={() => setActiveProjectTab('resume')}
                  className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                    activeProjectTab === 'resume' ? 'bg-indigo-600 text-white font-bold shadow-xs' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Resume Framing
                </button>
              </div>
            </div>

            {/* Window Body */}
            <div className="p-5 sm:p-6">
              
              {/* TAB 1: INTERACTIVE APP DEMO (SAMPLE AI RESUME ANALYZER) */}
              {activeProjectTab === 'demo' && (
                <div className="space-y-6">
                  
                  {/* Preset Selector */}
                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-2">
                      Select Sample Student Profile Preset:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {CANDIDATE_PRESETS.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => handleSelectPreset(p)}
                          className={`text-left p-2.5 rounded-xl border text-xs transition-all cursor-pointer ${
                            selectedPresetId === p.id
                              ? 'bg-indigo-950/80 border-indigo-500 text-white font-bold'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <span className="block text-[10px] uppercase font-mono text-indigo-400">{p.id.toUpperCase()} Cohort</span>
                          <span className="truncate block mt-0.5">{p.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Input Form Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                    <div className="sm:col-span-5 space-y-1">
                      <label className="block text-[11px] font-mono text-slate-400">
                        Target Placement Role:
                      </label>
                      <input
                        type="text"
                        value={targetRole}
                        onChange={(e) => setTargetRole(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-sans focus:outline-none focus:border-indigo-500"
                        placeholder="e.g. Junior AI / Full-Stack Engineer"
                      />
                    </div>
                    <div className="sm:col-span-7 space-y-1">
                      <label className="block text-[11px] font-mono text-slate-400">
                        Candidate Skills & Project Snippet:
                      </label>
                      <input
                        type="text"
                        value={resumeSnippet}
                        onChange={(e) => setResumeSnippet(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-sans focus:outline-none focus:border-indigo-500"
                        placeholder="Candidate resume excerpt..."
                      />
                    </div>
                  </div>

                  {/* Run Pipeline Action Button */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Pipeline: Node.js Express Proxy &bull; Temperature: 0.2 &bull; JSON Schema Validator</span>
                    </div>

                    <button
                      onClick={handleAnalyzeResume}
                      disabled={isAnalyzing}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 flex-shrink-0 shadow-sm cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{isAnalyzing ? 'Evaluating Resume...' : 'Analyze Sample Resume'}</span>
                    </button>
                  </div>

                  {/* AI FEEDBACK EVALUATION CARD */}
                  <div className="bg-slate-900/90 rounded-xl p-5 border border-slate-800 space-y-4">
                    
                    {/* Header Score Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 block mb-0.5">
                          ✓ Automated ATS Match Score
                        </span>
                        <h4 className="text-base font-bold text-white flex items-center gap-2">
                          <span>Evaluation for: {analysisResult.role}</span>
                        </h4>
                      </div>

                      <div className="flex items-baseline gap-2 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 self-start sm:self-auto">
                        <span className="text-2xl sm:text-3xl font-black text-emerald-400">
                          {analysisResult.score}
                        </span>
                        <span className="text-xs text-slate-400 font-bold">/ 100</span>
                        <span className="text-[10px] text-emerald-300 font-bold bg-emerald-950/80 px-2 py-0.5 rounded ml-1 border border-emerald-800/50">
                          High Potential
                        </span>
                      </div>
                    </div>

                    {/* Breakdown Meters */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                        <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                          <span>Tech Stack Alignment</span>
                          <span className="font-bold text-indigo-400">{analysisResult.stackMatch}%</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-indigo-500 h-1.5 rounded-full"
                            style={{ width: `${analysisResult.stackMatch}%` }}
                          />
                        </div>
                      </div>

                      <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                        <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                          <span>Quantified Impact</span>
                          <span className="font-bold text-amber-400">{analysisResult.impactScore}%</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-amber-500 h-1.5 rounded-full"
                            style={{ width: `${analysisResult.impactScore}%` }}
                          />
                        </div>
                      </div>

                      <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                        <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                          <span>Cloud & API Readiness</span>
                          <span className="font-bold text-emerald-400">{analysisResult.deploymentScore}%</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-emerald-500 h-1.5 rounded-full"
                            style={{ width: `${analysisResult.deploymentScore}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Actionable Improvement Suggestions */}
                    <div className="space-y-2 pt-1">
                      <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                        Actionable Suggestions for Candidate:
                      </span>
                      <div className="space-y-2">
                        {analysisResult.suggestions.map((sug, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 text-xs text-slate-300"
                          >
                            <span className="w-4 h-4 rounded-full bg-indigo-900/80 text-indigo-300 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                              {i + 1}
                            </span>
                            <span className="leading-relaxed">{sug}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Badges Footer */}
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-2 border-t border-slate-800 flex-wrap">
                    <span className="flex items-center gap-1 text-slate-300">
                      <GitBranch className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Ready to push to GitHub with clean README</span>
                    </span>
                    <span>&bull;</span>
                    <span>Stack: React + Node.js Express + LLM API</span>
                    <span>&bull;</span>
                    <span className="text-emerald-400 font-medium">100% Free Developer Sandbox</span>
                  </div>

                </div>
              )}

              {/* TAB 2: API ARCHITECTURE (CODE) */}
              {activeProjectTab === 'code' && (
                <div className="font-mono text-xs text-slate-300 space-y-2 bg-slate-900/80 p-4 rounded-xl border border-slate-800 overflow-x-auto leading-relaxed">
                  <p className="text-slate-500">// 1. Client sends resume text and target role to secure backend proxy</p>
                  <p><span className="text-purple-400">const</span> response = <span className="text-purple-400">await</span> fetch(<span className="text-amber-300">'/api/ai/analyze-resume'</span>, &#123;</p>
                  <p className="pl-4">method: <span className="text-amber-300">'POST'</span>,</p>
                  <p className="pl-4">headers: &#123; <span className="text-amber-300">'Content-Type'</span>: <span className="text-amber-300">'application/json'</span> &#125;,</p>
                  <p className="pl-4">body: JSON.stringify(&#123; targetRole, resumeSnippet, format: <span className="text-amber-300">'json_schema'</span> &#125;)</p>
                  <p>&#125;);</p>
                  <p><span className="text-purple-400">const</span> data = <span className="text-purple-400">await</span> response.json();</p>
                  <p className="text-slate-500 mt-2">// 2. Structured response containing score and suggestions parsed</p>
                  <p><span className="text-purple-400">const</span> &#123; score, stackMatch, impactScore, suggestions &#125; = data.evaluation;</p>
                  <p>renderFeedbackMeter(score, suggestions);</p>
                </div>
              )}

              {/* TAB 3: RESUME FRAMING */}
              {activeProjectTab === 'resume' && (
                <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 space-y-3 text-xs">
                  <h5 className="font-bold text-white text-sm">
                    How to Feature this Project on Your Technical Placement Resume:
                  </h5>
                  <ul className="space-y-2 text-slate-300 list-disc pl-5 leading-relaxed">
                    <li>
                      <strong>Project Title:</strong> Full-Stack AI Resume Matcher & Interview Readiness Engine
                    </li>
                    <li>
                      <strong>Architecture & Tech Stack:</strong> Built responsive React client communicating with a Node.js Express backend proxy with environment token security and rate limiting.
                    </li>
                    <li>
                      <strong>LLM API Integration:</strong> Integrated modern generative AI endpoints with structured JSON schema output validation and automated fallback error handling.
                    </li>
                    <li>
                      <strong>Proof-of-Work Artifacts:</strong> Published clean GitHub repository with automated test suite, interactive demo documentation, and placement interview talking points.
                    </li>
                  </ul>
                </div>
              )}

            </div>

          </div>

        </div>
      </section>

      {/* 3. THREE-STEP WORKSHOP AGENDA */}
      <section id="agenda-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            Structured 60-Minute Plan
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Three-Step Workshop Agenda
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Every minute is optimized for hands-on execution from empty directory to a functioning, interview-ready project.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Step 1 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-card space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 font-black flex items-center justify-center text-sm">
                01
              </span>
              <span className="bg-slate-100 text-slate-700 font-mono font-bold text-[10px] px-2 py-0.5 rounded">
                00:00 — 00:15 (15 Min)
              </span>
            </div>
            <h4 className="text-base font-bold text-slate-900">
              AI Fundamentals & API Setup
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Understand how generative AI endpoints operate under the hood. Learn token security, request headers, environment variable isolation, and clean project initialization.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-card space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 font-black flex items-center justify-center text-sm">
                02
              </span>
              <span className="bg-slate-100 text-slate-700 font-mono font-bold text-[10px] px-2 py-0.5 rounded">
                00:15 — 00:45 (30 Min)
              </span>
            </div>
            <h4 className="text-base font-bold text-slate-900">
              Live Guided Coding
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Write real code alongside mentors. Connect the user interface to AI API backends, handle live streaming states, parse JSON data, and implement graceful error fallbacks.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-card space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 font-black flex items-center justify-center text-sm">
                03
              </span>
              <span className="bg-slate-100 text-slate-700 font-mono font-bold text-[10px] px-2 py-0.5 rounded">
                00:45 — 01:00 (15 Min)
              </span>
            </div>
            <h4 className="text-base font-bold text-slate-900">
              Testing, GitHub Proof & Placements
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Validate edge cases, initialize a clean GitHub repository with recruiter-ready documentation, and learn how to present your AI project during technical placement interviews.
            </p>
          </div>

        </div>
      </section>

      {/* 4. WHAT STUDENTS WILL LEARN */}
      <section id="benefits-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            Student Outcomes
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Three Concrete Learning Outcomes
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Designed specifically to give final-year engineering students an authentic competitive edge.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-card space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900">1. Understand Core AI Mechanics</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Demystify modern generative models, API payloads, streaming responses, and token limits without getting bogged down in pure academic math.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-card space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Terminal className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900">2. Guided, Working Project</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Walk away with actual working code that executes locally and on GitHub, not just a folder of passive lecture notes.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-card space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900">3. Internship & Placement Proof</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Stand out in technical interviews by demonstrating how you built, secured, and deployed an AI project to solve real software engineering challenges.
            </p>
          </div>
        </div>
      </section>

      {/* 5. WHO SHOULD ATTEND */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 rounded-2xl p-8 sm:p-10 border border-slate-200/80">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Audience Fit
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Who Should Attend This Workshop?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Whether you are a Computer Science major or an engineering student from another department looking to transition into software engineering, this workshop meets you where you are.
              </p>
              
              <div className="space-y-2 pt-1 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span><strong>Final-Year Students (2025/2026 Batch):</strong> Preparing for upcoming campus placement drives and technical interviews.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span><strong>Aspiring Software & AI Interns:</strong> Seeking tangible proof-of-work beyond textbook projects.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span><strong>Curious Beginners:</strong> Students with basic programming familiarity who want to build their first practical AI app.</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-sm bg-white p-5 rounded-xl border border-slate-200 shadow-card space-y-3">
                <h5 className="font-bold text-slate-900 text-xs flex items-center gap-2">
                  <Laptop className="w-4 h-4 text-indigo-600" />
                  <span>Pre-requisites Checklist</span>
                </h5>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                    <span>Laptop with modern browser</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                    <span>Basic programming familiarity</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                    <span>Free GitHub account (recommended)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                    <span>No paid subscriptions needed</span>
                  </li>
                </ul>

                <button
                  onClick={scrollToRegistration}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2 rounded-lg transition-colors text-center block shadow-xs cursor-pointer"
                >
                  Join Workshop Now
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. FREQUENTLY ASKED QUESTIONS */}
      <section id="faq-section" className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            Got Questions?
          </span>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            Frequently Asked Questions
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Transparent, honest answers for engineering students.
          </p>
        </div>

        <div className="space-y-2.5">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl border border-slate-200/90 overflow-hidden shadow-xs transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-3 font-bold text-slate-900 text-xs sm:text-sm hover:text-indigo-600 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                    <span>{faq.q}</span>
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-0.5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. FINAL REGISTRATION CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-2xl p-8 sm:p-10 text-center space-y-4 shadow-xl">
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
            Ready to Build Your First AI Project?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
            Join fellow final-year engineering students for a live 60-minute practical session. 100% free with guided instructions.
          </p>
          <div className="pt-2">
            <button
              onClick={scrollToRegistration}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-sm hover:shadow transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Claim Your Free Seat</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[11px] text-slate-400">
            Batch size is limited to ensure interactive live mentoring.
          </p>
        </div>
      </section>

    </div>
  );
}
