import { useState, useEffect } from 'react';
import { Send, Twitter, Linkedin, Mail } from 'lucide-react';

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
      const timestamp = new Date().getTime();
      const url = `https://script.google.com/macros/s/AKfycby-h3xcGus4-CIPuJ0iIHVb1O4ZS-1jJCN9Je49RkttWOzG5-oVHGrVR3Yhy1b_Yg1VVw/exec?t=${timestamp}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setMessageType('success');
        setMessage(data.message);
        setEmail('');
      } else {
        setMessageType('error');
        setMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setMessageType('error');
      setMessage('Network error. Please check your connection and try again.');
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
            style={{ animationDelay: '0.2s', lineHeight: '1.2' }}
          >
            Put Your Money Where The Mouth Is
          </h1>

          <div 
            className="w-full max-w-4xl mx-auto px-4 flex items-center justify-center gap-2 mb-6 animate-fade-in"
            style={{ animationDelay: '0.3s' }}
          >
            <span className="text-white/60 text-sm font-medium">Powered by</span>
            <a 
              
            >
              <img 
                src="/aptos-logo.svg" 
                alt="Aptos" 
                className="h-6 w-auto transition-transform group-hover:scale-105"
              />
         
            </a>
          </div>

          <p
            className="text-xl md:text-2xl text-white/90 font-medium max-w-2xl mx-auto leading-relaxed animate-slide-in"
            style={{ animationDelay: '0.4s' }}
          >
            A sentiment-driven Web3 prediction market where users bet on real-time Twitter controversies, on-chain. powered by Aptos.
          </p>
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
              Share with your network
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
