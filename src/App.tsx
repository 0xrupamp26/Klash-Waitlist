import { useState, useEffect } from 'react';
import { Send, Twitter, Linkedin, Mail } from 'lucide-react';

// Load Edo font
const link = document.createElement('link');
link.href = 'https://fonts.cdnfonts.com/css/edo';
link.rel = 'stylesheet';
document.head.appendChild(link);

function App() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [isVisible, setIsVisible] = useState(false);

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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 overflow-hidden relative bg-[#FF3A3A]">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/image.png" 
          alt="Background" 
          className="w-full h-full object-cover mix-blend-overlay"
        />
      </div>

      <div
        className={`max-w-2xl w-full relative z-10 transition-all duration-1000 transform ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="text-center mb-12 space-y-6">
          <div className="flex justify-center mb-6 animate-fade-in">
            <img
              src="/Klash Logo.png"
              alt="Klash Logo"
              className="h-24 w-auto md:h-32 transition-transform duration-500 hover:scale-105"
              style={{ mixBlendMode: 'multiply' }}
            />
          </div>

          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6 tracking-tight animate-slide-in text-center w-full px-4"
            style={{
              animationDelay: '0.2s',
              lineHeight: '1.2',
              fontFamily: "'Edo', sans-serif",
              letterSpacing: '1px'
            }}
          >
            Put Your Money<br />
            Where The Mouth Is!
          </h1>

         

          <div className="text-center">
            <p 
              className="text-xl md:text-2xl text-white/90 font-medium max-w-2xl mx-auto leading-relaxed animate-slide-in"
              style={{ animationDelay: '0.4s' }}
            >
              A sentiment-driven Web3 prediction market where users bet on real-time Twitter controversies, on-chain!
            </p>
      
          </div>
        </div>

        {/* Trusted Partners Section */}
        <div className="container mx-auto px-4 py-12 md:px-8">
          <h3 className="text-center text-sm font-semibold text-white/70">TRUSTED BY LEADING COMMUNITIES</h3>
          <div className="relative mt-6">
            <div className="group flex overflow-hidden p-2 [--gap:1rem] [gap:var(--gap)] flex-row max-w-full [--duration:40s]">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex shrink-0 justify-around [gap:var(--gap)] animate-marquee flex-row">
                  {/* Aptos Logo */}
                  <div className="flex items-center justify-center mx-6 min-w-[112px] min-h-[40px] h-12 w-32" style={{ aspectRatio: 'auto 112 / 40' }}>
                    <img 
                      alt="Aptos" 
                      loading="lazy" 
                      width="112" 
                      height="40" 
                      decoding="async" 
                      className="object-contain max-h-10 max-w-[112px] opacity-30 grayscale dark:brightness-0 dark:invert" 
                      style={{ color: 'transparent' }} 
                      src="/images/Aptos_Primary_WHT.png"
                    />
                  </div>
                  
                  {/* RiseIn Logo */}
                  <div className="flex items-center justify-center mx-6 min-w-[112px] min-h-[40px] h-12 w-32" style={{ aspectRatio: 'auto 112 / 40' }}>
                    <img 
                      alt="RiseIn" 
                      loading="lazy" 
                      width="112" 
                      height="40" 
                      decoding="async" 
                      className="object-contain max-h-10 max-w-[112px] opacity-30 grayscale dark:brightness-0 dark:invert" 
                      style={{ color: 'transparent' }} 
                      src="/images/Pi7_risein-logo3.png"
                    />
                  </div>
                  
                  {/* MoveOld Logo */}
                  <div className="flex items-center justify-center mx-6 min-w-[112px] min-h-[40px] h-12 w-32" style={{ aspectRatio: 'auto 112 / 40' }}>
                    <img 
                      alt="MoveOld" 
                      loading="lazy" 
                      width="112" 
                      height="40" 
                      decoding="async" 
                      className="object-contain max-h-10 max-w-[112px] opacity-30 grayscale dark:brightness-0 dark:invert" 
                      style={{ color: 'transparent' }} 
                      src="/images/moveold.png"
                    />
                  </div>
                  
                  {/* Decible Logo */}
                  <div className="flex items-center justify-center mx-6 min-w-[112px] min-h-[40px] h-12 w-32" style={{ aspectRatio: 'auto 112 / 40' }}>
                    <img 
                      alt="Decible" 
                      loading="lazy" 
                      width="112" 
                      height="40" 
                      decoding="async" 
                      className="object-contain max-h-10 max-w-[112px] opacity-30 grayscale dark:brightness-0 dark:invert" 
                      style={{ color: 'transparent' }} 
                      src="/images/decible.png"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-2xl border-2 border-white/20 animate-slide-in"
          style={{ animationDelay: '0.6s' }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">
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
                         flex items-center justify-center gap-2 text-lg"
              >
                {loading ? (
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
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

          <div className="mt-8 pt-8 border-t-2 border-black/20">
            <p className="text-center text-white/80 text-sm mb-6 font-medium">
              Share with your network & Let's F****** Move!
            </p>
            <div className="flex justify-center gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-4 bg-white/20 rounded-xl hover:bg-white/30
                           transition-all duration-300 transform hover:scale-110
                           active:scale-95 shadow-lg animate-fade-in`}
                  style={{ animationDelay: `${0.8 + index * 0.1}s` }}
                  aria-label={`Share on ${social.name}`}
                >
                  <social.icon className="w-6 h-6 text-white" />
                </a>
              ))}
            </div>
            
          </div>

          <div className="mt-8 text-center">
            <p className="text-white/80 text-sm font-medium leading-relaxed mb-6">
              Your email is safe with us. We don't share your information with anyone.
              <br />
              By joining, you agree to receive updates about Klash.
            </p>
          </div>
        </div>

        <div className="mt-8 space-y-6 animate-fade-in" style={{ animationDelay: '1s' }}>
          <div className="flex flex-col items-center gap-6">
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://x.com/klashdotmarket"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white/20 rounded-full hover:bg-white/30 transition-colors duration-300"
              >
                <Twitter className="w-5 h-5 text-white" />
              </a>
              <a
                href="https://t.me/klashdotmarket"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white/20 rounded-full hover:bg-white/30 transition-colors duration-300"
              >
                <Send className="w-5 h-5 text-white" />
              </a>
              <a
                href="mailto:support@klash.live "
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white/20 rounded-full hover:bg-white/30 transition-colors duration-300"
              >
                <Mail className="w-5 h-5 text-white" />
              </a>
            </div>
            <p className="text-white/70 text-sm">
              &copy; {new Date().getFullYear()} Klash.Market | All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
