export const personalInfo = {
  firstName: "Itesh",
  lastName: "Tomar",
  fullName: "Itesh Singh Tomar",
  role: "Software Developer",
  description: "Aspiring Software Developer and Tech Enthusiast with real-world experience in full-stack development, AI integration, and automation. Building innovative solutions one coffee at a time.",
  location: "Noida, Uttar Pradesh, India",
  email: "iteshxt@gmail.com",
  phone: "+91 6262803216",
  github: "https://github.com/iteshxt",
  linkedin: "https://linkedin.com/in/iteshxt",
  leetcode: "https://leetcode.com/iteshxt",
  twitter: "https://twitter.com/iteshxt",
  instagram: "https://instagram.com/purplysalt",
  resumeLink: "/document/resume.pdf",
};

export const navigationLinks = [
  { id: "home", name: "Home", href: "/" },
  { id: "experience", name: "Experience", href: "/experience" },
  { id: "projects", name: "Projects", href: "/projects" },
  { id: "contact", name: "Contact", href: "/contact" },
];

export const skills = {
  technical: [
    "Python",
    "Java",
    "C++",
    "JavaScript",
    "React.js", 
    "Node.js", 
    "TypeScript", 
    "HTML5/CSS3", 
    "Tailwind CSS", 
    "MongoDB",
    "Git",
    "SQL",
    "Next.js"
  ],
  softSkills: [
    "Problem Solving",
    "Technical Leadership", 
    "Team Collaboration",
    "Project Management",
    "Critical Thinking",
    "Communication"
  ]
};

export const experience = [
  {
    id: 1,
    title: "Full-Stack Web Developer",
    company: "Sutr Clothing (sutr.store)",
    location: "Remote",
    date: "April 2024 - Present",
    description: [
      "Currently developing a full-fledged e-commerce website for Sutr Clothing, a traditional fashion brand, using React.js for the frontend, Node.js for the backend, MongoDB for the database, and Tailwind CSS for styling.",
      "Building core website pages from scratch, including the Homepage, Product Page, Shop Page, Cart, Login, Signup, and Purchase pages, while ensuring clean UI/UX and smooth user navigation.",
      "Working on responsive layouts, reusable components, and user-friendly design that adapts well to both desktop and mobile screens.",
      "Collaborating with the client to align the technical structure with the brand's identity and business needs, while planning backend features such as order management, user authentication, and payment handling.",
      "Using Vercel for live deployment and continuous integration to test and publish changes during development."
    ],
    technologies: ["Next.js", "MongoDB", "Tailwind CSS", "Razorpay", "Firebase", "Vercel", "Git"]
  }
];

export const projects = [
  
  {
    id: "sutr-clothing",
    title: "Sutr Clothing",
    description: "A modern e-commerce website for a clothing brand, featuring product browsing, shopping cart functionality, user authentication, and secure checkout process.",
    technologies: ["TypeScript", "Next.js", "React.js", "Tailwind CSS", "JavaScript"],
    github: "https://github.com/iteshxt/sutr.store",
    demo: "https://sutr.store",
    image: "/projects/sutr-clothing/image.png",
    details: [
      "Built with Next.js and TypeScript for optimal performance and type safety",
      "Implemented responsive design with Tailwind CSS for a seamless experience across all devices",
      "Created modern UI components for product browsing and shopping experience",
      "Integrated secure payment processing with Razorpay for seamless transactions",
      "Implemented user authentication and account management system",
      "Built comprehensive admin dashboard for inventory and order management",
      "Deployed on Vercel for reliable hosting with automatic scaling"
    ]
  },
  {
    id: "dia-therapist",
    title: "Dia Therapist",
    description: "An AI-powered therapist tailored specifically for Gen Z users. Provides mental health support, conversation, and resources in a format that resonates with younger audiences.",
    technologies: ["TypeScript", "Next.js", "React.js", "CSS", "AI Integration"],
    github: "https://github.com/DiaLabs/dia-therapist",
    demo: "https://dia-therapist.vercel.app",
    image: "/projects/dia-therapist/preview.jpg",
    details: [
      "Created a responsive, modern user interface designed specifically for Gen Z users",
      "Implemented advanced natural language processing for therapeutic conversations",
      "Built with Next.js and TypeScript for optimal performance and type safety",
      "Integrated AI conversation engine with context-aware responses",
      "Designed user-friendly chat interface with emotional state tracking",
      "Implemented privacy-focused architecture with secure data handling",
      "Added resource library with mental health guides and coping strategies",
      "Deployed on Vercel for reliable hosting and automatic scaling"
    ]
  },

  {
    id: "dia-moderator",
    title: "Dia Moderator",
    description: "A comprehensive multi-platform content moderation system for Discord, WhatsApp, and Telegram. It automatically warns, bans, and educates users on the fly based on customizable rules while keeping things fun and under control.",
    technologies: ["JavaScript", "React.js", "Node.js", "Discord.js", "Whatsapp-web.js", "Telegram Bot API", "Google Gemini AI"],
    github: "https://github.com/DiaLabs/dia-moderator",
    demo: "https://dia-moderator.up.railway.app/",
    image: "/projects/dia-moderator/preview.jpg",
    details: [
      "Built with a modern architecture featuring a React frontend and Node.js backend",
      "Integrated with multiple messaging platforms (Discord, WhatsApp, Telegram) from a single interface",
      "Implemented AI-powered interactions using Google's Gemini for natural language conversations",
      "Created a robust warning system with configurable thresholds for different violation types",
      "Designed a centralized dashboard to monitor all bots with real-time updates"
    ]
  },
  {
    id: "velo-rapido",
    title: "Velo Rapido",
    description: "A comprehensive web-based bike rental management system designed to streamline the process of renting bicycles, scooters, and motorcycles. Features intuitive interfaces for both customers and administrators.",
    technologies: ["PHP", "MySQL", "Tailwind CSS", "JavaScript", "Leaflet.js"],
    github: "https://github.com/iteshxt/velo-rapido",
    demo: "https://velo-rapido-demo.netlify.app",
    image: "/projects/velo-rapido/preview.jpg",
    details: [
      "Developed secure user registration and authentication system",
      "Created comprehensive admin features for fleet management, reservation tracking, and analytics",
      "Implemented map functionality using Leaflet.js for location-based services",
      "Built responsive web interface with Tailwind CSS for optimal user experience",
      "Integrated real-time availability tracking for bike inventory management",
      "Developed payment processing system with multiple payment options",
      "Created detailed reporting system for business analytics and insights",
      "Designed a complete database schema with tables for users, bikes, reservations, payments, and maintenance"
    ]
  },
  {
    id: "lpu-wifi-automate-login",
    title: "LPU WiFi Auto-Login",
    description: "A utility tool that automates the tedious process of logging into LPU WiFi network. Includes both a Python script and Chrome extension to save time and reduce hassle for university students.",
    technologies: ["JavaScript", "Python", "HTML", "CSS", "Chrome Extension API", "Selenium"],
    github: "https://github.com/iteshxt/lpu-wifi-automate-login",
    demo: "https://github.com/iteshxt/lpu-wifi-automate-login/releases/tag/v1.2",
    image: "/projects/lpu-wifi/preview.jpg",
    details: [
      "Built a Chrome extension for one-click login to campus WiFi",
      "Created a Python automation script using Selenium for background login",
      "Implemented secure credential storage with proper encryption",
      "Designed cross-platform compatibility for Windows, macOS, and Linux",
      "Added automatic network detection and connection features",
      "Built user-friendly interface with minimal configuration required",
      "Implemented error handling and retry mechanisms for connection failures",
      "Created comprehensive documentation and installation guides",
      "Designed the solution to run automatically at system startup"
    ]
  }
];

export const about = {
  title: "About Me",
  description: [
    "I am an aspiring Full Stack Developer currently pursuing a Bachelor's in Computer Science & Engineering at Lovely Professional University. I'm passionate about building modern web applications using React.js, Node.js, and emerging technologies.",
    "With hands-on experience in full-stack development, AI integration, and automation, I enjoy creating solutions that solve real-world problems. My projects range from content moderation systems to e-commerce platforms.",
    "I'm actively learning and building projects to strengthen my skills in the JavaScript/TypeScript ecosystem, with a particular interest in the intersection of software engineering and artificial intelligence.",
    "I'm committed to writing clean, maintainable code and staying current with industry trends. When I'm not coding, I explore new technologies, contribute to open-source projects, and work on personal projects that challenge me to grow."
  ]
};

export const education = [
  {
    id: 1,
    degree: "Bachelors in Computer Science & Engineering",
    institution: "Lovely Professional University",
    location: "Phagwara, Punjab, India",
    date: "2023-Present",
    description: "Pursuing a Bachelor's degree with a focus on software development, algorithms, and data structures. Expected graduation in 2027.",
    grade: "8.48 CGPA"
  }
];