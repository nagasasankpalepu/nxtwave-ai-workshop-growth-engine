import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  Bot,
  Sparkles,
  Send,
  Copy,
  Check,
  RefreshCw,
  MessageSquare,
  Mail,
  Lightbulb,
  FileText,
  Activity,
  CheckCircle2,
  BookOpen,
  User,
  Info
} from 'lucide-react';
import { useOrganizerTheme } from '../context/OrganizerThemeContext';

export default function AiGrowthAssistantPage({ initialMode = 'ai' }) {
  const { isDark } = useOrganizerTheme();
  const [activeSubTab, setActiveSubTab] = useState(initialMode);

  // Chat Interface State
  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      title: 'Campaign Growth Copilot',
      content: `Welcome to the AI Campaign Growth Assistant!\n\nI can help you:\n• Draft high-conversion WhatsApp peer messages\n• Generate technical club collaboration pitches\n• Suggest low-cost growth experiments within your ₹2,000 budget\n• Diagnose underperforming acquisition channels\n• Produce daily executive briefings\n\nSelect a suggested prompt below or type your question!`,
      isAiPowered: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState(null);

  // Message Library State
  const [templates, setTemplates] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [copiedTemplateId, setCopiedTemplateId] = useState(null);
  const [userCollegePlaceholder, setUserCollegePlaceholder] = useState('VNR VJIET');
  const [userLinkPlaceholder, setUserLinkPlaceholder] = useState('http://localhost:5173/?ref=NXT-GROWTH');

  const suggestedPrompts = [
    { label: 'WhatsApp Promo Hook', task: 'whatsapp_hook', text: 'Draft a conversational WhatsApp message for final-year engineering students.' },
    { label: 'Tech Club Pitch', task: 'tech_club_email', text: 'Generate an email outreach proposal for a college technical club president.' },
    { label: '3 Experiments (₹2k Cap)', task: 'campaign_experiments', text: 'Suggest 3 high-yield low-cost experiments to reach 500 registrations.' },
    { label: 'Diagnose Channels', task: 'diagnose_channels', text: 'Analyze current campaign velocity and identify underperforming channels.' },
    { label: 'Daily Executive Summary', task: 'daily_summary', text: 'Generate an executive daily briefing on registrations and budget pacing.' }
  ];

  useEffect(() => {
    async function fetchTemplates() {
      try {
        const res = await api.getMessages();
        if (res.success) {
          setTemplates(res.data);
        }
      } catch (e) {
        console.error('Error fetching message library:', e);
      }
    }
    fetchTemplates();
  }, []);

  async function handleSend(taskType = 'daily_summary', custom = null) {
    const promptToSend = custom || inputText.trim();
    if (!promptToSend && !taskType) return;

    const userMsg = {
      sender: 'user',
      content: promptToSend || `Task: ${taskType.replace(/_/g, ' ')}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const res = await api.generateAi({
        taskType: taskType || 'custom',
        customPrompt: custom || (promptToSend ? promptToSend : null)
      });

      const assistantMsg = {
        sender: 'assistant',
        title: res.data?.title || 'Growth Intelligence Recommendation',
        content: res.data?.content || 'Output generated.',
        isAiPowered: res.isAiPowered,
        source: res.source,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (e) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'assistant',
          title: 'Growth Intelligence Offline',
          content: 'Unable to communicate with the growth intelligence service. Please check your backend connection.',
          isAiPowered: false,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleCopy(text, idx) {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    });
  }

  function handleCopyTemplate(template) {
    let replaced = template.content;
    replaced = replaced.replace(/\[Your College\/Branch\]/g, userCollegePlaceholder);
    replaced = replaced.replace(/\[College Name\]/g, userCollegePlaceholder);
    replaced = replaced.replace(/\[Your Referral Link\]/g, userLinkPlaceholder);
    replaced = replaced.replace(/\[Ambassador Application Link\]/g, userLinkPlaceholder);
    replaced = replaced.replace(/\[Preview Link\]/g, userLinkPlaceholder);
    replaced = replaced.replace(/\[Workshop Registration Link\]/g, userLinkPlaceholder);
    replaced = replaced.replace(/\[Registration Link\]/g, userLinkPlaceholder);
    replaced = replaced.replace(/\[Student Name\]/g, 'Fellow Engineer');
    replaced = replaced.replace(/\[Club Name\]/g, 'Coding Club');

    navigator.clipboard.writeText(replaced).then(() => {
      setCopiedTemplateId(template.id);
      setTimeout(() => setCopiedTemplateId(null), 2000);
    });
  }

  const filteredTemplates = selectedCategory === 'All'
    ? templates
    : templates.filter(t => t.category === selectedCategory);

  return (
    <div className="space-y-6 pb-12">
      
      {/* HEADER & VIEW TOGGLE */}
      <div
        className={`p-6 rounded-2xl border shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
          isDark
            ? 'bg-[#172033] border-[#334155] text-[#F8FAFC]'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <div>
          <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold mb-1.5 border ${
              isDark
                ? 'bg-indigo-950/80 border-indigo-800/40 text-[#818CF8]'
                : 'bg-indigo-50 border-indigo-100 text-indigo-700'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>AI Growth Intelligence & Templates</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            {activeSubTab === 'ai' ? 'AI Growth Assistant (Copilot)' : 'Approved Message Library'}
          </h2>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Dual-mode growth copilot with Google Gemini API & fallback engine, plus editable student message templates.
          </p>
        </div>

        {/* View Toggle */}
        <div
          className={`p-1 rounded-xl flex items-center text-xs font-semibold self-start sm:self-auto border ${
            isDark ? 'bg-[#1E293B] border-[#334155]' : 'bg-slate-100 border-slate-200'
          }`}
        >
          <button
            onClick={() => setActiveSubTab('ai')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'ai'
                ? isDark
                  ? 'bg-indigo-600 text-white font-bold shadow-xs'
                  : 'bg-white text-slate-900 font-bold shadow-xs'
                : isDark
                ? 'text-slate-400 hover:text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>AI Copilot</span>
          </button>
          <button
            onClick={() => setActiveSubTab('messages')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'messages'
                ? isDark
                  ? 'bg-indigo-600 text-white font-bold shadow-xs'
                  : 'bg-white text-slate-900 font-bold shadow-xs'
                : isDark
                ? 'text-slate-400 hover:text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Message Library</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: AI GROWTH COPILOT */}
      {activeSubTab === 'ai' && (
        <div className="space-y-4">
          
          {/* Dual-Mode Architecture Notice */}
          <div
            className={`p-3.5 rounded-xl border text-xs flex items-center justify-between flex-wrap gap-2 transition-colors ${
              isDark
                ? 'bg-[#172033] border-[#334155] text-slate-300'
                : 'bg-indigo-50/70 border-indigo-200 text-indigo-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400 flex-shrink-0" />
              <span>
                <strong>Dual-Mode AI Engine:</strong> Uses live Google Gemini API if <code>GEMINI_API_KEY</code> is present; otherwise falls back to deterministic rule-based growth strategies without breaking.
              </span>
            </div>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                isDark
                  ? 'bg-emerald-950/60 text-[#34D399] border-emerald-800/40'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}
            >
              Zero API Key Dependency
            </span>
          </div>

          {/* Suggested Prompt Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className={`text-[11px] font-bold uppercase tracking-wider flex-shrink-0 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Suggested Prompts:
            </span>
            {suggestedPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p.task, p.text)}
                disabled={loading}
                className={`text-xs px-3 py-1.5 rounded-xl border whitespace-nowrap transition-all shadow-xs cursor-pointer flex-shrink-0 ${
                  isDark
                    ? 'bg-[#172033] hover:bg-[#1E293B] text-slate-300 border-[#334155] hover:text-white'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Main Chat Box */}
          <div
            className={`rounded-2xl border shadow-card flex flex-col h-[520px] overflow-hidden transition-colors ${
              isDark ? 'bg-[#172033] border-[#334155]' : 'bg-white border-slate-200'
            }`}
          >
            
            {/* Messages Feed */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
              {messages.map((msg, idx) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={idx}
                    className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                        isUser
                          ? 'bg-indigo-600 text-white'
                          : isDark
                          ? 'bg-indigo-900/60 text-[#818CF8]'
                          : 'bg-indigo-100 text-indigo-700'
                      }`}
                    >
                      {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>

                    <div className="space-y-1 max-w-[88%]">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {isUser ? 'You (Growth Organizer)' : msg.title}
                        </span>
                        {!isUser && msg.isAiPowered !== undefined && (
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${
                              msg.isAiPowered
                                ? isDark
                                  ? 'bg-emerald-950/60 text-[#34D399] border-emerald-800/40'
                                  : 'bg-emerald-100 text-emerald-700 border-emerald-200'
                                : isDark
                                ? 'bg-amber-950/60 text-amber-300 border-amber-800/40'
                                : 'bg-amber-100 text-amber-800 border-amber-200'
                            }`}
                          >
                            {msg.isAiPowered ? 'Live Gemini AI' : 'Rule-Based Engine'}
                          </span>
                        )}
                        <span className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                          {msg.timestamp}
                        </span>
                      </div>

                      <div
                        className={`p-3.5 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap border ${
                          isUser
                            ? 'bg-indigo-600 text-white border-indigo-700'
                            : isDark
                            ? 'bg-[#1E293B] border-[#334155] text-slate-200'
                            : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      >
                        {msg.content}
                      </div>

                      {!isUser && (
                        <div className="flex items-center gap-2 pt-0.5">
                          <button
                            onClick={() => handleCopy(msg.content, idx)}
                            className={`text-[11px] font-semibold flex items-center gap-1 cursor-pointer ${
                              isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-800'
                            }`}
                          >
                            {copiedIdx === idx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedIdx === idx ? 'Copied to clipboard' : 'Copy response'}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {loading && (
                <div className="flex items-center gap-3 text-xs text-indigo-400">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Synthesizing growth recommendations...</span>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div className={`p-3 sm:p-4 border-t ${isDark ? 'border-[#334155] bg-[#1E293B]/60' : 'border-slate-100 bg-slate-50'}`}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend('custom', inputText);
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  placeholder="Ask for custom outreach messaging, channel ideas, or campaign pacing..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className={`flex-1 px-4 py-2 text-xs rounded-xl border focus:outline-none ${
                    isDark
                      ? 'bg-[#172033] border-[#334155] text-white focus:border-indigo-400'
                      : 'bg-white border-slate-200 text-slate-900 focus:border-indigo-600'
                  }`}
                />
                <button
                  type="submit"
                  disabled={loading || !inputText.trim()}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </div>

          </div>

        </div>
      )}

      {/* VIEW 2: MESSAGE LIBRARY */}
      {activeSubTab === 'messages' && (
        <div className="space-y-6">
          
          {/* Placeholder Customizer Bar */}
          <div
            className={`p-4 sm:p-5 rounded-2xl border shadow-card space-y-3 transition-colors ${
              isDark ? 'bg-[#172033] border-[#334155]' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                  Dynamic Placeholder Injection
                </h3>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Customize your campus name and referral URL to dynamically insert into all approved message templates.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className={`block text-[11px] font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  College / Branch Placeholder:
                </label>
                <input
                  type="text"
                  value={userCollegePlaceholder}
                  onChange={(e) => setUserCollegePlaceholder(e.target.value)}
                  placeholder="e.g. CBIT CSE, VIT, PES..."
                  className={`w-full px-3 py-1.5 text-xs rounded-xl border focus:outline-none ${
                    isDark ? 'bg-[#1E293B] border-[#334155] text-white' : 'bg-white border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-[11px] font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Workshop Referral URL:
                </label>
                <input
                  type="text"
                  value={userLinkPlaceholder}
                  onChange={(e) => setUserLinkPlaceholder(e.target.value)}
                  placeholder="http://localhost:5173/?ref=..."
                  className={`w-full px-3 py-1.5 text-xs rounded-xl border font-mono focus:outline-none ${
                    isDark ? 'bg-[#1E293B] border-[#334155] text-white' : 'bg-white border-slate-200 text-slate-900'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {['All', 'WhatsApp', 'Student Ambassadors', 'Technical Clubs', 'Email', 'Reminders'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-3 py-1.5 rounded-xl border whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? isDark
                      ? 'bg-indigo-600 text-white font-bold border-indigo-500 shadow-xs'
                      : 'bg-indigo-600 text-white font-bold border-indigo-600 shadow-xs'
                    : isDark
                    ? 'bg-[#172033] text-slate-400 border-[#334155] hover:text-white'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTemplates.map((t) => (
              <div
                key={t.id}
                className={`p-5 rounded-2xl border shadow-card space-y-3 flex flex-col justify-between transition-colors ${
                  isDark ? 'bg-[#172033] border-[#334155]' : 'bg-white border-slate-200'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        isDark
                          ? 'bg-indigo-950/60 text-[#818CF8] border-indigo-800/40'
                          : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                      }`}
                    >
                      {t.category}
                    </span>
                    <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {t.estimatedReadTime} read
                    </span>
                  </div>

                  <h4 className="text-sm font-bold">{t.title}</h4>
                  <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Target: {t.targetAudience}
                  </p>

                  <div
                    className={`p-3 rounded-xl border font-sans text-xs leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap ${
                      isDark
                        ? 'bg-[#1E293B] border-[#334155] text-slate-300'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    {t.content}
                  </div>
                </div>

                <div className="pt-2 border-t border-inherit flex items-center justify-between">
                  <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Placeholders auto-substituted
                  </span>

                  <button
                    onClick={() => handleCopyTemplate(t)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    {copiedTemplateId === t.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedTemplateId === t.id ? 'Copied Formatted!' : 'Copy Template'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
}
