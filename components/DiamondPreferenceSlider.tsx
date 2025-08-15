import React, { useRef, useState, useCallback } from 'react';

interface DiamondPreferenceSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export function DiamondPreferenceSlider({ value, onChange }: DiamondPreferenceSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState<number | null>(null);

  const markers = [0, 1, 2, 3, 4];

  const getPositionFromValue = (val: number) => {
    return (val / 4) * 100; // Convert 0-4 to 0-100%
  };

  const getValueFromPosition = (position: number) => {
    const clampedPosition = Math.max(0, Math.min(100, position));
    return Math.round((clampedPosition / 100) * 4);
  };

  const getPositionFromEvent = useCallback((event: MouseEvent | TouchEvent) => {
    if (!sliderRef.current) return 0;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const position = ((clientX - rect.left) / rect.width) * 100;
    
    return Math.max(0, Math.min(100, position));
  }, []);

  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    setIsDragging(true);
    
    const position = getPositionFromEvent(event.nativeEvent);
    setDragPosition(position);
  }, [getPositionFromEvent]);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!isDragging) return;
    
    const position = getPositionFromEvent(event);
    setDragPosition(position);
  }, [isDragging, getPositionFromEvent]);

  const handleMouseUp = useCallback(() => {
    if (!isDragging || dragPosition === null) return;
    
    const newValue = getValueFromPosition(dragPosition);
    onChange(newValue);
    setIsDragging(false);
    setDragPosition(null);
  }, [isDragging, dragPosition, onChange]);

  const handleTouchStart = useCallback((event: React.TouchEvent) => {
    event.preventDefault();
    setIsDragging(true);
    
    const position = getPositionFromEvent(event.nativeEvent);
    setDragPosition(position);
  }, [getPositionFromEvent]);

  const handleTouchMove = useCallback((event: TouchEvent) => {
    if (!isDragging) return;
    event.preventDefault();
    
    const position = getPositionFromEvent(event);
    setDragPosition(position);
  }, [isDragging, getPositionFromEvent]);

  const handleTouchEnd = useCallback(() => {
    if (!isDragging || dragPosition === null) return;
    
    const newValue = getValueFromPosition(dragPosition);
    onChange(newValue);
    setIsDragging(false);
    setDragPosition(null);
  }, [isDragging, dragPosition, onChange]);

  // Add event listeners
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  const currentPosition = isDragging && dragPosition !== null ? dragPosition : getPositionFromValue(value);

  return (
    <div>
      <h3 className="text-gray-800 mb-2 uppercase tracking-wide">Diamond Preference</h3>
      
      <div className="px-4">
        {/* End labels */}
        <div className="flex justify-between mb-3">
          <span className="text-gray-700">better quality</span>
          <span className="text-gray-700">larger size</span>
        </div>
        
        {/* Slider track and markers */}
        <div className="relative">
          {/* Track line */}
          <div 
            ref={sliderRef}
            className="slider absolute top-1/2 left-0 right-0 bg-gray-300 transform -translate-y-1/2 cursor-pointer"
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
          ></div>
          
          {/* Static marker positions */}
          <div className="relative flex justify-between items-center pointer-events-none">
            {markers.map((markerValue) => (
              <div
                key={markerValue}
                className={`w-4 h-4 rounded-full border-2 transition-colors relative z-10 ${
                  value === markerValue && !isDragging
                    ? 'bg-teal-600 border-teal-600'
                    : 'bg-gray-300 border-gray-300'
                }`}
              />
            ))}
          </div>
          
          {/* Draggable active dot */}
          <div
            className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 z-20 transition-all duration-150"
            style={{ left: `${currentPosition}%` }}
          >
            <div
              className={`w-4 h-4 rounded-full border-2 cursor-grab active:cursor-grabbing ${
                isDragging ? 'bg-teal-500 border-teal-500 scale-110' : 'bg-teal-600 border-teal-600'
              }`}
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
            />
          </div>
        </div>
        
        {/* Most popular label */}
        <div className="flex justify-center mt-4">
          <div className="text-center">
            <span className="text-gray-500 italic text-sm">most popular</span>
          </div>
        </div>
      </div>
    </div>
  );
}