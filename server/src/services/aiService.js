const https = require('https');

// Pre-packaged, high-impact rule-based engine and intelligent generator
// Falls back seamlessly if no GEMINI_API_KEY is configured in .env

async function callGeminiApi(prompt, apiKey) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000
      }
    });

    const url = new URL(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`);

    const req = https.request(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      },
      timeout: 10000
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (parsed.candidates && parsed.candidates[0]?.content?.parts[0]?.text) {
            resolve(parsed.candidates[0].content.parts[0].text);
          } else {
            reject(new Error(parsed.error?.message || 'Invalid Gemini response'));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('AI API request timed out'));
    });

    req.write(data);
    req.end();
  });
}

function generateRuleBasedResponse(taskType, context = {}) {
  const {
    totalRegistrations = 342,
    targetRegistrations = 500,
    remainingToTarget = 158,
    daysLeft = 1,
    budgetSpent = 1250,
    totalBudget = 2000,
    remainingBudget = 750,
    underperformingChannel = 'Direct Outreach / Cold Email',
    topChannel = 'College WhatsApp Groups'
  } = context;

  switch (taskType) {
    case 'whatsapp_hook':
      return {
        title: 'High-Conversion WhatsApp Peer Broadcast Script',
        content: `⚡ Quick question for final-year engineering folks:\n\nAre you still listing standard academic mini-projects on your resume?\n\nJoin this free 60-minute practical workshop: *"Build Your First AI Project in 60 Minutes"*\n\n🎯 What we build live:\n• A working AI application using modern APIs\n• Clean GitHub repo setup ready to showcase\n• Practical skills relevant for software & AI entry roles\n\n🕒 Date & Time: [Insert Confirmed Date/Time Placeholder]\n💰 Fee: 100% Free (Zero cost)\n👉 Secure your spot here: [Insert Student Referral Link]\n\n(Batch capacity is limited for the live coding session — grab your seat now!)`,
        metadata: {
          tone: 'Conversational & Value-Driven',
          targetAudience: 'Final Year CS / IT / ECE Students',
          engine: 'Rule-Based Growth Template'
        }
      };

    case 'tech_club_email':
      return {
        title: 'Technical Club & Community Partnership Pitch',
        content: `Subject: Collaboration Proposal: Free Hands-on AI Workshop for [College Name] Engineering Students\n\nDear [Club Lead / Faculty Coordinator Name],\n\nGreetings from the campus student initiative!\n\nWe know that final-year engineering students at [College Name] are actively preparing for internships, product engineering roles, and placement interviews. Demonstrating practical, hands-on project proof-of-work helps students showcase applied coding capabilities during technical interviews and portfolio reviews.\n\nWe would love to co-host a free 60-minute hands-on virtual workshop titled *"Build Your First AI Project in 60 Minutes"* for members of [Club Name].\n\nWorkshop Highlights for Your Club Members:\n1. Hands-on coding: Every attendee writes real code and deploys an interactive AI project.\n2. GitHub repository creation: Tangible proof of work for job applications.\n3. Completely free of charge: No commercial barriers or hidden fees.\n4. Official co-branding opportunity: We can feature [Club Name] as an official learning community partner.\n\nWould you be open to a quick 5-minute sync or reviewing the workshop outline? You can preview the session details at [Insert Link].\n\nWarm regards,\n\n[Your Name / Student Ambassador]\nGrowth & Outreach Coordinator\nContact: [Your Phone / Email]`,
        metadata: {
          tone: 'Professional & Collaborative',
          targetAudience: 'College Technical Club Presidents & HODs',
          engine: 'Rule-Based Growth Template',
          complianceDisclosure: 'Compliant educational invitation; no job guarantees or commercial claims.'
        }
      };

    case 'campaign_experiments':
      return {
        title: '3 Low-Cost High-Yield Growth Experiments (₹2,000 Budget Cap)',
        content: `Here are 3 prioritized growth experiments to bridge the remaining ${remainingToTarget} registrations within ₹${remainingBudget} remaining budget:\n\n1. 🏆 "Campus Referral Sprint" (Incentivized Peer Loop)\n• Concept: Announce a "Top Ambassador Leaderboard" where the student with the most peer signups gets priority 1-on-1 resume review from an AI engineer.\n• Cost: ₹0 marginal ad spend (leveraging organic pride & career value).\n• Projected Estimate: ~60-80 registrations across 48 hours (model projection).\n\n2. 👥 "Study Group Bundle" WhatsApp Play\n• Concept: Frame the workshop as a group activity: "Forward to your final-year project group so you can build your semester capstone together."\n• Cost: ₹0\n• Projected Estimate: Estimated +25-30% lift in peer sharing coefficient.\n\n3. 🎯 Micro-Targeted Community Push (Remaining Budget ₹${remainingBudget})\n• Concept: Allocate ₹300-₹400 for targeted promotions inside specific engineering Discord/Telegram study servers and college student hubs.\n• Cost: ₹400\n• Projected Estimate: ~35-45 registrations at ~₹9-10 CAC (budget ceiling compliant).\n\n*Note: Growth projections are tactical planning estimates for campaign simulation, not guaranteed outcomes.*`,
        metadata: {
          budgetImpact: `₹400 utilized, ₹${remainingBudget - 400} retained in reserve`,
          pacingImpact: `Projected +95 to +125 registrations (model estimate)`,
          engine: 'Rule-Based Growth Engine',
          complianceDisclosure: 'Projections are planning estimates based on benchmark modeling; outcomes vary by institutional community engagement.'
        }
      };

    case 'diagnose_channels':
      return {
        title: 'Channel Diagnosis & Pacing Analysis',
        content: `📊 Performance Diagnosis Based on Real-Time Campaign Data:\n\n• Top Performer: ${topChannel}\n  - WhatsApp groups are achieving strong organic velocity with peer-to-peer trust. Keep supplying group admins with fresh value-oriented snippets rather than repeated promo links.\n\n• Underperforming Channel: ${underperformingChannel}\n  - Cold emails show low open and click rates (~12-15% industry standard). Cold email lacks immediate social proof among busy final-year students.\n\n💡 Corrective Growth Recommendation:\n  - Reallocate remaining effort away from low-conversion cold emails toward College Technical Clubs and Student Ambassador outreach.\n  - Encourage existing registrants to invite 2 batchmates: current registered count is ${totalRegistrations}. If only 25% of existing students refer 1 friend, you gain ${(totalRegistrations * 0.25).toFixed(0)} registrations instantly!`,
        metadata: {
          underperforming: underperformingChannel,
          recommendedPivot: 'Student Ambassador Peer Loops',
          engine: 'Rule-Based Diagnostic'
        }
      };

    case 'daily_summary':
    default:
      return {
        title: 'Campaign Daily Growth Executive Summary',
        content: `📈 Daily Growth Summary:\n\n• Current Status: ${totalRegistrations} / ${targetRegistrations} registrations (${((totalRegistrations / targetRegistrations) * 100).toFixed(1)}% to goal)\n• Remaining Gap: ${remainingToTarget} registrations required\n• Days Elapsed: 6 of 7 days\n• Financial Health: ₹${budgetSpent} spent out of ₹${totalBudget} budget (Blended CAC: ₹${(budgetSpent / Math.max(1, totalRegistrations)).toFixed(2)}/student)\n• Primary Driver: WhatsApp peer groups and ambassador referral links account for the majority of acquisition.\n• Day 7 Strategic Focus: Execute a final morning reminder to all student ambassador networks and technical clubs to close the remaining ${remainingToTarget} registrations before the workshop kickoff.`,
        metadata: {
          engine: 'Rule-Based Summary Generator'
        }
      };
  }
}

async function generateAiContent({ taskType, context, customPrompt }) {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

  if (apiKey && apiKey !== 'your_gemini_api_key_here') {
    try {
      let promptText = '';
      if (customPrompt) {
        promptText = `You are a Senior Growth Marketing Specialist helping run a 7-day student acquisition campaign for a free online workshop: "Build Your First AI Project in 60 Minutes". 
Target audience: Final-year engineering students in India.
Current data: ${JSON.stringify(context)}.
User query: ${customPrompt}
Provide clear, actionable, realistic marketing advice with no false claims, no guaranteed placement or salary promises, no unverified statistics, and strict adherence to the ₹2,000 total budget. Disclose that all target metrics are planning projections.`;
      } else {
        promptText = `You are a Growth Marketing Engineer. Task: ${taskType}.
Campaign context:
- Target: 500 registrations
- Current registrations: ${context.totalRegistrations || 342}
- Budget: ₹2,000 (spent ₹${context.budgetSpent || 1250})
- Primary channels: WhatsApp groups, Student Ambassadors, Technical Clubs
- Constraints: No spam, no false claims, no job or placement guarantees, strictly ethical growth loops.
Generate high quality, ready-to-use copy or advice formatted clearly in markdown. Disclose that targets are planning projections.`;
      }

      const aiText = await callGeminiApi(promptText, apiKey);
      return {
        success: true,
        source: 'Google Gemini AI',
        isAiPowered: true,
        data: {
          title: `AI-Generated Output: ${taskType.replace(/_/g, ' ').toUpperCase()}`,
          content: aiText,
          metadata: {
            model: 'gemini-1.5-flash',
            timestamp: new Date().toISOString()
          }
        }
      };
    } catch (err) {
      console.warn('Gemini API call failed, gracefully falling back to deterministic growth engine:', err.message);
      // Fall through to deterministic fallback
    }
  }

  // Graceful rule-based engine fallback
  const fallback = generateRuleBasedResponse(taskType, context);
  return {
    success: true,
    source: 'Deterministic Growth Engine (Fallback Mode)',
    isAiPowered: false,
    note: 'Running in high-fidelity simulation mode. To enable live Google Gemini AI, configure GEMINI_API_KEY in server/.env.',
    data: fallback
  };
}

module.exports = {
  generateAiContent
};
