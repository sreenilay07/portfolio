export const projectsData = [
  {
    id: "sree-ai",
    title: "SREE AI",
    tagline: "AI-Powered Stock Market Analysis Platform",
    description: "An NLP-based stock market analyzer enabling users to perform deep stock research and receive instant buy/sell recommendations using natural language queries.",
    image: "/sree_ai.png",
    githubUrl: "https://github.com/sreenilay07/SREE.AI",
    liveUrl: "https://sree-ai.vercel.app/",
    tech: ["React", "Node.js", "TypeScript", "AI APIs", "Financial APIs", "Tailwind CSS"],
    features: [
      "NLP Query Processing for financial data",
      "Dynamic Buy/Sell/Hold Recommendations",
      "Personalized Portfolio Risk Analysis",
      "Real-time Market Insights & News Aggregator",
      "Interactive Financial Charts & Metrics"
    ],
    caseStudy: {
      problem: "Traditional stock analysis tools are overly complex, requiring users to navigate complex charts, financial sheets, and jargon. Average investors struggle to extract direct answers to simple queries like 'Should I buy Apple stock right now based on its last earnings report?'",
      solution: "SREE AI bridges this gap by combining LLMs (Large Language Models) with real-time financial APIs. It parses natural language questions, pulls the latest balance sheets, cash flow statements, and price charts, and runs them through a custom reasoning engine to provide clean, actionable recommendations.",
      challenges: [
        "Handling low-latency data fetching and blending multiple API streams in real-time.",
        "Engineering precise prompts to avoid financial hallucination in LLM outputs.",
        "Rendering responsive, high-performance financial charts on mobile layouts."
      ],
      architecture: "Built with a modern decoupled structure. The frontend is powered by React and TypeScript for bulletproof type-safety, utilizing Tailwind CSS for a glassmorphic dashboard. The Node.js backend operates as a middleware that securely queries financial data sources and pipes structured contexts into Gemini and Claude APIs, returning structured JSON directly to the frontend."
    }
  },
  {
    id: "easy-code",
    title: "Easy Code",
    tagline: "AI-Assisted Multi-Language Coding Platform",
    description: "An intelligent web-based coding environment featuring real-time AI-powered debugging, code explanation, and guided learning assistance.",
    image: "/easy_code.png",
    githubUrl: "https://github.com/sreenilayreddybackup/easycode",
    liveUrl: "https://easycode-tau.vercel.app/",
    tech: ["React", "Node.js", "TypeScript", "Groq APIs", "Monaco Editor", "Tailwind CSS"],
    features: [
      "Instant AI Debugging with detailed syntax & logical error pinpointing",
      "Line-by-line AI Code Explanations in simple terms",
      "Multi-Language Support (Python, JavaScript, Java, C++, and more)",
      "Intelligent compiler error parsing and fix recommendations"
    ],
    caseStudy: {
      problem: "Beginner developers often spend hours stuck on cryptic compiler errors and syntax mistakes. Default compiler errors fail to explain *why* an error occurred or *how* to write the solution, hindering student learning and slowing down development.",
      solution: "Easy Code integrates a professional code editor (Monaco) with high-speed Groq LLaMA-3 APIs. When a compilation or syntax error is encountered, the platform immediately intercepts the error stream and provides an interactive sidebar explaining the error and showing a visual git-diff of how to fix it.",
      challenges: [
        "Integrating Monaco Editor in a fully responsive React context.",
        "Optimizing LLM response times to under 500ms using Groq API streaming solutions.",
        "Structuring compiler sandboxes for safe execution of multiple languages."
      ],
      architecture: "Designed as a client-first application. It uses Monaco Editor for standard editing capabilities. Clicking 'Debug' packages the code, active language, and errors (if any) and sends them to a Node.js API gateway. The backend utilizes Groq's high-speed inference endpoints to return instant debugging feedback, maintaining low latency and extreme responsiveness."
    }
  },
  {
    id: "trinetra",
    title: "TRINETRA",
    tagline: "AI-Powered Online Examination & Proctoring Platform",
    description: "A secure, next-generation examination portal with automated real-time proctoring, face-mesh tracking, and cheating violation alerts.",
    image: "/trinetra.png",
    githubUrl: "https://github.com/sreenilay07/Trinetra",
    liveUrl: "https://trinetra-seven.vercel.app/",
    tech: ["React", "Node.js", "MongoDB", "TensorFlow.js", "Socket.io", "Tailwind CSS"],
    features: [
      "Real-Time Video Proctoring running directly on the client browser",
      "TensorFlow.js Face & Eye tracking for off-screen gaze detection",
      "Live Proctor Admin Dashboard showing real-time violation logs",
      "Secure Exam Lock & Fullscreen monitoring",
      "Socket.io bi-directional messaging for active proctor alerts"
    ],
    caseStudy: {
      problem: "Online education platforms struggle to maintain exam integrity without intrusive, high-cost human proctoring. Cheating remains easy, and standard proctoring software is heavy, resource-intensive, and violates user privacy by streaming entire video feeds to remote servers.",
      solution: "TRINETRA performs on-device, client-side AI analysis using lightweight TensorFlow.js models. It tracks eye movement, face presence, and tab switching directly on the student's browser. Instead of streaming video, it only sends lightweight event alerts via WebSockets (Socket.io) to the supervisor's dashboard when a violation occurs.",
      challenges: [
        "Optimizing TensorFlow.js models to run smoothly at 30fps on low-spec hardware without overheating mobile/laptop CPUs.",
        "Establishing stable WebSocket connection recovery for students with spotty internet connections.",
        "Preventing bypasses in browser fullscreen detection APIs."
      ],
      architecture: "Built on the MERN stack with Socket.io. The frontend runs object detection and face-mesh tracking in web workers to avoid blocking the main UI thread. It communicates via WebSockets to a Node.js/Express server. The backend logs violations to MongoDB and broadcasts real-time alerts to the active Examiner interface, allowing supervisors to send warnings or force-submit exams remotely."
    }
  }
];
