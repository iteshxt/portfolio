export const portfolioData = {
    // Hero Section
    hero: {
        greeting: "Hello, I'm Itesh",
        description: "Full-stack developer passionate about building beautiful and functional web experiences.",
        cta: {
            primary: { text: "View My Work", href: "/projects" },
            secondary: { text: "Get In Touch", href: "/contact" },
        },
    },

    // Experience Section
    experience: [
        {
            id: 1,
            title: "Full Stack Developer (Freelance)",
            company: "Sutr Clothing",
            companyWebsite: "https://sutr.store",
            duration: "April 2025 – Present",
            location: "Remote",
            description: "Building a full-stack e-commerce website using Next.js, MongoDB, Firebase, Razorpay API, and Ekart API.",
            responsibilities: [
                "Building a full-stack e-commerce website using Next.js, MongoDB, Firebase, Razorpay API, and Ekart API",
                "Implemented secure payments (Razorpay) and logistics tracking (Ekart)",
                "Designed and deployed an Admin Dashboard for product, order, and user management",
                "Developed responsive and scalable UI with Next.js and Tailwind CSS",
            ],
            technologies: ["Next.js", "MongoDB", "Firebase", "Razorpay API", "Ekart API", "Tailwind CSS"],
        },
    ],

    // Skills Section
    skills: {
        languages: ["Python", "JavaScript", "TypeScript", "Java", "C++"],
        frontend: ["React.js", "Next.js", "HTML5/CSS3", "Tailwind CSS"],
        backend: ["Node.js", "Express.js", "Flask", "FastAPI"],
        aiml: ["HuggingFace Transformers", "PyTorch", "NLP", "Model Fine-Tuning"],
        databases: ["MongoDB", "Firebase", "MySQL", "SQL"],
        tools: ["Git", "Docker", "REST APIs", "Railway", "Vercel", "AWS"],
        soft: ["Problem Solving", "Technical Leadership", "Team Collaboration", "Project Management", "Critical Thinking", "Communication"],
    },

    // Projects Section
    projects: {
        featured: [
            {
                id: 1,
                title: "Dia Therapist",
                image: "dia-therapist.jpg",
                description: "A custom-built AI therapist powered by a fine-tuned Qwen 2.5 7B Instruct model trained on therapy-focused dataset for empathetic conversations. Features Flask backend, real-time chat integration, voice-enabled mental health support with Whisper for speech-to-text and Kokoro for expressive text-to-speech, enabling fully voice-based therapeutic interactions.",
                technologies: ["Qwen 2.5 7B", "Flask", "Whisper", "Kokoro", "Python", "Next.js", "Tailwind"],
                highlights: [
                    "Custom-trained conversational LLM on therapy-focused dataset",
                    "Real-time voice input/output for seamless interactions",
                    "Context-aware empathetic response generation",
                    "Fully voice-enabled mental health assistant"
                ],
                role: "Full-stack developer & custom model trainer",
                github: "https://github.com/iteshxt/dia-therapist",
                liveLink: "https://chatwithdia.vercel.app",
            },
            {
                id: 2,
                title: "Sutr Clothing",
                image: "sutr-clothing.jpg",
                description: "A full-stack modern e-commerce platform for apparel built with Next.js, MongoDB, Firebase, Razorpay API, and Ekart API. Features secure payments with Razorpay integration, real-time logistics tracking via Ekart, comprehensive Admin Dashboard for product/order/user management, and responsive scalable UI with Tailwind CSS.",
                technologies: ["Next.js", "MongoDB", "Firebase", "Razorpay API", "Ekart API", "Tailwind CSS"],
                highlights: [
                    "Secure payment processing with Razorpay integration",
                    "Real-time order tracking and delivery integration via Ekart",
                    "Comprehensive Admin Dashboard for inventory and order management",
                    "Responsive and scalable architecture with modern practices"
                ],
                role: "Full-stack developer & system architect",
                github: "https://github.com/iteshxt/sutr.store",
                liveLink: "https://sutr.store",
            },
            {
                id: 3,
                title: "Dia Moderator",
                image: "dia-moderator.jpg",
                description: "A comprehensive multi-platform content moderation system for Discord, WhatsApp, and Telegram. Features automatic profanity filtering, spam protection, progressive warning system, and AI-powered interactions via Google Gemini for message summarization and context-aware responses. Includes centralized web dashboard with real-time updates and QR code authentication.",
                technologies: ["Node.js", "React", "Express", "Google Gemini API", "Discord.js", "Telegram Bot API", "WhatsApp Web"],
                highlights: [
                    "Cross-platform moderation from single interface",
                    "AI-powered message summarization and natural conversations",
                    "Real-time dashboard with bot status monitoring",
                    "QR code authentication for WhatsApp with auto-refresh"
                ],
                role: "Full-stack development & AI integration",
                github: "https://github.com/iteshxt/dia-moderator",
                liveLink: "https://dia-moderator.vercel.app",
            },
            {
                id: 4,
                title: "FitCheckr",
                image: "fitcheckr.png",
                description: "An AI-powered virtual try-on application that uses Google's gemini-2.5-flash-image model for realistic clothing visualization. Features drag-and-drop uploads, real-time image processing, glassmorphism UI design, social media sharing, downloadable results, mobile-responsive design, and PWA-ready architecture for confident online shopping.",
                technologies: ["Next.js", "React.js", "TypeScript", "Tailwind CSS", "Google Gemini AI"],
                highlights: [
                    "Advanced Google Gemini AI for realistic virtual try-on",
                    "Real-time image processing with loading indicators",
                    "Drag-and-drop file uploads for photos and clothing items",
                    "Social sharing and downloadable results with Chrome Extension support"
                ],
                role: "Full-stack developer & AI integration specialist",
                github: "https://github.com/iteshxt/fitcheckr",
                liveLink: "https://fitcheckr.vercel.app",
            },
        ],
        other: [
            {
                id: 5,
                title: "NomNom",
                image: "nom-nom.ico",
                description: "A modern, production-ready e-canteen mobile app that features full authentication (email/password and Google Sign-In), dynamic menu system with categories, interactive shopping cart, seamless checkout with address management, complete order history, and light/dark theme support with elegant animations.",
                technologies: ["Flutter", "Dart", "Firebase", "Cloud Firestore", "Provider", "animate_do"],
                github: "https://github.com/iteshxt/nomnom",
                liveLink: "https://github.com/iteshxt/NomNom-App/releases/",
            },
            {
                id: 6,
                title: "Ukie's Universe",
                image: "untillifoundyou.ico",
                description: "A personal/pet project that presents an interactive, themed 'universe' site. Features retro/8-bit visual style, Framer Motion animations, lightweight password-style auth gate, optional background music, and interactive pages including terminal, match game, compliments, and universe map.",
                technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
                github: "https://github.com/iteshxt/ukies-universe",
                liveLink: "https://untillifoundyou.vercel.app",
            },
            {
                id: 7,
                title: "Velo Rapido",
                image: "velo-rapido.ico",
                description: "A comprehensive bike rental management system that features user bike browsing, reservations, online payments (card/COD/UPI), admin dashboard for bike/user/maintenance management, damage reporting system, dual role access (user and admin), and dark/light theme support with SSL security.",
                technologies: ["PHP", "MySQL", "HTML5", "CSS3", "JavaScript", "Tailwind CSS"],
                github: "https://github.com/iteshxt/velo-rapido",
                liveLink: "https://velo-rapido.wuazu.com",
            },
            {
                id: 8,
                title: "Cooksy",
                image: "cooksy.ico",
                description: "A modern recipe discovery platform that features recipe browsing by categories/cuisines, powerful search functionality, detailed recipe views with ingredients and instructions, favorite recipe saving with LocalStorage, video tutorials, and fully responsive design for desktop, tablet, and mobile.",
                technologies: ["React.js", "CSS3", "Lucide React", "TheMealDB API", "LocalStorage"],
                github: "https://github.com/iteshxt/cooksy",
                liveLink: "https://cooksy-recepies.vercel.app",
            },
            {
                id: 9,
                title: "LPU Wi-Fi Auto Login",
                image: "lpu-wifi-autologin.ico",
                description: "A dual-version Wi-Fi automation tool available as both a Python script and Chrome Extension. Python version uses automated credential-based login with Windows startup integration. Chrome Extension v1.2 provides seamless auto-login with locally stored secure credentials, tested with Chrome 140+.",
                technologies: ["Python", "Selenium", "Chrome Extension", "JavaScript", "Local Storage"],
                github: "https://github.com/iteshxt/lpu-wifi-autologin",
                liveLink: "https://github.com/iteshxt/lpu-wifi-automate-login/releases",
            },
        ],
    },

    // Writings/Blog Section
    writings: [
        {
            id: 1,
            title: "Getting Started with Next.js",
            excerpt: "Learn the basics of Next.js and how to build your first application.",
            content: "Full blog post content here...",
            date: "2024-01-15",
            readTime: "5 min read",
            tags: ["Next.js", "React", "Tutorial"],
        },
        {
            id: 2,
            title: "Web Performance Optimization Tips",
            excerpt: "Essential tips for optimizing your web applications for speed and performance.",
            content: "Full blog post content here...",
            date: "2024-01-10",
            readTime: "8 min read",
            tags: ["Performance", "Optimization", "Web Development"],
        },
        {
            id: 3,
            title: "Understanding TypeScript Generics",
            excerpt: "A deep dive into TypeScript generics and how to use them effectively.",
            content: "Full blog post content here...",
            date: "2024-01-05",
            readTime: "12 min read",
            tags: ["TypeScript", "Advanced", "Best Practices"],
        },
    ],

    // Contact Section
    contact: {
        email: "iteshxt@gmail.com",
        phone: "+91 XXXXXXXXXX",
        location: "Your Location",
        message:
            "Feel free to reach out! I'm always interested in hearing about new projects and opportunities.",
        socialLinks: {
            github: "https://github.com/iteshxt",
            linkedin: "https://linkedin.com/in/iteshxt",
            twitter: "https://twitter.com/iteshxt",
            email: "mailto:iteshxt@gmail.com",
        },
    },

    // Additional Info
    about: {
        bio: "I'm a full-stack developer with a passion for creating beautiful and functional web experiences. With expertise in modern web technologies, I help businesses bring their ideas to life.",
        interests: ["Web Development", "UI/UX Design", "Open Source", "Teaching"],
    },
};
