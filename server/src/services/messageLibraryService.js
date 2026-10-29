// Pre-approved, ethical, high-conversion growth message library
// Strictly adheres to compliance: no false claims, no guaranteed job promises, clear student benefits

const MESSAGE_TEMPLATES = [
  {
    id: 'whatsapp_general_community',
    category: 'WhatsApp',
    channel: 'College WhatsApp Groups',
    title: 'Value-First Peer Announcement',
    targetAudience: 'Class / Branch WhatsApp Groups (CSE / IT / ECE)',
    estimatedReadTime: '45 seconds',
    variables: ['[Your College/Branch]', '[Your Referral Link]'],
    complianceDisclosure: 'Compliant educational invitation; zero fee, no job guarantee claims.',
    jobGuaranteeClaim: false,
    content: `Hey everyone 👋

If anyone in [Your College/Branch] is looking to add a genuine, working AI project to their resume for upcoming placement drives or internships, here's an opportunity:

🚀 *Free Workshop: Build Your First AI Project in 60 Minutes*

Instead of just watching slides, you will actually write code and deploy a functioning AI application step-by-step.

💡 *What you'll walk away with:*
1. Fundamental architecture of practical AI applications
2. A live, working project hosted on GitHub that you can showcase to interviewers
3. Clarity on how modern tech companies utilize AI in everyday development

💰 *Cost:* 100% Free (Virtual session)
🕒 *Duration:* 60 minutes focused hands-on build
🔗 *Reserve your free seat here:* [Your Referral Link]

Feel free to forward this to anyone working on their capstone or preparing for tech interviews!`
  },
  {
    id: 'whatsapp_ambassador_invite',
    category: 'Student Ambassadors',
    channel: 'Student Ambassador Invitation',
    title: 'Campus Ambassador Recruitment & Peer Outreach',
    targetAudience: 'Active Club Leads, CRs, & Enthusiastic Students',
    estimatedReadTime: '60 seconds',
    variables: ['[Student Name]', '[Ambassador Application Link]'],
    complianceDisclosure: 'Campus ambassador peer engagement; no commercial claims or job guarantees.',
    jobGuaranteeClaim: false,
    content: `Hi [Student Name],

Hope your semester prep is going smoothly!

We're selecting 5 proactive Student Ambassadors from our campus to co-lead the launch of a free virtual workshop: *"Build Your First AI Project in 60 Minutes"*.

🌟 *Why participate as an Ambassador?*
• Practical Leadership: Lead a technical initiative on campus and gain community-building experience.
• Exclusive Access: Direct priority Q&A with experienced software mentors.
• Growth Leader Recognition: Stand out on LinkedIn with tangible proof of organizing technical student cohorts.
• Exclusive Referral Tracking: Get your personalized link to track how many batchmates you empower.

🎯 *Your role:* Simply share the free learning opportunity with your department peers, project groups, and campus clubs. Zero marketing budget or spamming required.

Interested in representing our campus? Let me know here: [Ambassador Application Link]`
  },
  {
    id: 'tech_club_outreach',
    category: 'Technical Clubs',
    channel: 'College Technical Club Outreach',
    title: 'Formal Collaboration Pitch for Club Presidents',
    targetAudience: 'Coding Club Leads, IEEE / ACM Student Chapters, CSI Members',
    estimatedReadTime: '90 seconds',
    variables: ['[Club Name]', '[College Name]', '[Preview Link]'],
    complianceDisclosure: 'Technical community co-hosting proposal; zero fee, focus on practical learning.',
    jobGuaranteeClaim: false,
    content: `Subject: Educational Partnership Proposal: Free 60-Minute AI Project Workshop for [Club Name]

Dear Core Team of [Club Name],

We have been closely following the hands-on technical initiatives organized by [Club Name] at [College Name]. Your commitment to helping students build practical engineering skills is commendable.

To support final-year students gearing up for upcoming campus hiring and technical interviews, we are organizing a free, interactive online workshop:
*"Build Your First AI Project in 60 Minutes"*

We would be thrilled to offer exclusive co-hosting partner recognition to [Club Name].

🤝 *What this collaboration offers your club members:*
1. Live Hands-on Coding: Participants build and test an AI project from scratch within 60 minutes.
2. Resume Proof-of-Work: Every student finishes with a deployable GitHub repository.
3. Completely Free of Cost: Open to all students with no registration or certification fees.
4. Partner Spotlight: We will feature [Club Name] as an official learning community partner in workshop communications.

We would be glad to share an outline of the session or coordinate a brief 5-minute call. You can review the workshop syllabus here: [Preview Link]

Looking forward to empowering our campus engineers together!

Warm regards,
Campus Community Outreach Team`
  },
  {
    id: 'email_personalized_outreach',
    category: 'Email',
    channel: 'Personalized Email Outreach',
    title: 'Career & Placement Oriented Value Email',
    targetAudience: 'Final Year Engineering Students actively preparing for placements',
    estimatedReadTime: '60 seconds',
    variables: ['[Student Name]', '[Workshop Registration Link]'],
    complianceDisclosure: 'Portfolio skills preparation; strictly zero fee, no employment guarantee.',
    jobGuaranteeClaim: false,
    content: `Subject: Practical AI Project for Your Resume (Free 60-Minute Workshop)

Hi [Student Name],

With placement season and technical interview rounds approaching, one common question engineering students ask is:
"How can I make my software portfolio stand out when everyone has similar academic projects?"

A strong answer is demonstrating hands-on experience building with modern AI APIs.

To help you gain this advantage, we are hosting a focused, beginner-friendly online session:
*"Build Your First AI Project in 60 Minutes"*

Key Highlights:
• Build a practical, working AI application live from start to finish.
• Understand how API calls, prompts, and application logic connect in production.
• Learn how to discuss your AI project articulately during technical interviews.
• 100% Free of charge with guided instructions.

Seats for the interactive coding environment are filled on a first-come, first-served basis.

Register for free here: [Workshop Registration Link]

Best wishes for your career preparations!`
  },
  {
    id: 'final_reminder_day7',
    category: 'Reminders',
    channel: 'Final Day 7 Registration Reminder',
    title: 'Gentle, Honest Final Call (Zero False Urgency)',
    targetAudience: 'Registered contacts & Interested community members',
    estimatedReadTime: '30 seconds',
    variables: ['[Registration Link]'],
    complianceDisclosure: 'Transparent reminder; zero false urgency, zero fee.',
    jobGuaranteeClaim: false,
    content: `Final Reminder ⏰

Our free hands-on session *"Build Your First AI Project in 60 Minutes"* begins tomorrow!

If you've been wanting to understand how to build and deploy practical AI apps but didn't know where to start, this session will guide you through the entire process in one hour.

✅ Prerequisites: Basic programming familiarity (beginners welcome)
✅ Cost: ₹0 (Free)
✅ What you need: Laptop with internet browser

Claim your spot before registrations close: [Registration Link]

See you in the live coding room!`
  }
];

function getAllTemplates() {
  return MESSAGE_TEMPLATES;
}

function getTemplateById(id) {
  return MESSAGE_TEMPLATES.find(t => t.id === id) || null;
}

module.exports = {
  getAllTemplates,
  getTemplateById
};
