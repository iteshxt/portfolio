'use client';

import { useKeyboardNav } from '@/hooks/useKeyboardNav';
import { portfolioData } from '@/data/portfolio';
import { getTechIcon } from '@/lib/techIcons';

export default function Experience() {
  useKeyboardNav();

  return (
    <section className="relative min-h-screen py-16 sm:py-20 px-4 sm:px-6 md:px-8">
      <div className="max-w-4xl mx-auto z-10 relative">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4">Experience</h1>
        <p className="text-sm sm:text-base text-foreground/60 mb-10 sm:mb-16">
          My professional journey and skills
        </p>

        <div className="space-y-10 sm:space-y-12">
          {portfolioData.experience.map((job) => (
            <div key={job.id} className="border-l-2 border-foreground/20 pl-4 sm:pl-8 py-4">
              <h3 className="text-xl sm:text-2xl font-semibold mb-2">{job.title}</h3>
              <p className="text-xs sm:text-sm text-foreground/60 mb-2 break-words">
                {job.company} • {job.duration} {job.location && `• ${job.location}`}
              </p>
              <p className="text-xs sm:text-sm text-foreground/70 mb-4">
                {job.description}
              </p>
              
              {job.responsibilities && job.responsibilities.length > 0 && (
                <ul className="space-y-2 mb-4">
                  {job.responsibilities.map((responsibility, idx) => (
                    <li key={idx} className="text-xs sm:text-sm text-foreground/70 flex items-start gap-3">
                      <span className="text-foreground/40 mt-1 flex-shrink-0">●</span>
                      <span>{responsibility}</span>
                    </li>
                  ))}
                </ul>
              )}

              {job.technologies && (
                <div className="flex flex-wrap gap-3 mt-4">
                  {job.technologies.map((tech) => {
                    const IconComponent = getTechIcon(tech);
                    return (
                      <div
                        key={tech}
                        className="flex items-center gap-2 px-3 py-1.5 bg-foreground/10 rounded-lg text-sm font-medium hover:bg-foreground/20 transition-colors"
                        title={tech}
                      >
                        {IconComponent && (
                          <IconComponent className="w-4 h-4" />
                        )}
                        <span>{tech}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-16 sm:mt-20 pt-10 sm:pt-12 border-t border-foreground/10">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-6 sm:mb-8">Technical Skills</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            {/* Languages */}
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base text-foreground">Languages</h4>
              <div className="flex flex-wrap gap-2">
                {portfolioData.skills.languages?.map((skill) => {
                  const IconComponent = getTechIcon(skill);
                  return (
                    <div
                      key={skill}
                      className="flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-foreground/10 rounded-full text-xs sm:text-sm hover:bg-foreground/20 transition-colors"
                      title={skill}
                    >
                      {IconComponent && (
                        <IconComponent className="w-3 h-3 sm:w-4 sm:h-4" />
                      )}
                      <span>{skill}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Frontend */}
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base text-foreground">Frontend</h4>
              <div className="flex flex-wrap gap-2">
                {portfolioData.skills.frontend?.map((skill) => {
                  const IconComponent = getTechIcon(skill);
                  return (
                    <div
                      key={skill}
                      className="flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-foreground/10 rounded-full text-xs sm:text-sm hover:bg-foreground/20 transition-colors"
                      title={skill}
                    >
                      {IconComponent && (
                        <IconComponent className="w-3 h-3 sm:w-4 sm:h-4" />
                      )}
                      <span>{skill}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Backend */}
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Backend</h4>
              <div className="flex flex-wrap gap-2">
                {portfolioData.skills.backend?.map((skill) => {
                  const IconComponent = getTechIcon(skill);
                  return (
                    <div
                      key={skill}
                      className="flex items-center gap-2 px-3 py-1.5 bg-foreground/10 rounded-full text-sm hover:bg-foreground/20 transition-colors"
                      title={skill}
                    >
                      {IconComponent && (
                        <IconComponent className="w-4 h-4" />
                      )}
                      <span>{skill}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Databases */}
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Databases</h4>
              <div className="flex flex-wrap gap-2">
                {portfolioData.skills.databases?.map((skill) => {
                  const IconComponent = getTechIcon(skill);
                  return (
                    <div
                      key={skill}
                      className="flex items-center gap-2 px-3 py-1.5 bg-foreground/10 rounded-full text-sm hover:bg-foreground/20 transition-colors"
                      title={skill}
                    >
                      {IconComponent && (
                        <IconComponent className="w-4 h-4" />
                      )}
                      <span>{skill}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* AI/ML */}
            <div>
              <h4 className="font-semibold mb-4 text-foreground">AI/ML</h4>
              <div className="flex flex-wrap gap-2">
                {portfolioData.skills.aiml?.map((skill) => {
                  const IconComponent = getTechIcon(skill);
                  return (
                    <div
                      key={skill}
                      className="flex items-center gap-2 px-3 py-1.5 bg-foreground/10 rounded-full text-sm hover:bg-foreground/20 transition-colors"
                      title={skill}
                    >
                      {IconComponent && (
                        <IconComponent className="w-4 h-4" />
                      )}
                      <span>{skill}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tools */}
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Tools & Platforms</h4>
              <div className="flex flex-wrap gap-2">
                {portfolioData.skills.tools?.map((skill) => {
                  const IconComponent = getTechIcon(skill);
                  return (
                    <div
                      key={skill}
                      className="flex items-center gap-2 px-3 py-1.5 bg-foreground/10 rounded-full text-sm hover:bg-foreground/20 transition-colors"
                      title={skill}
                    >
                      {IconComponent && (
                        <IconComponent className="w-4 h-4" />
                      )}
                      <span>{skill}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Soft Skills */}
            <div className="md:col-span-2">
              <h4 className="font-semibold mb-4 text-foreground">Soft Skills</h4>
              <div className="flex flex-wrap gap-2">
                {portfolioData.skills.soft?.map((skill) => (
                  <div
                    key={skill}
                    className="flex items-center gap-2 px-3 py-1.5 bg-foreground/10 rounded-full text-sm hover:bg-foreground/20 transition-colors"
                    title={skill}
                  >
                    <span>{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
