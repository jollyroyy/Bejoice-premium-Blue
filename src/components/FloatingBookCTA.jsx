// FloatingBookCTA.jsx — Layla AI freight assistant for Bejoice Premium
import { useState, useEffect, useRef } from "react";
import { useCalBooking } from "../hooks/useCalBooking";

const CAL_LINK = "sudeshna-pal-ruww5f/freight-consultation";

const MESSAGES = [
  "Hey there! 👋 Need help with shipping?",
  "Get a free freight quote in 60 seconds!",
  "We move cargo across 50+ countries 🌍",
  "Red Sea disruptions? We have alt routes!",
  "Sea · Air · Land — we cover it all!",
  "Vision 2030 logistics partner 🇸🇦",
  "Talk to a freight expert, free of charge!",
];

const QUICK_REPLIES = [
  { label: "📦 Get a Quote",       action: "quote" },
  { label: "✈️ Air Freight",       action: "air"   },
  { label: "🚢 Sea Freight",       action: "sea"   },
  { label: "🏗️ Heavy Cargo",       action: "heavy" },
  { label: "🇸🇦 Saudi Logistics",  action: "saudi" },
  { label: "📊 Market Updates",    action: "market"},
  { label: "📞 Talk to Expert",    action: "call"  },
];

// ── Knowledge base ────────────────────────────────────────────
const KB = {
  greet: [
    "hi", "hello", "hey", "good morning", "good afternoon", "good evening", "salam", "marhaba"
  ],
  quote: [
    "quote", "price", "rate", "cost", "how much", "pricing", "estimate", "charges", "fee"
  ],
  air: [
    "air freight", "air cargo", "airfreight", "airline", "aircraft", "fly", "flight", "aviation",
    "express", "urgent", "overnight", "air shipping"
  ],
  sea: [
    "sea freight", "ocean freight", "vessel", "container", "fcl", "lcl", "port", "shipping line",
    "maritime", "nautical", "bulk carrier", "ro-ro", "tanker"
  ],
  heavy: [
    "heavy lift", "heavy cargo", "oversized", "project cargo", "oog", "out of gauge", "crane",
    "machinery", "industrial", "breakbulk", "abnormal load", "wide load"
  ],
  saudi: [
    "saudi", "ksa", "riyadh", "jeddah", "dammam", "mecca", "medina", "zatca",
    "vision 2030", "neom", "giga project", "saudi customs", "saudi port", "king abdulaziz port",
    "jeddah islamic port", "king fahd industrial port", "saso", "vat", "sabic"
  ],
  market: [
    "red sea", "suez canal", "houthi", "disruption", "delay", "congestion", "freight rate",
    "market update", "latest", "news", "update", "trend", "2024", "2025", "supply chain crisis",
    "shipping crisis", "port congestion", "container shortage", "rate spike"
  ],
  customs: [
    "customs", "clearance", "import", "export", "duty", "tariff", "compliance", "documentation",
    "bill of lading", "invoice", "packing list", "certificate of origin", "hs code", "inspection",
    "zatca", "gazt", "aqil"
  ],
  warehousing: [
    "warehouse", "storage", "fulfillment", "distribution", "3pl", "inventory",
    "last mile", "cold chain", "temperature controlled", "bonded warehouse"
  ],
  tracking: [
    "track", "tracking", "status", "where is", "shipment status", "locate", "eta",
    "estimated arrival", "delivery", "update my shipment"
  ],
  insurance: [
    "insurance", "cargo insurance", "damage", "claim", "loss", "cover", "liability"
  ],
  contact: [
    "contact", "call", "speak", "talk", "human", "agent", "expert", "representative",
    "phone", "email", "book", "meeting", "consultation"
  ],
  whoAreYou: [
    "who are you", "what are you", "are you human", "are you a robot", "are you ai",
    "are you real", "are you a bot", "tell me about yourself", "introduce yourself"
  ],
  howAreYou: [
    "how are you", "how do you do", "are you ok", "how's it going", "what's up",
    "how r u", "hows it going", "you doing well"
  ],
  compliment: [
    "you are beautiful", "you're beautiful", "you look beautiful", "you are pretty",
    "you're pretty", "you are gorgeous", "you're gorgeous", "you are amazing",
    "you are lovely", "you are cute", "you're cute", "you are stunning", "so nice",
    "you are wonderful", "you're wonderful", "you are great", "you are awesome"
  ],
  romantic: [
    "date me", "go out with me", "will you marry me", "i love you", "i like you",
    "do you like me", "be my girlfriend", "be my boyfriend", "do you have feelings",
    "can we date", "fall in love", "are you single", "relationship with you"
  ],
  negative: [
    "you are bad", "you're bad", "you are useless", "you're useless", "you are stupid",
    "you're stupid", "you are dumb", "you're dumb", "you are terrible", "you're terrible",
    "hate you", "i hate you", "you are worst", "you are awful", "you are pathetic",
    "not helpful", "not useful", "so bad", "very bad"
  ],
  thanks: [
    "thank you", "thanks", "thank u", "many thanks", "appreciate it", "appreciate you",
    "helpful", "very helpful", "great job", "good job", "well done", "nicely done"
  ],
};

const RESPONSES = {
  greet: {
    text: "Hello! 😊 I'm Layla, your Bejoice freight assistant. I can help with ocean freight, air cargo, heavy lift, Saudi customs, live market updates, and more. What can I help you with today?",
  },
  quote: {
    text: "I'd love to get you a quote! Bejoice offers competitive rates on Sea, Air, and Land freight worldwide — with special focus on Saudi Arabia & Gulf routes. 🚀\n\nOur quotes typically come back within the hour. Shall I open the quick quote form?",
    cta: { label: "Get Free Quote", action: "quote" },
  },
  air: {
    text: "✈️ **Air Freight with Bejoice:**\n\n• Express & standard air cargo\n• Partnerships with 40+ airlines including Saudia Cargo, Emirates SkyCargo, Qatar Airways Cargo\n• Door-to-door & airport-to-airport\n• Dangerous goods (DG) & pharma cold-chain certified\n• Transit times: Europe 2–3 days, Asia 1–2 days, USA 3–4 days\n\nCurrent air rates are elevated ~15–20% vs 2023 due to Red Sea ocean diversions driving demand to air. Want a tailored quote?",
    cta: { label: "Get Air Freight Quote", action: "quote" },
  },
  sea: {
    text: "🚢 **Ocean Freight with Bejoice:**\n\n• FCL & LCL services globally\n• Key lanes: Asia–KSA, Europe–KSA, USA–KSA & reverse\n• Partner carriers: MSC, Maersk, CMA CGM, Evergreen, COSCO\n• Ports: Jeddah Islamic Port, King Abdulaziz Port (Dammam), King Fahd Industrial Port\n\n⚠️ **Live Alert:** Red Sea / Suez Canal disruptions ongoing (2024–2025). Most vessels are rerouting via Cape of Good Hope, adding 10–14 days transit and 20–35% cost increase. Bejoice has secured alternative capacity — contact us for guaranteed slots!",
    cta: { label: "Get Ocean Freight Quote", action: "quote" },
  },
  heavy: {
    text: "🏗️ **Heavy Lift & Project Cargo:**\n\n• Single pieces up to 1,000+ metric tons\n• Specialized equipment: heavy-lift vessels, modular trailers, crawler cranes\n• Engineering & route surveys included\n• Experience: NEOM, Aramco, SABIC, Royal Commission projects\n• OOG (out-of-gauge) and breakbulk specialists\n\nBejoice is one of very few Saudi-based forwarders with in-house heavy-lift execution capability. What's your project?",
    cta: { label: "Discuss Your Project", action: "call" },
  },
  saudi: {
    text: "🇸🇦 **Saudi Arabia Logistics — Bejoice is Your Expert:**\n\n• **ZATCA compliant** customs clearance across all Saudi ports & dry ports\n• **Vision 2030** logistics partner — supporting NEOM, Red Sea Project, Qiddiya, Diriyah Gate\n• **SASO certification** handling for regulated goods\n• **VAT & AEO** advisory for importers\n• Saudi Landbridge: connecting Jeddah ↔ Riyadh ↔ Dammam by rail (SAR)\n• 15+ years operating in KSA with licensed Saudi customs brokers\n\nThe Saudi logistics market is growing at 8% CAGR (2024) driven by giga-projects. Want to talk to a Saudi specialist?",
    cta: { label: "Speak to Saudi Specialist", action: "call" },
  },
  market: {
    text: "📊 **Supply Chain Market Update (2025):**\n\n🔴 **Red Sea / Houthi Attacks:** 90%+ of vessels still avoiding Suez. Cape routing adds 10–14 days & $500–1,200/TEU premium. No clear resolution timeline.\n\n📈 **Freight Rates:** Ocean spot rates stabilizing after 2024 spike but still 40–60% above pre-crisis levels. Air cargo demand up 15% YoY.\n\n🇸🇦 **Saudi/Gulf:** Saudi ports handling record volumes. King Salman Dry Port (Riyadh) operational, easing Jeddah congestion.\n\n🌏 **China:** Post-Golden Week volumes surging. Rolling delays at Ningbo, Qingdao.\n\n✅ **Bejoice Solution:** We've pre-booked alternative capacity via Cape route and Gulf feeders to protect your supply chain. Ask us about guaranteed slots!",
    cta: { label: "Get Protected Capacity", action: "call" },
  },
  customs: {
    text: "🛃 **Customs & Compliance — Bejoice handles it all:**\n\n• Saudi customs clearance via FASAH platform (ZATCA)\n• AEO (Authorized Economic Operator) facilitation\n• HS code classification & duty optimization\n• Import permits: SASO, SFDA, MOMRA, MOE\n• Full document preparation: B/L, commercial invoice, packing list, CoO, Form A\n• Prohibited & restricted goods advisory\n• De-consolidation at all Saudi ports\n\nAverage Saudi customs clearance: 1–3 days with Bejoice. Want to know the duty rate for your commodity?",
    cta: { label: "Talk to Customs Expert", action: "call" },
  },
  warehousing: {
    text: "🏭 **Warehousing & Distribution:**\n\n• Strategically located warehouses in Riyadh, Jeddah & Dammam\n• Total capacity: 50,000+ sqm\n• Bonded & free-zone storage\n• Cold-chain (pharma, food) temperature-controlled facilities\n• Pick & pack, kitting, labeling, relabeling\n• Last-mile delivery across all 13 Saudi regions\n• 3PL integration with WMS systems (SAP, Oracle, etc.)\n\nNeed distribution across Saudi? We've got you covered from north to south.",
    cta: { label: "Get Warehousing Quote", action: "quote" },
  },
  tracking: {
    text: "📍 **Track Your Shipment:**\n\nYou can track your Bejoice shipment in real-time through our tracking portal. Just scroll up to the TrackCard on this page and enter your B/L or booking reference number.\n\nFor urgent status updates, our ops team is available 24/7. Want me to connect you directly?",
    cta: { label: "Talk to Ops Team", action: "call" },
  },
  insurance: {
    text: "🛡️ **Cargo Insurance:**\n\n• All-risk marine cargo insurance available\n• Coverage from door-to-door worldwide\n• Competitive premiums via Bejoice partner underwriters (Lloyd's, AXA, Allianz)\n• Instant certificate issuance\n• Claims support & survey management\n\nTypical premium: 0.1–0.3% of cargo value. Highly recommended for all high-value and fragile shipments. Want a quote?",
    cta: { label: "Get Insurance Quote", action: "quote" },
  },
  contact: {
    text: "I'd love to connect you with one of our freight experts! 🤝\n\nOur specialists cover: Ocean Freight, Air Cargo, Project & Heavy Lift, Saudi Customs, Warehousing & Distribution.\n\nBook a free 15-min consultation — no commitment, just expert advice.",
    cta: { label: "Book Free Consultation", action: "call" },
  },
  whoAreYou: {
    text: "I'm Layla — Bejoice's AI-powered freight assistant! 🤖✨\n\nI'm trained on global logistics, Saudi customs regulations, Red Sea market updates, and everything Bejoice offers. Think of me as your 24/7 shipping expert — always here, never on hold!\n\nHow can I help you today?",
  },
  howAreYou: {
    text: "I'm doing wonderfully, thank you for asking! 😊 Always energized and ready to help with freight and logistics.\n\nIs there something I can assist you with today — a quote, tracking, customs advice, or market updates?",
  },
  compliment: {
    text: "Aww, that's so kind of you — you've made my day! 😊✨\n\nI'm Layla, Bejoice's AI freight assistant, and I'm here to make your logistics experience just as delightful. Now, can I help you with a shipment, quote, or anything freight-related? 🚢✈️",
  },
  romantic: {
    text: "Ha! I'm truly flattered 😄💛 But I'm Layla — an AI dedicated entirely to freight and logistics. My heart belongs to supply chains and shipping routes!\n\nWhat I *can* do is find you the best rates, fastest routes, and smoothest customs experience. Shall we? 📦🌍",
  },
  negative: {
    text: "I'm sorry I didn't meet your expectations — I genuinely want to do better! 😔\n\nIf I missed something or gave an incomplete answer, please try asking again in a different way. Or if you'd prefer, I can connect you with a real Bejoice expert who can help you directly.",
    cta: { label: "Talk to a Human Expert", action: "call" },
  },
  thanks: {
    text: "You're so welcome! 😊 It was my pleasure to help.\n\nIf there's anything else you need — quotes, tracking, market updates, or customs advice — I'm always here. Have a wonderful day! 🌟",
  },
  fallback: {
    text: "That's a great question! 🤔 Our freight experts can give you a precise answer tailored to your shipment. Bejoice handles Sea, Air, Land, Heavy Lift & Project Cargo — with deep expertise in Saudi Arabia & the Gulf.\n\nShall I connect you with a specialist, or can you tell me more about your shipment?",
    cta: { label: "Talk to a Specialist", action: "call" },
  },
};

function getBotResponse(input) {
  const text = input.toLowerCase();
  for (const [key, keywords] of Object.entries(KB)) {
    if (keywords.some(kw => text.includes(kw))) {
      return RESPONSES[key] || RESPONSES.fallback;
    }
  }
  return RESPONSES.fallback;
}

// ── Keyframes injection ────────────────────────────────────────
const STYLE_ID = "ca-keyframes-premium";
if (typeof document !== "undefined" && !document.getElementById(STYLE_ID)) {
  const s = document.createElement("style");
  s.id = STYLE_ID;
  s.textContent = `
    @keyframes ca-wave {
      0%   { transform: rotate(0deg);   }
      15%  { transform: rotate(20deg);  }
      30%  { transform: rotate(-10deg); }
      45%  { transform: rotate(18deg);  }
      60%  { transform: rotate(-6deg);  }
      75%  { transform: rotate(12deg);  }
      100% { transform: rotate(0deg);   }
    }
    @keyframes ca-float {
      0%, 100% { transform: translateY(0px);  }
      50%       { transform: translateY(-5px); }
    }
    @keyframes ca-pulse-ring {
      0%   { transform: scale(1);   opacity: 0.5; }
      100% { transform: scale(1.55); opacity: 0;  }
    }
    @keyframes ca-shimmer-border {
      0%   { box-shadow: 0 0 0 3px rgba(200,168,78,0.55), 0 8px 32px rgba(0,0,0,0.6); }
      50%  { box-shadow: 0 0 0 3px rgba(232,204,122,0.85), 0 10px 40px rgba(200,168,78,0.2); }
      100% { box-shadow: 0 0 0 3px rgba(200,168,78,0.55), 0 8px 32px rgba(0,0,0,0.6); }
    }
    @keyframes ca-label-in {
      from { opacity: 0; transform: translateX(8px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    @keyframes ca-bubble-in {
      0%   { opacity: 0; transform: scale(0.85) translateY(8px); }
      100% { opacity: 1; transform: scale(1)    translateY(0);   }
    }
    @keyframes ca-msg-fade {
      0%   { opacity: 0; transform: translateY(5px);  }
      12%  { opacity: 1; transform: translateY(0);    }
      80%  { opacity: 1; transform: translateY(0);    }
      100% { opacity: 0; transform: translateY(-5px); }
    }
    @keyframes ca-panel-in {
      0%   { opacity: 0; transform: translateY(24px) scale(0.94); }
      100% { opacity: 1; transform: translateY(0)    scale(1);    }
    }
    @keyframes ca-dot-bounce {
      0%, 80%, 100% { transform: translateY(0);    }
      40%            { transform: translateY(-7px); }
    }
    @keyframes ca-slide-up {
      from { opacity: 0; transform: translateY(10px); }
      to   { opacity: 1; transform: translateY(0);    }
    }
    @keyframes ca-glow-pulse {
      0%, 100% { box-shadow: 0 0 28px 6px rgba(200,168,78,0.35), 0 8px 40px rgba(0,0,0,0.7); }
      50%      { box-shadow: 0 0 44px 12px rgba(200,168,78,0.55), 0 8px 40px rgba(0,0,0,0.7); }
    }
    @keyframes ca-badge-pop {
      0%   { transform: scale(0); }
      60%  { transform: scale(1.3); }
      100% { transform: scale(1); }
    }
    .ca-wave-hand { display: inline-block; animation: ca-wave 1.8s ease-in-out; transform-origin: 70% 80%; }
    .ca-wave-hand:hover { animation: ca-wave 0.8s ease-in-out infinite; }
    .ca-msgs::-webkit-scrollbar { width: 4px; }
    .ca-msgs::-webkit-scrollbar-thumb { background: rgba(200,168,78,0.2); border-radius: 4px; }
    .ca-msgs::-webkit-scrollbar-track { background: transparent; }
    .ca-input-field {
      flex: 1; background: rgba(255,255,255,0.05);
      border: 1px solid rgba(200,168,78,0.2); border-radius: 24px;
      color: #fff; font-family: 'DM Sans', sans-serif;
      font-size: 13px; padding: 10px 16px; outline: none;
      transition: border-color 0.2s;
    }
    .ca-input-field::placeholder { color: rgba(255,255,255,0.3); }
    .ca-input-field:focus { border-color: rgba(200,168,78,0.5); background: rgba(255,255,255,0.07); }
    .ca-send-btn {
      width: 40px; height: 40px; border-radius: 50%; flex-shrink: 0;
      background: linear-gradient(135deg, #e8cc7a, #c8a84e);
      border: none; cursor: pointer; display: flex; align-items: center; justify-content: center;
      color: #050508; transition: transform 0.2s, box-shadow 0.2s;
      box-shadow: 0 4px 14px rgba(200,168,78,0.4);
    }
    .ca-send-btn:hover { transform: scale(1.1) rotate(5deg); box-shadow: 0 6px 20px rgba(200,168,78,0.6); }
    .ca-send-btn:disabled { background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.2); box-shadow: none; cursor: default; transform: none; }
  `;
  document.head.appendChild(s);
}

export default function FloatingBookCTA() {
  const { openCalPopup } = useCalBooking();
  const [visible, setVisible]           = useState(true);
  const [open, setOpen]                 = useState(false);
  const [msgIndex, setMsgIndex]         = useState(0);
  const [showBubble, setShowBubble]     = useState(true);
  const [typing, setTyping]             = useState(false);
  const [waving, setWaving]             = useState(true);
  const [inputVal, setInputVal]         = useState("");
  const [unread, setUnread]             = useState(0);
  const [chatMessages, setChatMessages] = useState([
    { from: "bot", text: "Hi! I'm Layla, your Bejoice freight assistant 👋\n\nI can help with ocean & air freight rates, Saudi customs, Red Sea disruptions, project cargo, and more. What do you need today?" }
  ]);
  const chatEndRef  = useRef(null);
  const inputRef    = useRef(null);

  // Hide only near the very bottom (footer area)
  useEffect(() => {
    const onScroll = () => {
      const scrollY   = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const viewH     = window.innerHeight;
      setVisible(scrollY + viewH < docHeight - 200);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Cycle speech bubble
  useEffect(() => {
    if (open) return;
    const interval = setInterval(() => {
      setShowBubble(false);
      setTimeout(() => {
        setMsgIndex(i => (i + 1) % MESSAGES.length);
        setShowBubble(true);
      }, 400);
    }, 4000);
    return () => clearInterval(interval);
  }, [open]);

  // Wave periodically
  useEffect(() => {
    setWaving(true);
    const interval = setInterval(() => {
      setWaving(true);
      setTimeout(() => setWaving(false), 2000);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, typing]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  const addBotResponse = (response) => {
    setChatMessages(prev => [...prev, {
      from: "bot",
      text: response.text,
      cta: response.cta,
    }]);
    if (!open) setUnread(u => u + 1);
  };

  const sendMessage = (text) => {
    if (!text.trim()) return;
    setChatMessages(prev => [...prev, { from: "user", text: text.trim() }]);
    setInputVal("");
    setTyping(true);
    const delay = 900 + Math.random() * 600;
    setTimeout(() => {
      setTyping(false);
      addBotResponse(getBotResponse(text));
    }, delay);
  };

  const handleQuickReply = (action, label) => {
    setChatMessages(prev => [...prev, { from: "user", text: label }]);
    setTyping(true);
    const delay = 900 + Math.random() * 500;
    setTimeout(() => {
      setTyping(false);
      if (action === "call") {
        addBotResponse(RESPONSES.contact);
      } else if (RESPONSES[action]) {
        addBotResponse(RESPONSES[action]);
      } else {
        addBotResponse(RESPONSES.quote);
      }
    }, delay);
  };

  const handleCTA = (action) => {
    if (action === "call") {
      openCalPopup();
    } else {
      const el = document.getElementById("contact");
      if (el) {
        if (window.__lenis) window.__lenis.scrollTo(el, { offset: -80, duration: 1.6 });
        else el.scrollIntoView({ behavior: "smooth" });
      }
      setOpen(false);
    }
  };

  if (!visible) return null;

  return (
    <div style={{
      position: "fixed", bottom: 28, right: 28,
      zIndex: 9999,
      display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 14,
    }}>

      {/* ══════════════════════════════════════
          CHAT PANEL
      ══════════════════════════════════════ */}
      {open && (
        <div style={{
          width: 380,
          background: "linear-gradient(170deg, #0b1120 0%, #050508 100%)",
          border: "1px solid rgba(200,168,78,0.3)",
          borderRadius: 24,
          overflow: "visible",
          boxShadow: "0 32px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(200,168,78,0.12), 0 0 60px rgba(200,168,78,0.08)",
          animation: "ca-panel-in 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards",
          display: "flex", flexDirection: "column",
        }}>

          {/* ── Header ── */}
          <div style={{
            background: "linear-gradient(110deg, rgba(200,168,78,0.14) 0%, rgba(200,168,78,0.04) 100%)",
            borderBottom: "1px solid rgba(200,168,78,0.18)",
            padding: "16px 18px",
            display: "flex", alignItems: "center", gap: 12,
            flexShrink: 0,
          }}>
            <div style={{ position: "relative" }}>
              <Avatar size={52} />
              <div style={{
                position: "absolute", bottom: 1, right: 1,
                width: 12, height: 12, borderRadius: "50%",
                background: "#22c55e", border: "2.5px solid #050508",
                boxShadow: "0 0 8px rgba(34,197,94,0.7)",
              }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{
                color: "#fff", fontWeight: 700, fontSize: 15,
                fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.01em",
              }}>
                Layla <span style={{ color: "rgba(200,168,78,0.8)", fontSize: 12, fontWeight: 500 }}>· Bejoice AI</span>
              </div>
              <div style={{
                color: "#22c55e", fontSize: 11.5,
                fontFamily: "'DM Sans', sans-serif", marginTop: 2,
              }}>
                ● Online · Freight & Supply Chain Expert
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{
                background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.55)", cursor: "pointer",
                fontSize: 15, lineHeight: 1, padding: "5px 10px", borderRadius: 8,
                transition: "all 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.color = "rgba(255,255,255,0.55)"; }}
            >✕</button>
          </div>

          {/* ── Messages ── */}
          <div className="ca-msgs" style={{
            height: 360, overflowY: "scroll",
            padding: "16px 16px 10px",
            display: "flex", flexDirection: "column", gap: 12,
            flex: "none",
          }}>
            {chatMessages.map((msg, i) => (
              <div key={i} style={{
                animation: "ca-slide-up 0.3s ease forwards",
                display: "flex", flexDirection: "column",
                alignItems: msg.from === "bot" ? "flex-start" : "flex-end",
                gap: 7,
              }}>
                <div style={{
                  maxWidth: "88%",
                  background: msg.from === "bot"
                    ? "rgba(255,255,255,0.055)"
                    : "linear-gradient(135deg, #c8a84e, #a8843e)",
                  color: msg.from === "bot" ? "rgba(255,255,255,0.93)" : "#fff",
                  borderRadius: msg.from === "bot" ? "4px 16px 16px 16px" : "16px 4px 16px 16px",
                  padding: "10px 14px",
                  fontSize: 13.5,
                  fontFamily: "'DM Sans', sans-serif",
                  lineHeight: 1.6,
                  border: msg.from === "bot" ? "1px solid rgba(200,168,78,0.14)" : "none",
                  whiteSpace: "pre-wrap",
                }}>
                  {msg.text}
                </div>
                {msg.cta && (
                  <button
                    onClick={() => handleCTA(msg.cta.action)}
                    style={{
                      background: "linear-gradient(135deg, #f5d97a, #e8cc7a, #c8a84e)",
                      color: "#050508", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 12,
                      padding: "10px 20px", fontSize: 12, fontWeight: 900,
                      cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                      letterSpacing: "0.1em", textTransform: "uppercase",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.4)",
                      transition: "all 0.3s cubic-bezier(0.23, 1, 0.32, 1)",
                      position: 'relative', overflow: 'hidden',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1.5px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(200,168,78,0.4), 0 4px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.4)"; e.currentTarget.style.background = "linear-gradient(135deg, #fff2a8, #f5d97a, #e8cc7a)"; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.4)"; e.currentTarget.style.background = "linear-gradient(135deg, #f5d97a, #e8cc7a, #c8a84e)"; }}
                  >
                    <div className="btn-shine-overlay" />
                    {msg.cta.label} →
                  </button>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {typing && (
              <div style={{
                display: "flex", alignItems: "center", gap: 5,
                padding: "10px 14px",
                background: "rgba(255,255,255,0.055)",
                borderRadius: "4px 16px 16px 16px",
                width: "fit-content",
                border: "1px solid rgba(200,168,78,0.12)",
              }}>
                {[0, 1, 2].map(j => (
                  <div key={j} style={{
                    width: 7, height: 7, borderRadius: "50%",
                    background: "#c8a84e",
                    animation: `ca-dot-bounce 1.2s ease ${j * 0.2}s infinite`,
                  }} />
                ))}
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* ── Quick replies ── */}
          <div style={{
            padding: "8px 16px 10px",
            display: "flex", flexWrap: "wrap", gap: 7,
            borderTop: "1px solid rgba(200,168,78,0.1)",
            flexShrink: 0,
          }}>
            {QUICK_REPLIES.map(r => (
              <button
                key={r.label}
                onClick={() => handleQuickReply(r.action, r.label)}
                style={{
                  background: "rgba(200,168,78,0.07)", color: "#e8cc7a",
                  border: "1px solid rgba(200,168,78,0.22)", borderRadius: 22,
                  padding: "5px 12px", fontSize: 12, fontWeight: 600,
                  cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                  transition: "all 0.18s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(200,168,78,0.18)"; e.currentTarget.style.borderColor = "rgba(200,168,78,0.55)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(200,168,78,0.07)"; e.currentTarget.style.borderColor = "rgba(200,168,78,0.22)"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* ── Input bar ── */}
          <div style={{
            padding: "10px 16px 16px",
            display: "flex", alignItems: "center", gap: 10,
            borderTop: "1px solid rgba(255,255,255,0.05)",
            flexShrink: 0,
          }}>
            <input
              ref={inputRef}
              className="ca-input-field"
              placeholder="Ask about freight, rates, Saudi customs..."
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") sendMessage(inputVal); }}
            />
            <button
              className="ca-send-btn"
              onClick={() => sendMessage(inputVal)}
              disabled={!inputVal.trim()}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>

          {/* Powered-by footer */}
          <div style={{
            textAlign: "center", padding: "0 16px 12px",
            fontSize: 10.5, color: "rgba(255,255,255,0.22)",
            fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.08em",
          }}>
            BEJOICE AI · Freight Intelligence Engine
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════
          SPEECH BUBBLE (when closed)
      ══════════════════════════════════════ */}
      {!open && showBubble && (
        <div
          onClick={() => setOpen(true)}
          style={{
            background: "linear-gradient(135deg, rgba(12,14,26,0.96), rgba(5,5,8,0.98))",
            color: "#f0e6c8",
            border: "1px solid rgba(200,168,78,0.4)",
            borderRadius: "18px 18px 4px 18px",
            padding: "12px 18px",
            fontSize: 13.5, fontWeight: 500,
            fontFamily: "'DM Sans', sans-serif",
            maxWidth: 240,
            textAlign: "right",
            boxShadow: "0 10px 36px rgba(0,0,0,0.6), 0 0 0 1px rgba(200,168,78,0.1)",
            animation: "ca-bubble-in 0.4s ease forwards",
            lineHeight: 1.5, cursor: "pointer",
            backdropFilter: "blur(16px)",
          }}
        >
          <span style={{ animation: "ca-msg-fade 4s ease forwards", display: "block" }}>
            {MESSAGES[msgIndex]}
          </span>
        </div>
      )}

      {/* ══════════════════════════════════════
          AVATAR BUTTON
      ══════════════════════════════════════ */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>

        {/* ── Name label above avatar ── */}
        {!open && (
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
            animation: "ca-label-in 0.5s ease forwards",
            background: "rgba(5,5,8,0.72)",
            border: "1px solid rgba(200,168,78,0.3)",
            borderRadius: "12px",
            padding: "8px 16px",
            backdropFilter: "blur(12px)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
          }}>
            {/* Name */}
            <div style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 18, fontWeight: 900,
              letterSpacing: "0.28em",
              color: "#ffffff",
              textShadow: "0 0 20px rgba(255,255,255,0.6), 0 2px 8px rgba(0,0,0,0.8)",
              lineHeight: 1,
              textTransform: "uppercase",
            }}>
              LAYLA
            </div>
            {/* Subtitle with flanking lines */}
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <div style={{ width: 16, height: 1, background: "rgba(200,168,78,0.7)" }} />
              <span style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 9.5, fontWeight: 700,
                letterSpacing: "0.25em",
                color: "#e8cc7a",
                textTransform: "uppercase", lineHeight: 1,
              }}>Freight Expert</span>
              <div style={{ width: 16, height: 1, background: "rgba(200,168,78,0.7)" }} />
            </div>
          </div>
        )}

        {/* ── Avatar circle ── */}
        <div
          style={{ position: "relative", cursor: "pointer" }}
          onClick={() => setOpen(o => !o)}
        >
          {/* Single soft pulse ring */}
          {!open && (
            <div style={{
              position: "absolute", inset: -5, borderRadius: "50%",
              border: "1.5px solid rgba(200,168,78,0.45)",
              animation: "ca-pulse-ring 2.8s ease-out infinite",
              pointerEvents: "none",
            }} />
          )}

          {/* Floating + shimmer-border avatar */}
          <div style={{
            animation: open ? "none" : "ca-float 4s ease-in-out infinite",
            position: "relative",
          }}>
            <div style={{
              borderRadius: "50%",
              animation: open ? "none" : "ca-shimmer-border 3s ease-in-out infinite",
            }}>
              <Avatar size={112} />
            </div>

            {/* Unread badge */}
            {!open && unread > 0 && (
              <div style={{
                position: "absolute", top: -2, left: -2,
                width: 24, height: 24, borderRadius: "50%",
                background: "linear-gradient(135deg, #ef4444, #dc2626)",
                color: "#fff", fontSize: 12, fontWeight: 700,
                display: "flex", alignItems: "center", justifyContent: "center",
                border: "2px solid #050508",
                boxShadow: "0 2px 8px rgba(239,68,68,0.6)",
                animation: "ca-badge-pop 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards",
                fontFamily: "'DM Sans', sans-serif",
              }}>
                {unread}
              </div>
            )}

            {/* Online dot */}
            <div style={{
              position: "absolute", top: 7, right: 7,
              width: 16, height: 16, borderRadius: "50%",
              background: "#22c55e",
              border: "2.5px solid #050508",
              boxShadow: "0 0 8px rgba(34,197,94,0.7)",
            }} />
          </div>
        </div>
      </div>

    </div>
  );
}

// ── Avatar ────────────────────────────────────────────────────
function Avatar({ size }) {
  return (
    <div style={{
      width: size, height: size, flexShrink: 0,
      position: "relative",
      animation: "laylaFloat 3s ease-in-out infinite",
    }}>
      {/* Glow ring */}
      <div style={{
        position: "absolute", inset: -3,
        borderRadius: "50%",
        border: "2px solid rgba(200,168,78,0.55)",
        boxShadow: "0 0 18px rgba(200,168,78,0.4), inset 0 0 12px rgba(200,168,78,0.15)",
        animation: "laylaRingPulse 2.4s ease-in-out infinite",
        zIndex: 2,
        pointerEvents: "none",
      }} />
      {/* Image */}
      <div style={{
        width: size, height: size, borderRadius: "50%",
        overflow: "hidden",
        background: "linear-gradient(135deg, #0d1a2e, #06101c)",
        border: "1.5px solid rgba(200,168,78,0.3)",
        position: "relative", zIndex: 1,
      }}>
        <img
          src="/ai-assistant-female.png"
          alt="Layla — Bejoice AI"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
        {/* Scanlines overlay */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.12) 3px, rgba(0,0,0,0.12) 4px)",
          borderRadius: "50%",
          pointerEvents: "none",
        }} />
      </div>
      <style>{`
        @keyframes laylaFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        @keyframes laylaRingPulse {
          0%, 100% { opacity: 0.7; box-shadow: 0 0 14px rgba(200,168,78,0.35), inset 0 0 10px rgba(200,168,78,0.1); }
          50% { opacity: 1; box-shadow: 0 0 26px rgba(200,168,78,0.65), inset 0 0 18px rgba(200,168,78,0.2); }
        }
      `}</style>
    </div>
  );
}
