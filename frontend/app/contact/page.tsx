import { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';
import { Mail, Clock, ShieldCheck, MapPin, Sparkles, HelpCircle, Terminal } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact the Editorial Desk',
  description: 'Submit technical pitches, inquire about partnerships, or contact the LuminaPress editorial and engineering team.',
};

export default function ContactPage() {
  const contactChannels = [
    {
      icon: Mail,
      title: 'Editorial Submissions & Pitches',
      email: 'editorial@luminapress.dev',
      description: 'Send article drafts, research outlines, or pitch topics directly to our lead editors.',
    },
    {
      icon: Terminal,
      title: 'Technical & Strapi Integration',
      email: 'engineering@luminapress.dev',
      description: 'Report bugs, inquire regarding headless CMS schemas, or discuss open-source tooling.',
    },
    {
      icon: ShieldCheck,
      title: 'Press & Media Inquiries',
      email: 'press@luminapress.dev',
      description: 'For conference speaking engagements, brand collaborations, and podcast appearances.',
    },
  ];

  const faqs = [
    {
      q: 'What criteria must technical submissions meet?',
      a: 'Articles must include real, reproducible code snippets, concrete architectural diagrams, and direct benchmark references. We focus heavily on Next.js, Strapi CMS, AI agents, and distributed cloud systems.',
    },
    {
      q: 'How does the Strapi CMS integration operate?',
      a: 'Our frontend consumes Strapi 5 Content APIs via typed Next.js fetch clients with revalidation tags. Editorial staff can preview drafts in real-time before pushing to the edge CDN.',
    },
    {
      q: 'What is your typical turnaround time for review?',
      a: 'Our review team responds to all verified pitches within 48 business hours with constructive editorial notes and next steps.',
    },
  ];

  return (
    <div className="relative min-h-screen py-12 lg:py-20">
      {/* Background ambient lighting */}
      <div className="ambient-glow bg-indigo-600/15 top-20 right-1/4" />
      <div className="ambient-glow bg-cyan-600/10 top-96 left-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Get In Touch</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Connect with Our <span className="gradient-text-primary">Editorial Team</span>
          </h1>

          <p className="text-zinc-300 text-base sm:text-lg mt-4 leading-relaxed">
            Have a technical paper to submit, an architectural question, or feedback on our publication? We would love to hear from you.
          </p>
        </div>

        {/* Form and Channels Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-24 items-start">
          {/* Form */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>

          {/* Direct Channels & Details */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="p-8 rounded-3xl glass-panel border border-white/[0.08] flex flex-col gap-6 shadow-xl">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                  Direct Inquiries
                </span>
                <h3 className="text-xl font-bold text-white mt-1">Contact Channels</h3>
              </div>

              <div className="flex flex-col gap-6">
                {contactChannels.map((c) => (
                  <div key={c.title} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.1] text-indigo-400 flex items-center justify-center flex-shrink-0">
                      <c.icon className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-white">{c.title}</span>
                      <a
                        href={`mailto:${c.email}`}
                        className="text-xs text-indigo-400 hover:underline my-0.5"
                      >
                        {c.email}
                      </a>
                      <span className="text-xs text-zinc-400 leading-relaxed">{c.description}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Office & SLA */}
              <div className="pt-6 border-t border-white/[0.08] flex flex-col gap-3 text-xs text-zinc-400">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Average response time: <strong>Within 24-48 business hours</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span>San Francisco, CA & Distributed Global Editorial Team</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQs Section */}
        <div className="max-w-4xl mx-auto pt-12 border-t border-white/[0.08]">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-2">
              <HelpCircle className="w-4 h-4" /> Frequently Asked Questions
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Everything You Need to Know About Contributing
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {faqs.map((faq) => (
              <div
                key={faq.q}
                className="p-6 rounded-2xl glass-panel border border-white/[0.08] flex flex-col gap-3"
              >
                <h4 className="text-sm font-bold text-white leading-snug">{faq.q}</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
