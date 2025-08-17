import { ImageWithFallback } from './figma/ImageWithFallback';
import { useRef, useState, useCallback, useEffect } from 'react';

interface RingStyleSelectorProps {
  selected: string;
  onSelect: (style: string) => void;
}

export function RingStyleSelector({ selected, onSelect }: RingStyleSelectorProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, scrollLeft: 0 });

  const ringStyles = [
    {
      id: 'halo',
      name: 'halo',
      percentage: '45% choose',
      image: '/images/ring-halo.png'
    },
    {
      id: 'solitaire',
      name: 'solitaire',
      percentage: '30% choose',
      image: '/images/ring-solitaire.png'
    },
    {
      id: 'classic',
      name: 'classic',
      percentage: '15% choose',
      image: '/images/ring-classic.png'
    },
    {
      id: '3-stone',
      name: '3-stone',
      percentage: '8% choose',
      image: '/images/ring-halo.png'
    },
    {
      id: 'cathedral',
      name: 'cathedral',
      percentage: '7% choose',
      image: '/images/ring-solitaire.png'
    },
    {
      id: 'pave',
      name: 'pavé',
      percentage: '5% choose',
      image: '/images/ring-classic.png'
    },
    {
      id: 'vintage',
      name: 'vintage',
      percentage: '10% choose',
      image: '/images/ring-halo.png'
    },
    {
      id: 'twisted',
      name: 'twisted',
      percentage: '3% choose',
      image: '/images/ring-halo.png'
    }
  ];

  // Mouse drag handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!scrollRef.current) return;

    setIsDragging(true);
    setDragStart({
      x: e.pageX,
      scrollLeft: scrollRef.current.scrollLeft
    });

    // Prevent text selection
    e.preventDefault();
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;

    e.preventDefault();
    const x = e.pageX;
    const walk = (x - dragStart.x) * 2; // Multiply by 2 for faster scrolling
    scrollRef.current.scrollLeft = dragStart.scrollLeft - walk;
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Add event listeners for mouse drag
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => handleMouseMove(e);
    const handleGlobalMouseUp = () => handleMouseUp();

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div>
      <h3 className="text-gray-800 mb-0 uppercase tracking-wide">Ring Style</h3>
      <div
        ref={scrollRef}
        className={`flex gap-0 overflow-x-auto scrollbar-hide pb-1 select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
      >
        {ringStyles.map((style) => (
          <button
            key={style.id}
            onClick={(e) => {
              // Only trigger selection if not dragging
              if (!isDragging) {
                onSelect(style.id);
              }
            }}
            className={`flex-shrink-0 m-1.5 transition-all pointer-events-auto flex flex-col ${selected === style.id ? 'active' : ''
              }`}
            style={{ width: '130px' }}
          >
            <div className="relative overflow-hidden" style={{ height: '96px' }}>
              <ImageWithFallback
                src={style.image}
                alt={style.name}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Black tag below the image */}
            <div className="button-tag bg-black bg-opacity-90 px-2 py-1 w-full">
              <div className="text-xs text-white flex justify-between items-center">
                <span className='item-name'>{style.name}</span>
                <span className="percentage italic opacity-80">{style.percentage}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}