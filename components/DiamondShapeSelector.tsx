import { ImageWithFallback } from './figma/ImageWithFallback';
import { useRef, useState, useCallback, useEffect } from 'react';

interface DiamondShapeSelectorProps {
  selected: string;
  onSelect: (shape: string) => void;
}

export function DiamondShapeSelector({ selected, onSelect }: DiamondShapeSelectorProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, scrollLeft: 0 });

  const diamondShapes = [
    {
      id: 'round',
      name: 'round',
      percentage: '57% choose',
      image: '/images/diamond-round.png'
    },
    {
      id: 'princess',
      name: 'princess',
      percentage: '16% choose',
      image: '/images/diamond-princess.png'
    },
    {
      id: 'cushion',
      name: 'cushion',
      percentage: '14% choose',
      image: '/images/diamond-cushion.png'
    },
    {
      id: 'emerald',
      name: 'emerald',
      percentage: '13% choose',
      image: '/images/diamond-round.png'
    },
    {
      id: 'oval',
      name: 'oval',
      percentage: '8% choose',
      image: '/images/diamond-round.png'
    },
    {
      id: 'pear',
      name: 'pear',
      percentage: '6% choose',
      image: '/images/diamond-round.png'
    },
    {
      id: 'marquise',
      name: 'marquise',
      percentage: '4% choose',
      image: '/images/diamond-round.png'
    },
    {
      id: 'heart',
      name: 'heart',
      percentage: '2% choose',
      image: '/images/diamond-round.png'
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
      <h3 className="text-gray-800 mb-0 uppercase tracking-wide">Diamond Shape</h3>
      <div
        ref={scrollRef}
        className={`flex gap-0 overflow-x-auto scrollbar-hide pb-2 select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
      >
        {diamondShapes.map((shape, index) => (
          <button
            key={shape.id}
            onClick={(e) => {
              // Only trigger selection if not dragging
              if (!isDragging) {
                onSelect(shape.id);
              }
            }}
            className={`diamond-shape flex-shrink-0 m-0.5 transition-all pointer-events-auto flex flex-col ${selected === shape.id ? 'active' : ''
              }`}
          >
            <div className="relative rounded-md overflow-hidden w-full bg-white" style={{ height: '125px' }}>
              <div className={`image-wrap ${index === 0 ? 'p-0' : 'p-3'} h-full flex items-center justify-center`}>
                <ImageWithFallback
                  src={shape.image}
                  alt={shape.name}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            </div>
            {/* Black tag below the image */}
            <div className="button-tag bg-black bg-opacity-90 px-2 py-1 w-full">
              <div className="text-xs text-white flex justify-between items-center">
                <span className='item-name'>{shape.name}</span>
                <span className="percentage italic opacity-80">{shape.percentage}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}