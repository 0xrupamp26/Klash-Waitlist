import { useEffect, useRef, useState, useCallback } from 'react';

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 0, y: 0 });
  const stateRef = useRef({ isClickable: false, isText: false });
  const [state, setState] = useState({ isClickable: false, isText: false });
  const rafRef = useRef<number>();

  const updateCursorPosition = useCallback(() => {
    const { x, y } = posRef.current;
    const { isClickable, isText } = stateRef.current;

    if (cursorRef.current) {
      const size = isClickable ? 12 : isText ? 8 : 6;
      const scale = isClickable ? 1.3 : isText ? 1.2 : 1;
      cursorRef.current.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${scale})`;
    }

    if (ringRef.current) {
      const ringSize = isClickable ? 42 : isText ? 36 : 32;
      const rotation = isClickable ? 45 : 0;
      const ringScale = isClickable ? 1.1 : 1;
      ringRef.current.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${rotation}deg) scale(${ringScale})`;
    }

    if (glowRef.current && isText) {
      glowRef.current.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
    }
  }, []);

  const updateState = useCallback(() => {
    if (stateRef.current.isClickable !== state.isClickable || stateRef.current.isText !== state.isText) {
      setState(stateRef.current);
    }
  }, [state]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    posRef.current = { x: e.clientX, y: e.clientY };

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(updateCursorPosition);
  }, [updateCursorPosition]);

  const handleMouseOver = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;

    const isButton = target.tagName === 'BUTTON' || target.closest('button');
    const isLink = target.tagName === 'A' || target.closest('a');
    const isInput = target.tagName === 'INPUT' || target.closest('input');
    const isTextElement =
      target.tagName === 'H1' ||
      target.tagName === 'H2' ||
      target.tagName === 'H3' ||
      target.tagName === 'P' ||
      target.tagName === 'SPAN' ||
      target.closest('h1, h2, h3, p, span');

    const isClickable = isButton || isLink || isInput;
    const isText = isTextElement && !isClickable;

    if (stateRef.current.isClickable !== isClickable || stateRef.current.isText !== isText) {
      stateRef.current = { isClickable, isText };
      updateState();
      updateCursorPosition();
    }
  }, [updateState, updateCursorPosition]);

  const handleMouseOut = useCallback(() => {
    stateRef.current = { isClickable: false, isText: false };
    setState({ isClickable: false, isText: false });
  }, []);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mouseout', handleMouseOut, { passive: true });

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [handleMouseMove, handleMouseOver, handleMouseOut]);

  const { isClickable, isText } = state;

  return (
    <>
      <style>{`
        * {
          cursor: none !important;
        }
        @keyframes pulse-glow {
          0%, 100% { transform: translate(calc(-50% + var(--x, 0px)), calc(-50% + var(--y, 0px))) scale(1); }
          50% { transform: translate(calc(-50% + var(--x, 0px)), calc(-50% + var(--y, 0px))) scale(1.2); }
        }
      `}</style>

      {/* Inner cursor dot */}
      <div
        ref={cursorRef}
        className="fixed rounded-full pointer-events-none z-[9999]"
        style={{
          width: isClickable ? '12px' : isText ? '8px' : '6px',
          height: isClickable ? '12px' : isText ? '8px' : '6px',
          backgroundColor: isClickable ? '#FFD700' : isText ? '#FF3A3A' : '#FFFFFF',
          boxShadow: isClickable
            ? '0 0 15px rgba(255, 215, 0, 0.8)'
            : isText
              ? '0 0 12px rgba(255, 58, 58, 0.6)'
              : '0 0 8px rgba(255, 255, 255, 0.4)',
          willChange: 'transform',
        }}
      />

      {/* Outer ring */}
      <div
        ref={ringRef}
        className="fixed rounded-full border pointer-events-none z-[9998]"
        style={{
          width: isClickable ? '42px' : isText ? '36px' : '32px',
          height: isClickable ? '42px' : isText ? '36px' : '32px',
          borderWidth: '1.5px',
          borderColor: isClickable ? 'rgba(255, 215, 0, 0.6)' : isText ? 'rgba(255, 58, 58, 0.5)' : 'rgba(255, 255, 255, 0.4)',
          opacity: state.isClickable || state.isText ? 1 : 0.6,
          willChange: 'transform',
        }}
      />

      {/* Glow effect for text */}
      {isText && (
        <div
          ref={glowRef}
          className="fixed rounded-full pointer-events-none z-[9997]"
          style={{
            width: '50px',
            height: '50px',
            background: 'radial-gradient(circle, rgba(255, 58, 58, 0.2) 0%, transparent 70%)',
            animation: 'pulse-glow 2s ease-in-out infinite',
            willChange: 'transform',
          }}
        />
      )}
    </>
  );
};

export default CustomCursor;
