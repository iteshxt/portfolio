'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useKeyboardNav } from '@/hooks/useKeyboardNav';
import { useTheme } from '@/hooks/useTheme';
import { portfolioData } from '@/data/portfolio';
import { getTechIcon } from '@/lib/techIcons';
import { Github, ExternalLink } from 'lucide-react';
import { useEffect, useState } from 'react';
import Script from 'next/script';
import { generateProjectSchema, generateBreadcrumbSchema } from '@/lib/seo';

export default function Projects() {
  useKeyboardNav();
  const { theme, mounted } = useTheme();
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  const handleImageLoad = (imageName: string) => {
    setLoadedImages((prev) => new Set([...prev, imageName]));
  };

  // Generate breadcrumb schema
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://iteshxt.me' },
    { name: 'Projects', url: 'https://iteshxt.me/projects' },
  ]);

  return (
    <section className="relative min-h-screen py-16 sm:py-20 px-4 sm:px-6 md:px-8">
      <div className="max-w-5xl mx-auto z-10 relative">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4">Projects</h1>
        <p className="text-sm sm:text-base text-foreground/60 mb-12 sm:mb-16">
          Featured projects and other works I'm proud of
        </p>

        {/* Featured Projects Section */}
        <div className="mb-16 sm:mb-24">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-8 sm:mb-12">Featured</h2>
          <div className="space-y-12 sm:space-y-16">
            {portfolioData.projects.featured.map((project, idx) => (
              <div
                key={project.id}
                className={`grid grid-cols-1 md:grid-cols-2 md:gap-8 md:items-center ${
                  idx % 2 === 1 ? 'md:grid-flow-dense' : ''
                }`}
              >
                {/* Content */}
                <div className={`${idx % 2 === 1 ? 'md:col-start-2' : ''}`}>
                  {/* Mobile Image - Float left for book-like layout */}
                  <div className="md:hidden float-left mr-4 mb-4 flex-shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-lg overflow-hidden border border-foreground/10">
                    <div className="relative w-full h-full">
                      <Image
                        src={`/projects/${project.image}`}
                        alt={project.title}
                        fill
                        className="object-cover"
                        priority={idx === 0}
                      />
                    </div>
                  </div>

                  {/* Text Content - Flows around floated image */}
                  <div>
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3">{project.title}</h3>
                    
                    <p className="text-xs sm:text-sm md:text-base text-foreground/70 mb-4">
                      {project.description}
                    </p>

                    {/* Highlights */}
                    <ul className="space-y-2 mb-6">
                      {project.highlights.map((highlight, idx) => (
                        <li key={idx} className="text-foreground/70 text-sm flex items-start gap-2">
                          <span className="text-foreground/40 mt-1">•</span>
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Role */}
                    <p className="text-sm text-foreground/60 mb-4 italic">
                      {/* Role: {project.role} */}
                    </p>

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-2 mb-6 clear-left md:clear-none">
                      {project.technologies.map((tech) => {
                        const IconComponent = getTechIcon(tech);
                        return (
                          <div
                            key={tech}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-foreground/10 rounded text-xs font-medium hover:bg-foreground/20 transition-colors"
                            title={tech}
                          >
                            {IconComponent && <IconComponent className="w-3.5 h-3.5" />}
                            <span>{tech}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Links */}
                    <div className="flex items-center gap-4 clear-left md:clear-none">
                      <Link
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-foreground/20 hover:bg-foreground/10 transition-colors"
                      >
                        <Github className="w-4 h-4" />
                        <span className="text-sm font-medium">GitHub</span>
                      </Link>
                      {project.liveLink && (
                        <Link
                          href={project.liveLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-foreground/20 hover:bg-foreground/10 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span className="text-sm font-medium">Live</span>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>

                {/* Image Section - Desktop Only */}
                <div className={`hidden md:block md:rounded-lg md:aspect-square md:overflow-hidden md:border md:border-foreground/10 ${
                  idx % 2 === 1 ? 'md:col-start-1' : ''
                }`}>
                  <div className="relative w-full h-full">
                    <Image
                      src={`/projects/${project.image}`}
                      alt={project.title}
                      fill
                      className="object-cover"
                      priority={idx === 0}
                      onLoad={() => handleImageLoad(project.image)}
                    />
                    {/* Gradient Loading Screen Placeholder - Only show while loading */}
                    {!loadedImages.has(project.image) && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <style>{`
                          @keyframes shimmer {
                            0% {
                              background-position: -1000px 0;
                            }
                            100% {
                              background-position: 1000px 0;
                            }
                          }
                          html.dark .shimmer-bg {
                            background: linear-gradient(
                              90deg,
                              rgba(139, 92, 246, 0.4) 0%,
                              rgba(59, 130, 246, 0.4) 25%,
                              rgba(34, 211, 238, 0.4) 50%,
                              rgba(59, 130, 246, 0.4) 75%,
                              rgba(139, 92, 246, 0.4) 100%
                            );
                            background-size: 1000px 100%;
                            animation: shimmer 3s infinite;
                          }
                          html.light .shimmer-bg {
                            background: linear-gradient(
                              90deg,
                              rgba(147, 51, 234, 0.25) 0%,
                              rgba(66, 133, 244, 0.25) 25%,
                              rgba(15, 157, 209, 0.25) 50%,
                              rgba(66, 133, 244, 0.25) 75%,
                              rgba(147, 51, 234, 0.25) 100%
                            );
                            background-size: 1000px 100%;
                            animation: shimmer 3s infinite;
                          }
                        `}</style>
                        <div className="absolute inset-0 shimmer-bg"></div>
                        <div className="relative z-10 flex flex-col items-center gap-3">
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Other Projects Section */}
        <div>
          <h2 className="text-3xl font-semibold mb-12">Other Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {portfolioData.projects.other.map((project) => (
              <div
                key={project.id}
                className="bg-foreground/5 rounded-lg p-6 hover:bg-foreground/10 transition-colors border border-foreground/10 hover:border-foreground/20"
              >
                {/* Title with Icon */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="relative w-6 h-6 shrink-0">
                    <Image
                      src={`/icons/${project.image}`}
                      alt={project.title}
                      width={24}
                      height={24}
                      className="object-contain"
                      onError={(e) => {
                        // Fallback if icon doesn't exist
                        const target = e.currentTarget;
                        target.style.display = 'none';
                        if (target.nextElementSibling) {
                          (target.nextElementSibling as HTMLElement).style.display = 'inline';
                        }
                      }}
                    />
                    {/* Icon placeholder */}
                    <span className="absolute inset-0 text-lg leading-6 hidden">📦</span>
                  </div>
                  <h3 className="text-lg font-bold">{project.title}</h3>
                </div>

                <p className="text-foreground/70 text-sm mb-4">
                  {project.description}
                </p>

                {/* Technologies */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.technologies.map((tech) => {
                    const IconComponent = getTechIcon(tech);
                    return (
                      <div
                        key={tech}
                        className="flex items-center gap-1 px-2 py-1 bg-foreground/10 rounded text-xs font-medium hover:bg-foreground/20 transition-colors"
                        title={tech}
                      >
                        {IconComponent && <IconComponent className="w-3 h-3" />}
                        <span>{tech}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Links */}
                <div className="flex items-center gap-3 pt-4 border-t border-foreground/10">
                  <Link
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-8 h-8 rounded hover:bg-foreground/20 transition-colors text-foreground/70 hover:text-foreground"
                    title="GitHub"
                  >
                    <Github className="w-4 h-4" />
                  </Link>
                  {project.liveLink && (
                    <Link
                      href={project.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-8 h-8 rounded hover:bg-foreground/20 transition-colors text-foreground/70 hover:text-foreground"
                      title="Live Preview"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
