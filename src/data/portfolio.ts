export const portfolioData = {
    // Hero Section
    hero: {
        greeting: "Hello, I'm Itesh",
        description: "Crafting digital experiences with code & creativity",
        cta: {
            primary: { text: "View My Work", href: "/projects" },
            secondary: { text: "Get In Touch", href: "/contact" },
        },
    },

    // Experience Section
    experience: [
        {
            id: 1,
            title: "Full Stack Developer",
            company: "Sutr Clothing",
            companyWebsite: "https://sutr.store",
            duration: "Apr 2025 – Nov 2025",
            location: "Remote",
            description: "I led the architectural evolution of Sutr's digital storefront, transforming a conceptual design into a high-stakes, production-ready microservices powerhouse. By engineering a seamless nexus between Razorpay's financial layer and Ekart's logistics network, I architected a system that flawlessly scaled to serve hundreds of customers monthly. My work centered on ensuring that complex e-commerce logic remained invisible to the user, delivering a pixel-perfect interface where technical robustness and elegant design met with absolute stability.",
            technologies: ["MERN Stack", "Firebase", "Razorpay", "Ekart", "Next.js", "Tailwind CSS"],
        },
    ],

    // Education Section
    education: [
        {
            id: 1,
            degree: "B. Tech - Computer Science & Engineering",
            institution: "Lovely Professional University",
            duration: "Aug 2023 – Jun 2027",
            location: "Phagwara, Punjab",
            score: "CGPA: 8.53",
        },
        {
            id: 2,
            degree: "Intermediate",
            institution: "Kiddys Corner Hr Sec School",
            duration: "Apr 2021 – Mar 2022",
            location: "Gwalior, Madhya Pradesh",
            score: "Percentage: 78",
        },
        {
            id: 3,
            degree: "Matriculation",
            institution: "Amar Public School",
            duration: "Apr 2019 – Mar 2020",
            location: "Gwalior, Madhya Pradesh",
            score: "Percentage: 90",
        },
    ],

    // Certificates Section
    certificates: [
        {
            id: 1,
            title: "Mobile Application Development using Flutter",
            issuer: "Cipher Schools",
            date: "Jul 2025",
            link: "https://www.cipherschools.com/certificate/preview?id=687e15067efd6d5090703c18",
        },
        {
            id: 2,
            title: "Cloud Computing",
            issuer: "NPTEL",
            date: "Apr 2025",
            link: "https://archive.nptel.ac.in/noc/Ecertificate/?q=NPTEL25CS11S133730033704237102",
        },
        {
            id: 3,
            title: "Computer Communications Specialization",
            issuer: "Coursera",
            date: "Oct 2024",
            link: "https://coursera.org/verify/specialization/JFN3Z245HGHK",
        },
    ],

    // Skills Section
    skills: {
        languages: ["Python", "JavaScript", "Java", "C++"],
        stack: ["MERN Stack", "Next.js", "Tailwind CSS"],
        aiml: ["PyTorch", "TensorFlow", "Fine-Tuning (LoRA, PEFT)", "RAG"],
        tools: ["GitHub", "Docker", "Vercel", "AWS", "Linux"],
    },

    // Projects Section
    projects: {
        featured: [
            {
                id: 1,
                title: "DiaChat",
                subtitle: "Fine-Tuned LLM for Gen Z",
                description: "I engineered a personality-driven conversational powerhouse designed to speak the language of Gen Z with genuine empathy. By fine-tuning Gemma-3 1B with PyTorch and Unsloth, I achieved blazing-fast 40 tokens/sec stream responses. The true innovation lies in its on-device deployment—using WebGPU and WebAssembly to run full LLM inference directly in the browser, ensuring absolute privacy and low-latency interaction without a backend.",
                image: "/projects/diachat.png",
                accentColor: "#DEA32E", // Golden yellow from the UI
                titleAccentLength: 4,     // "Chat" part
                technologies: ["PyTorch", "Huggingface", "Next.js", "WebGPU", "WebAssembly", "MERN Stack"],
                github: "https://github.com/DiaLabs/dia-chat",
                live: "https://diachat.vercel.app",
            },
            {
                id: 2,
                title: "FitCheckr",
                subtitle: "AI Virtual Try-On Ecosystem",
                description: "I revolutionized the e-commerce shopping experience by building an AI-powered virtual try-on system. Leveraging Gemini 2.5 Flash-Image API, I developed a lightning-fast pipeline that delivers real-time garment previews in under 3 seconds. I also shipped a dedicated Chrome extension that integrates secure service interfaces directly into major marketplaces, bridging the gap between browsing and buying with instant AI previews.",
                image: "/projects/fitcheckr.png",
                accentColor: "#813C3C", // Reddish-brown 
                titleAccentLength: 6,     // "Checkr" part
                technologies: ["Next.js", "Node.js", "Gemini", "REST API", "Tailwind CSS"],
                github: "https://github.com/iteshxt/fitcheckr",
                live: "https://fitcheckr.vercel.app",
            },
            {
                id: 3,
                title: "DiaMod",
                subtitle: "Cross-Platform AI Moderation",
                description: "I architected a unified command center for digital community management, spanning Discord, WhatsApp, and Telegram. This microservices-based system automates complex moderation workflows—from spam detection to contextual summarization via Gemini—while maintaining a high-security posture with encrypted QR-based authentication. It's a scalable solution for consistent policy enforcement across fragmented social ecosystems.",
                image: "/projects/diamod.png",
                accentColor: "#22C55E", // Security green from the UI
                titleAccentLength: 3,     // "Mod" part
                technologies: ["Python", "Gemini", "Microservices", "JWT", "MERN Stack", "REST API"],
                github: "https://github.com/DiaLabs/dia-mod",
                live: "https://diamod.vercel.app",
            },
        ],
        other: [
            {
                id: 5,
                title: "UniBites",
                image: "unibites.ico",
                description: "A modern, production-ready e-canteen mobile app that features full authentication, dynamic menu system, interactive shopping cart, and seamless checkout with elegant animations.",
                technologies: ["Flutter", "Firebase", "Provider"],
                github: "https://github.com/iteshxt/UniBites",
                live: "https://github.com/iteshxt/UniBites/releases/",
            },
            {
                id: 6,
                title: "Ukie's Universe",
                image: "untillifoundyou.ico",
                description: "A personal/pet project that presents an interactive, themed 'universe' site with retro visual style and Framer Motion animations.",
                technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
                github: "https://github.com/iteshxt/ukies-universe",
                live: "https://untillifoundyou.vercel.app",
            },
            {
                id: 7,
                title: "Velo Rapido",
                image: "velo-rapido.ico",
                description: "A comprehensive bike rental management system with reservations, online payments, and admin dashboard.",
                technologies: ["PHP", "MySQL", "Tailwind CSS"],
                github: "https://github.com/iteshxt/velo-rapido",
                live: "https://velo-rapido.wuazu.com",
            },
            {
                id: 8,
                title: "Cooksy",
                image: "cooksy.ico",
                description: "A modern recipe discovery platform that features recipe browsing by categories/cuisines, search functionality, and detailed recipe views.",
                technologies: ["React.js", "CSS3", "Lucide React", "LocalStorage"],
                github: "https://github.com/iteshxt/cooksy",
                live: "https://cooksy-recipes.vercel.app",
            },
            {
                id: 9,
                title: "LPU Wi-Fi Auto Login",
                image: "lpu-wifi-autologin.ico",
                description: "A dual-version Wi-Fi automation tool (Python & Chrome Extension) for seamless credential-based login with locally stored secure credentials.",
                technologies: ["Python", "Selenium", "Chrome Extension", "JavaScript"],
                github: "https://github.com/iteshxt/lpu-wifi-automate-login",
                live: "https://github.com/iteshxt/lpu-wifi-automate-login/releases",
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
        phone: "+91 6262803216",
        location: "Noida, Uttar Pradesh, India",
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
