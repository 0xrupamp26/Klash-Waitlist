import { useState, useEffect } from 'react';
import { Send, Twitter, Linkedin, Instagram, Youtube, Mail } from 'lucide-react';

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
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/sync-to-sheets`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessageType('success');
        setMessage(data.message || 'Successfully joined the waitlist!');
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
    <div className="min-h-screen bg-[#FF3333] flex flex-col items-center justify-center px-4 py-12 overflow-hidden relative">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-black rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-black rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div
        className={`max-w-2xl w-full relative z-10 transition-all duration-1000 transform ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="text-center mb-12 space-y-8">
          <div className="flex justify-center mb-8 animate-fade-in">
            <img
              src="/Klash Logo.png"
              alt="Klash Logo"
              className="h-32 w-auto md:h-40 transition-transform duration-500 hover:scale-105"
              style={{ mixBlendMode: 'multiply' }}
            />
          </div>

          <h1
            className="text-4xl md:text-6xl font-black text-black mb-6 tracking-tight animate-slide-in"
            style={{ animationDelay: '0.2s' }}
          >
            Put Your Money Where<br />The Mouth Is
          </h1>

          <p
            className="text-xl md:text-2xl text-black/90 font-semibold max-w-xl mx-auto leading-relaxed animate-slide-in"
            style={{ animationDelay: '0.4s' }}
          >
            The global social prediction platform where opinions meet outcomes.
            Make predictions, back them up, and prove you were right.
          </p>
        </div>

        <div
          className="bg-black/10 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-2xl border-2 border-black/20 animate-slide-in"
          style={{ animationDelay: '0.6s' }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-black mb-6 text-center">
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
                className="flex-1 px-6 py-4 rounded-xl bg-white text-black placeholder-black/50
                         border-2 border-black/20 focus:border-black focus:outline-none
                         text-lg font-medium transition-all duration-300 transform focus:scale-105"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-4 bg-black text-white font-bold rounded-xl
                         hover:bg-black/90 transition-all duration-300
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
                    ? 'bg-black/20 text-black'
                    : 'bg-white/90 text-[#FF3333]'
                }`}
              >
                {message}
              </div>
            )}
          </form>

          <div className="mt-8 pt-8 border-t-2 border-black/20">
            <p className="text-center text-black/80 text-sm mb-6 font-medium">
              Share with your network
            </p>
            <div className="flex justify-center gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-4 bg-black/20 rounded-xl ${social.color}
                           transition-all duration-300 transform hover:scale-110
                           active:scale-95 shadow-lg animate-fade-in`}
                  style={{ animationDelay: `${0.8 + index * 0.1}s` }}
                  aria-label={`Share on ${social.name}`}
                >
                  <social.icon className="w-6 h-6 text-black" />
                </a>
              ))}
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-black/70 text-sm font-medium leading-relaxed">
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
                className="p-3 bg-black/20 rounded-xl hover:bg-black/40 transition-all duration-300 transform hover:scale-110 active:scale-95"
                aria-label="Follow us on X"
              >
                <Twitter className="w-5 h-5 text-black" />
              </a>
              <a
                href="https://www.instagram.com/klash.market"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-black/20 rounded-xl hover:bg-black/40 transition-all duration-300 transform hover:scale-110 active:scale-95"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="w-5 h-5 text-black" />
              </a>
              <a
                href="https://www.youtube.com/@klash.market"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-black/20 rounded-xl hover:bg-black/40 transition-all duration-300 transform hover:scale-110 active:scale-95"
                aria-label="Subscribe on YouTube"
              >
                <Youtube className="w-5 h-5 text-black" />
              </a>
              <a
                href="https://t.me/klashdotmarket"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-black/20 rounded-xl hover:bg-black/40 transition-all duration-300 transform hover:scale-110 active:scale-95"
                aria-label="Join us on Telegram"
              >
                <Send className="w-5 h-5 text-black" />
              </a>
              <a
                href="mailto:klash.market@gmail.com"
                className="p-3 bg-black/20 rounded-xl hover:bg-black/40 transition-all duration-300 transform hover:scale-110 active:scale-95"
                aria-label="Email us"
              >
                <Mail className="w-5 h-5 text-black" />
              </a>
            </div>
          </div>

          <div className="text-center text-black/60 text-sm">
            <p className="font-medium">© 2025 Klash. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
