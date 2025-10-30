import { useEffect, useState } from 'react';

const SimpleCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      // Check if hovering over interactive elements
      const target = e.target as HTMLElement;
      const isInteractive = 
        target.matches('a, button, [role="button"], [data-cursor="pointer"]') ||
        target.closest('a, button, [role="button"], [data-cursor="pointer"]');
      
      setIsHovered(!!isInteractive);
    };

    document.addEventListener('mousemove', moveCursor);
    return () => document.removeEventListener('mousemove', moveCursor);
  }, []);

  return (
    <div 
      className="custom-cursor"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: isHovered ? 'translate(-50%, -50%) scale(1.5)' : 'translate(-50%, -50%)',
        borderColor: isHovered ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.8)',
      }}
    />
  );
};

export default SimpleCursor;
