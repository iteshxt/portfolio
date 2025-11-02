import { Metadata } from 'next';

const BASE_URL = 'https://iteshxt.me';
const AUTHOR_NAME = 'Itesh Tomar';
const AUTHOR_EMAIL = 'iteshxt@gmail.com';
const SOCIAL_IMAGE = `${BASE_URL}/og-image.jpg`;
const TWITTER_HANDLE = '@iteshxt';

export const SEO_CONFIG = {
    baseUrl: BASE_URL,
    author: AUTHOR_NAME,
    email: AUTHOR_EMAIL,
    twitter: TWITTER_HANDLE,
};

export function generatePageMetadata({
    title,
    description,
    path = '/',
    image = SOCIAL_IMAGE,
    keywords = [],
    noindex = false,
    type = 'website',
}: {
    title: string;
    description: string;
    path?: string;
    image?: string;
    keywords?: string[];
    noindex?: boolean;
    type?: 'website' | 'article';
}): Metadata {
    const url = `${BASE_URL}${path}`;
    const canonicalUrl = new URL(path, BASE_URL).toString();

    return {
        title,
        description,
        keywords: [
            ...keywords,
    "Itesh Tomar",
    "iteshxt",
    "Itesh Singh Tomar",
    "Itesh Software Engineer",
    "Itesh Tomar LPU",
    "Itesh Noida",
    "Itesh CSE",
    "Itesh Tomar Portfolio",
    "Itesh Tomar Projects",
    "Itesh Tomar Blog",
    "Itesh Tomar Experience",
    "Itesh Tomar AI",
    "Itesh Tomar Machine Learning",
    "Itesh Tomar Next.js",
    "Itesh Tomar React",
    "Itesh Tomar Node.js",
    "Itesh Tomar TypeScript",
    "Itesh Singh Tomar Portfolio",
    "Itesh Singh Tomar Projects",
    "Itesh Singh Tomar Blog",
    "Itesh Singh Tomar Experience",
    "Itesh Singh Tomar AI",
    "Itesh Singh Tomar Machine Learning",
    "Itesh Singh Tomar Next.js",
    "Itesh Singh Tomar React",
    "Itesh Singh Tomar Node.js",
    "Itesh Singh Tomar TypeScript", 
    "Itesh linkedin",
    "Itesh github",
    "Itesh twitter",
    "Itesh developer",
    "Itesh programmer",
    "Itesh web developer",
    "Itesh full-stack developer",
    "Itesh AI engineer",
    "Itesh ML engineer",
    "Itesh software developer",
    "Itesh tech blog",
    "Itesh coding",
    "Itesh open source",
    "Itesh freelance developer",
    "Itesh portfolio website",
    "Itesh personal website",
    "iteshxt portfolio",
    "iteshxt projects",
    "iteshxt blog",
    "iteshxt experience",
    "iteshxt AI",
    "iteshxt github",
    "iteshxt linkedin",
    "iteshxt twitter"
        ],
        authors: [{ name: AUTHOR_NAME, url: BASE_URL }],
        creator: AUTHOR_NAME,
        publisher: AUTHOR_NAME,
        metadataBase: new URL(BASE_URL),
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: {
            type: type as any,
            locale: 'en_US',
            url,
            siteName: `${AUTHOR_NAME}'s Portfolio`,
            title,
            description,
            images: [
                {
                    url: image,
                    width: 1200,
                    height: 630,
                    alt: title,
                    type: 'image/jpeg',
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            site: TWITTER_HANDLE,
            creator: TWITTER_HANDLE,
            title,
            description,
            images: [image],
        },
        robots: {
            index: !noindex,
            follow: !noindex,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1,
            googleBot: {
                index: !noindex,
                follow: !noindex,
                'max-image-preview': 'large',
                'max-snippet': -1,
                'max-video-preview': -1,
            },
        },
        verification: {
            // Add your Google Search Console verification code
            google: 'google-site-verification=uQaQArZGAIcmonr0Bs1gNyFSQdls9d27YUeNwtiv2x0',
        },
    };
}

export const generatePersonSchema = () => ({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: AUTHOR_NAME,
    url: BASE_URL,
    image: SOCIAL_IMAGE,
    email: AUTHOR_EMAIL,
    jobTitle: 'Software Developer',
    sameAs: [
        'https://github.com/iteshxt',
        'https://linkedin.com/in/iteshxt',
        'https://twitter.com/iteshxt',
    ],
    worksFor: {
        '@type': 'Organization',
        name: 'Self-employed',
    },
    knowsAbout: [
        'Full-stack Web Development',
        'React.js',
        'Next.js',
        'Node.js',
        'AI/ML',
        'Python',
        'TypeScript',
        'MongoDB',
        'Firebase',
        'Django',
        'REST APIs',
        'Machine Learning',
        'Data Science',
        'Artificial Intelligence',
        'Natural Language Processing',
        'Computer Vision',
        
    ],
});

export const generateWebsiteSchema = () => ({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: `${AUTHOR_NAME}'s Portfolio`,
    description: 'Full-stack developer crafting interactive web experiences with AI/ML expertise',
    url: BASE_URL,
    image: SOCIAL_IMAGE,
    creator: {
        '@type': 'Person',
        name: AUTHOR_NAME,
        url: BASE_URL,
    },
    potentialAction: {
        '@type': 'SearchAction',
        target: `${BASE_URL}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
    },
});

export const generateProjectSchema = (project: {
    title: string;
    description: string;
    image?: string;
    github?: string;
    liveLink?: string;
}) => ({
    '@context': 'https://schema.org',
    '@type': 'SoftwareSourceCode',
    name: project.title,
    description: project.description,
    image: project.image,
    codeRepository: project.github,
    url: project.liveLink,
    creator: {
        '@type': 'Person',
        name: AUTHOR_NAME,
    },
});

export const generateBreadcrumbSchema = (items: { name: string; url: string }[]) => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url,
    })),
});
