// Icon mapping for technologies and skills
import {
  SiNextdotjs,
  SiMongodb,
  SiFirebase,
  SiTailwindcss,
  SiReact,
  SiTypescript,
  SiNodedotjs,
  SiExpress,
  SiPostgresql,
  SiGit,
  SiDocker,
  SiFigma,
  SiAmazon,
  SiFlutter,
  SiPython,
  SiFlask,
  SiFastapi,
  SiJavascript,
  SiTensorflow,
  SiSelenium,
  SiGooglemaps,
  SiGithub,
  SiLinkedin,
  SiHtml5,
  SiCss3,
  SiCplusplus,
  SiMysql,
  SiRailway,
  SiVercel,
  SiPytorch
} from 'react-icons/si';

export const technologyIcons: Record<string, any> = {
  // Languages
  Python: SiPython,
  JavaScript: SiJavascript,
  TypeScript: SiTypescript,
  
  'C++': SiCplusplus,

  // Frontend
  'React.js': SiReact,
  React: SiReact,
  'Next.js': SiNextdotjs,
  'HTML5/CSS3': SiHtml5,
  'Tailwind CSS': SiTailwindcss,
  HTML: SiHtml5,
  HTML5: SiHtml5,
  CSS: SiCss3,
  CSS3: SiCss3,
  
  // Backend
  'Node.js': SiNodedotjs,
  'Express.js': SiExpress,
  Express: SiExpress,
  Flask: SiFlask,
  FastAPI: SiFastapi,
  
  // Databases
  MongoDB: SiMongodb,
  Firebase: SiFirebase,
  MySQL: SiMysql,
  SQL: SiMysql,
  PostgreSQL: SiPostgresql,
  
  // AI/ML
  'HuggingFace Transformers': SiPython,
  Transformers: SiPython,
  PyTorch: SiPytorch,
  NLP: SiPython,
  'Model Fine-Tuning': SiPython,
  TensorFlow: SiTensorflow,
  'TensorFlow.js': SiTensorflow,
  BERT: SiPython,
  Whisper: SiPython,
  
  // Mobile
  Flutter: SiFlutter,
  
  // APIs & Services
  'Razorpay': SiAmazon,
  'Razorpay API': SiAmazon,
  'Ekart API': SiAmazon,
  'Google Maps API': SiGooglemaps,
  'Google Maps': SiGooglemaps,
  'REST APIs': SiAmazon,
  
  // Tools & Platforms
  Git: SiGit,
  Docker: SiDocker,
  Railway: SiRailway,
  Vercel: SiVercel,
  AWS: SiAmazon,
  Figma: SiFigma,
  Requests: SiPython,
  Selenium: SiSelenium,
  Kokoro: SiPython,
  GitHub: SiGithub,
  LinkedIn: SiLinkedin,
};

export const getTechIcon = (techName: string) => {
  return technologyIcons[techName] || null;
};
