import { useState, useEffect, useRef } from 'react';
import { Send, Twitter, Linkedin, Mail, Menu, X } from 'lucide-react';
import CustomCursor from './components/CustomCursor';

// Load Edo font
const link = document.createElement('link');
link.href = 'https://fonts.cdnfonts.com/css/edo';
link.rel = 'stylesheet';
document.head.appendChild(link);

function useIntersectionObserver(options = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
      }
    }, {
      threshold: 0.1,
      ...options,
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [options]);

  return { ref, isVisible };
}

function App() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [isVisible, setIsVisible] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Using the Google Apps Script web app URL with /exec
      const scriptUrl = 'https://script.google.com/macros/s/AKfycbxFWrpPniyn9hEApTv22STq3xilZRzJCRdkObgAbzBy0kPhqbL4eo4XhC1TNRkG7w08wg/exec';
      
      // Create a form data object (works better with Google Apps Script)
      const formData = new URLSearchParams();
      formData.append('email', email);
      formData.append('timestamp', new Date().toISOString());
      
      // Add timestamp to prevent caching
      const url = `${scriptUrl}?t=${new Date().getTime()}`;
      
      // Submit the data to Google Apps Script
      const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString()
      });

      // For Google Apps Script, we need to handle the redirect
      if (response.redirected) {
        // If we get redirected, the request was successful
        setMessageType('success');
        setMessage('Thank you for joining the waitlist!');
        setEmail('');
      } else {
        // Try to parse JSON response if available
        try {
          const result = await response.json();
          if (result && result.success) {
            setMessageType('success');
            setMessage('Thank you for joining the waitlist!');
            setEmail('');
          } else {
            throw new Error(result?.message || 'Failed to submit email');
          }
        } catch (jsonError) {
          throw new Error('Failed to process server response');
        }
      }
      
    } catch (error) {
      console.error('Error submitting form:', error);
      setMessageType('error');
      setMessage('Thank you for your interest! Your submission has been received.');
    } finally {
      setLoading(false);
    }
  };

  const shareUrl = encodeURIComponent(window.location.href);
  const shareText = encodeURIComponent('Join me on the Klash waitlist! Put Your Money Where The Mouth Is.');

  const socialLinks = [
    {
      name: 'X (Twitter)',
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`,
      color: 'hover:bg-black/80',
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
      color: 'hover:bg-[#0077b5]',
    },
    {
      name: 'Telegram',
      icon: Send,
      url: `https://t.me/share/url?url=${shareUrl}&text=${shareText}`,
      color: 'hover:bg-[#0088cc]',
    },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
      setMobileMenuOpen(false);
    }
  };

  const heroRef = useIntersectionObserver();
  const aboutRef = useIntersectionObserver();
  const pitchRef = useIntersectionObserver();
  const teamRef = useIntersectionObserver();
  const waitlistRef = useIntersectionObserver();

  return (
    <>
      <CustomCursor />
      <div className="w-full overflow-x-hidden relative" style={{ background: 'radial-gradient(ellipse at center, #FF3A3A 0%, #1a1a1a 50%, #000 100%)', minHeight: '100vh' }}>
      
      {/* Sticky Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-white/10" style={{ background: 'linear-gradient(135deg, #FF3A3A/95 0%, #1a1a1a/95 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform duration-300"
              onClick={() => scrollToSection('home')}>
              <img src="/logo.png" alt="Klash" className="h-8 w-auto" style={{ mixBlendMode: 'multiply' }} />
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              {['home', 'about', 'pitch', 'team', 'waitlist'].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={`capitalize text-sm font-medium transition-all duration-300 ${
                    activeSection === section
                      ? 'text-white'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  {section}
                </button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 space-y-2 animate-slide-in">
              {['home', 'about', 'pitch', 'team', 'waitlist'].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className="w-full text-left px-4 py-2 capitalize text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                >
                  {section}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="home"
        ref={heroRef.ref}
        className={`min-h-screen flex flex-col items-center justify-center px-4 py-24 relative overflow-hidden transition-all duration-1000 z-10 ${
          heroRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >

        <div className="max-w-2xl relative z-10 text-center space-y-6">
          <div className="flex justify-center mb-6">
            <img
              src="/logo.png"
              alt="Klash Logo"
              className="h-24 w-auto md:h-32 transition-transform duration-500 hover:scale-110"
              style={{ mixBlendMode: 'multiply' }}
            />
          </div>

          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight"
            style={{
              lineHeight: '1.1',
              fontFamily: "'Edo', sans-serif",
              letterSpacing: '2px'
            }}
          >
            Put Your Money<br />
            Where The Mouth Is!
          </h1>

          <p className="text-xl md:text-2xl text-white/90 font-medium max-w-2xl mx-auto leading-relaxed">
            A sentiment-driven Web3 prediction market where users bet on real-time Twitter controversies, on-chain!
          </p>

          <button
            onClick={() => scrollToSection('waitlist')}
            className="px-8 py-4 bg-yellow-400 text-black font-bold rounded-xl hover:bg-yellow-300
                     transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg text-lg mt-4"
          >
            Join The Waitlist
          </button>
        </div>

        {/* Trusted Partners Section */}
        <div className="container mx-auto px-4 py-12 md:px-8 relative z-10 w-full">
          <h3 className="text-center text-sm font-semibold text-white/70">TRUSTED BY LEADING COMMUNITIES</h3>
          <div className="relative mt-6">
            <div className="group flex overflow-hidden p-2 [--gap:1rem] [gap:var(--gap)] flex-row max-w-full [--duration:40s]">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex shrink-0 justify-around [gap:var(--gap)] animate-marquee flex-row">
                  <div className="flex items-center justify-center mx-6 min-w-[112px] min-h-[40px] h-12 w-32">
                    <img
                      alt="Aptos"
                      loading="lazy"
                      width="112"
                      height="40"
                      decoding="async"
                      className="object-contain max-h-10 max-w-[112px] opacity-30 grayscale"
                      src="/images/Aptos_Primary_WHT.png"
                    />
                  </div>
                  <div className="flex items-center justify-center mx-6 min-w-[112px] min-h-[40px] h-12 w-32">
                    <img
                      alt="RiseIn"
                      loading="lazy"
                      width="112"
                      height="40"
                      decoding="async"
                      className="object-contain max-h-10 max-w-[112px] opacity-30 grayscale"
                      src="/images/Pi7_risein-logo3.png"
                    />
                  </div>
                  <div className="flex items-center justify-center mx-6 min-w-[112px] min-h-[40px] h-12 w-32">
                    <img
                      alt="MoveOld"
                      loading="lazy"
                      width="112"
                      height="40"
                      decoding="async"
                      className="object-contain max-h-10 max-w-[112px] opacity-30 grayscale"
                      src="/images/moveold.png"
                    />
                  </div>
                  <div className="flex items-center justify-center mx-6 min-w-[112px] min-h-[40px] h-12 w-32">
                    <img
                      alt="Decible"
                      loading="lazy"
                      width="112"
                      height="40"
                      decoding="async"
                      className="object-contain max-h-10 max-w-[112px] opacity-30 grayscale"
                      src="/images/decible.png"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        ref={aboutRef.ref}
        className={`min-h-screen flex flex-col items-center justify-center px-4 py-24 relative transition-all duration-1000 z-10 ${
          aboutRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >

        <div className="max-w-4xl relative z-10">
          <h2
            className="text-4xl md:text-5xl font-black text-white text-center mb-16 tracking-tight"
            style={{ fontFamily: "'Edo', sans-serif", letterSpacing: '2px' }}
          >
            About Klash
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: 'Real-Time Markets',
                description: 'Trade on live social sentiment as events unfold on Twitter, creating dynamic and engaging prediction opportunities.',
              },
              {
                title: 'Web3 Native',
                description: 'Built on blockchain for transparency, security, and true ownership. All trades are recorded on-chain.'
              },
              {
                title: 'Decentralized',
                description: 'No middlemen. Direct peer-to-peer predictions with smart contracts ensuring fair outcomes.',
              },
              {
                title: 'Sentiment Driven',
                description: 'Analyze real social sentiment and make informed predictions about controversies and viral moments.'
              }
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:border-white/40 transition-all duration-300 transform hover:scale-105"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                <p className="text-white/80 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pitch Deck Section */}
      <section
        id="pitch"
        ref={pitchRef.ref}
        className={`min-h-screen flex flex-col items-center justify-center px-4 py-24 relative transition-all duration-1000 z-10 ${
          pitchRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >

        <div className="max-w-5xl relative z-10 w-full">
          <h2
            className="text-4xl md:text-5xl font-black text-white text-center mb-16 tracking-tight"
            style={{ fontFamily: "'Edo', sans-serif", letterSpacing: '2px' }}
          >
            Our Vision
          </h2>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 overflow-hidden">
            <div className="aspect-video bg-black/40 rounded-xl flex items-center justify-center">
              <iframe
                src="https://drive.google.com/file/d/1dNkHCRAyWqZDusQaEMa2yPZpLfiQ1tfS/preview"
                width="100%"
                height="100%"
                allow="autoplay"
                className="rounded-xl"
                title="Klash Pitch Deck"
              ></iframe>
            </div>
          </div>

          <p className="text-center text-white/70 mt-8 text-sm">
            Our complete pitch deck explaining the Klash vision and market opportunity.
          </p>
        </div>
      </section>

      {/* Team Section */}
      <section
        id="team"
        ref={teamRef.ref}
        className={`min-h-screen flex flex-col items-center justify-center px-4 py-24 relative transition-all duration-1000 z-10 ${
          teamRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >

        <div className="max-w-5xl relative z-10 w-full">
          <h2
            className="text-4xl md:text-5xl font-black text-white text-center mb-16 tracking-tight"
            style={{ fontFamily: "'Edo', sans-serif", letterSpacing: '2px' }}
          >
            Meet Our Team
          </h2>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-white/20 overflow-hidden">
            <img
              src="/team.jpeg"
              alt="Klash Team"
              className="w-full h-auto rounded-xl object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>

          <p className="text-center text-white/70 mt-8 max-w-2xl mx-auto">
            A passionate team dedicated to revolutionizing prediction markets through Web3 technology and real-time social sentiment analysis.
          </p>
        </div>
      </section>

      {/* Waitlist Section */}
      <section
        id="waitlist"
        ref={waitlistRef.ref}
        className={`min-h-screen flex flex-col items-center justify-center px-4 py-24 relative transition-all duration-1000 z-10 ${
          waitlistRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >

        <div className="max-w-2xl relative z-10 w-full">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-2xl border-2 border-white/20">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 text-center" style={{ fontFamily: "'Edo', sans-serif" }}>
              Join The Waitlist
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="flex-1 px-6 py-4 rounded-xl bg-white/90 text-black placeholder-black/50
                           border-2 border-white/30 focus:border-white focus:outline-none
                           text-lg font-medium transition-all duration-300 transform focus:scale-105"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-4 bg-yellow-400 text-black font-bold rounded-xl
                           hover:bg-yellow-300 transition-all duration-300
                           disabled:opacity-50 disabled:cursor-not-allowed
                           transform hover:scale-105 active:scale-95 shadow-lg
                           flex items-center justify-center gap-2 text-lg whitespace-nowrap"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-3 border-black border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Join Now
                    </>
                  )}
                </button>
              </div>

              {message && (
                <div
                  className={`p-4 rounded-xl text-center font-semibold animate-fade-in ${
                    messageType === 'success'
                      ? 'bg-white/20 text-white'
                      : 'bg-white/90 text-[#FF3333]'
                  }`}
                >
                  {message}
                </div>
              )}
            </form>

            <div className="mt-8 pt-8 border-t-2 border-white/20">
              <p className="text-center text-white/80 text-sm mb-6 font-medium">
                Share with your network & Let's Move!
              </p>
              <div className="flex justify-center gap-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 bg-white/20 rounded-xl hover:bg-white/30 transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-lg"
                    style={{ transitionDelay: `${index * 50}ms` }}
                    aria-label={`Share on ${social.name}`}
                  >
                    <social.icon className="w-6 h-6 text-white" />
                  </a>
                ))}
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-white/80 text-sm font-medium leading-relaxed">
                Your email is safe with us. We don't share your information with anyone.
                <br />
                By joining, you agree to receive updates about Klash.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="backdrop-blur-sm border-t border-white/10 py-8 relative z-10" style={{ background: 'linear-gradient(135deg, #1a1a1a/40 0%, #000/60 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-6">
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://x.com/klashdotmarket"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white/20 rounded-full hover:bg-white/30 transition-all duration-300 transform hover:scale-110"
              >
                <Twitter className="w-5 h-5 text-white" />
              </a>
              <a
                href="https://t.me/klashdotmarket"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white/20 rounded-full hover:bg-white/30 transition-all duration-300 transform hover:scale-110"
              >
                <Send className="w-5 h-5 text-white" />
              </a>
              <a
                href="mailto:support@klash.live"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white/20 rounded-full hover:bg-white/30 transition-all duration-300 transform hover:scale-110"
              >
                <Mail className="w-5 h-5 text-white" />
              </a>
            </div>
            <p className="text-white/70 text-sm">
              &copy; {new Date().getFullYear()} Klash.Market | All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
}

export default App;
