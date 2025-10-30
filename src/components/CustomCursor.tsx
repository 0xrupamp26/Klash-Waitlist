import { useEffect, useState } from 'react';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isClickable, setIsClickable] = useState(false);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      // Check if we're hovering over a clickable element
      const target = e.target as HTMLElement;
      setIsClickable(
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.onclick !== null ||
        target.closest('a, button, [role="button"], [data-cursor="pointer"]')
      );
    };

    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.matches('a, button, [role="button"], [data-cursor="pointer"]')) {
        setIsHovered(true);
      }
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
    };

    document.addEventListener('mousemove', updatePosition);
    document.addEventListener('mouseenter', updatePosition);
    document.addEventListener('mouseover', handleMouseEnter);
    document.addEventListener('mouseout', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', updatePosition);
      document.removeEventListener('mouseenter', updatePosition);
      document.removeEventListener('mouseover', handleMouseEnter);
      document.removeEventListener('mouseout', handleMouseLeave);
    };
  }, []);

  const cursorSize = isHovered ? 24 : 8;
  const cursorStyle: React.CSSProperties = {
    left: `${position.x - cursorSize / 2}px`,
    top: `${position.y - cursorSize / 2}px`,
    width: `${cursorSize}px`,
    height: `${cursorSize}px`,
    backgroundColor: isHovered ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.8)',
    border: isHovered ? '2px solid rgba(255, 255, 255, 0.8)' : 'none',
    transform: isClickable ? 'scale(1.5)' : 'none',
  };

  return (
    <>
      <div 
        className="fixed rounded-full pointer-events-none z-50 transition-all duration-100 ease-out"
        style={{
          ...cursorStyle,
          transform: `translate3d(${position.x - cursorSize / 2}px, ${position.y - cursorSize / 2}px, 0)`,
        }}
      />
      <div 
        className="fixed rounded-full bg-white/20 pointer-events-none z-40 transition-all duration-300 ease-out"
        style={{
          left: `${position.x - 16}px`,
          top: `${position.y - 16}px`,
          width: '32px',
          height: '32px',
          transform: isHovered ? 'scale(1.5)' : 'scale(1)',
          opacity: isHovered ? 0.5 : 0.3,
        }}
      />
    </>
  );
};

export default CustomCursor;
