'use client';

import { useKeyboardNav } from '@/hooks/useKeyboardNav';
import { Mail, MessageSquare, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSpring, animated, config } from '@react-spring/web';
import emailjs from '@emailjs/browser';

export default function Contact() {
  useKeyboardNav();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  // Initialize EmailJS
  useEffect(() => {
    emailjs.init('_wY5aajq4Kb3QguKO');
  }, []);

  const formFieldsSpring = useSpring({
    opacity: submitted ? 0 : 1,
    config: { tension: 200, friction: 25 },
  });

  const successSpring = useSpring({
    opacity: submitted ? 1 : 0,
    scale: submitted ? 1 : 0.9,
    config: { tension: 200, friction: 25 },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const now = new Date();
      const time = now.toLocaleTimeString();


      const response = await emailjs.send(
        'service_i977fd6',
        'template_7astiue',
        {
          name: formData.name,
          email: formData.email,
          time: time,
          subject: formData.message.substring(0, 50),
          message: formData.message,
          from_name: formData.name,
          from_email: formData.email,
        }
      );
      // EmailJS returns status 200 on success
      setSubmitted(true);

      // Reset form after 3 seconds
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: '', email: '', message: '' });
        setLoading(false);
      }, 3000);
    } catch (error: any) {
      console.error('Failed to send email:', error);
      setLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen py-16 sm:py-20 px-4 sm:px-6 md:px-8 flex items-center">
      <div className="max-w-2xl mx-auto w-full z-10 relative">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4">Contact</h1>
        <p className="text-sm sm:text-base text-foreground/60 mb-8 sm:mb-12">
          Let's collaborate! I'm always interested in new projects and opportunities. Feel free to reach out.
        </p>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="relative">
          {!submitted && (
            <animated.div style={formFieldsSpring} className="space-y-4 sm:space-y-6">
              <div>
                <label htmlFor="name" className="block text-xs sm:text-sm font-medium mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 border border-foreground/20 rounded-lg bg-background focus:outline-none focus:border-foreground/50 transition-colors disabled:opacity-50"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 border border-foreground/20 rounded-lg bg-background focus:outline-none focus:border-foreground/50 transition-colors disabled:opacity-50"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 border border-foreground/20 rounded-lg bg-background focus:outline-none focus:border-foreground/50 transition-colors resize-none disabled:opacity-50"
                  placeholder="Your message here..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </animated.div>
          )}

          {submitted && (
            <animated.div
              style={{
                opacity: successSpring.opacity,
                scale: successSpring.scale,
              }}
              className="flex items-center justify-center min-h-96 bg-foreground/10 rounded-lg border border-foreground/20"
            >
              <div className="flex flex-col items-center gap-4">
                <Check className="w-16 h-16 text-foreground stroke-[1.5]" />
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
                  <p className="text-foreground/60">
                    Thank you for reaching out. I'll get back to you soon.
                  </p>
                </div>
              </div>
            </animated.div>
          )}
        </form>

        {/* Quick Contact Info */}
        <div className="pt-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start gap-4">
              <Mail className="w-6 h-6 text-foreground/60 mt-1 shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Email</h3>
                <a href="mailto:iteshxt@gmail.com" className="text-foreground/60 hover:text-foreground transition-colors">
                  iteshxt@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <MessageSquare className="w-6 h-6 text-foreground/60 mt-1 shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Response Time</h3>
                <p className="text-foreground/60">
                  I typically respond within 24-48 hours
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-12 p-6 bg-foreground/5 rounded-lg border border-foreground/10">
          <p className="text-sm text-foreground/60 text-center">
            You can also connect with me through the social links on the left sidebar
          </p>
        </div>
      </div>
    </section>
  );
}
