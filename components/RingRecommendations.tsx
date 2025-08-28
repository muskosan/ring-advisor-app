import { useState, useRef, useCallback, useEffect } from 'react';
import { Menu, ShoppingBag, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';

interface RingRecommendationsProps {
  onBack: () => void;
  selectedOptions: {
    metal: string;
    ringStyle: string;
    diamondShape: string;
    diamondPreference: number;
    budget: string;
  };
}

export function RingRecommendations({ onBack, selectedOptions }: RingRecommendationsProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, startIndex: 0 });
  const carouselRef = useRef<HTMLDivElement>(null);
  
  // Mock ring data with actual engagement ring images
  const ring = {
    id: 1,
    name: "BRAIDED SOLITAIRE BAND",
    metal: "Platinum",
    caratWeight: "0.28 CTW",
    diamondDetails: "3.03 CT, Round Diamond",
    price: 12345,
    rating: 5,
    reviewCount: 106,
    images: [
      '/images/ring-results.png',
      '/images/ring-results.png',
      '/images/ring-results.png',
      '/images/ring-results.png'
    ]
  };

  const nextImage = useCallback(() => {
    if (isDragging) return;
    setCurrentImageIndex((prev) => (prev + 1) % ring.images.length);
  }, [isDragging, ring.images.length]);

  const prevImage = useCallback(() => {
    if (isDragging) return;
    setCurrentImageIndex((prev) => {
      const newIndex = prev - 1;
      return newIndex < 0 ? ring.images.length - 1 : newIndex;
    });
  }, [isDragging, ring.images.length]);

  const goToImage = useCallback((index: number) => {
    if (isDragging) return;
    setCurrentImageIndex(index);
  }, [isDragging]);

  // Mouse drag handlers for desktop
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!carouselRef.current) return;
    
    setIsDragging(true);
    setDragStart({
      x: e.pageX,
      startIndex: currentImageIndex
    });
    
    e.preventDefault();
  }, [currentImageIndex]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !carouselRef.current) return;
    
    e.preventDefault();
    const x = e.pageX;
    const dragDistance = x - dragStart.x;
    const threshold = 100; // pixels to drag before switching image
    
    if (Math.abs(dragDistance) > threshold) {
      if (dragDistance > 0) {
        // Dragging right - go to previous image
        const newIndex = dragStart.startIndex - 1;
        const targetIndex = newIndex < 0 ? ring.images.length - 1 : newIndex;
        if (targetIndex !== currentImageIndex) {
          setCurrentImageIndex(targetIndex);
          setDragStart({ x: e.pageX, startIndex: targetIndex });
        }
      } else {
        // Dragging left - go to next image
        const targetIndex = (dragStart.startIndex + 1) % ring.images.length;
        if (targetIndex !== currentImageIndex) {
          setCurrentImageIndex(targetIndex);
          setDragStart({ x: e.pageX, startIndex: targetIndex });
        }
      }
    }
  }, [isDragging, dragStart, currentImageIndex, ring.images.length]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Touch handlers for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!carouselRef.current) return;
    
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({
      x: touch.pageX,
      startIndex: currentImageIndex
    });
  }, [currentImageIndex]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging || !carouselRef.current) return;
    
    const touch = e.touches[0];
    const x = touch.pageX;
    const dragDistance = x - dragStart.x;
    const threshold = 80; // slightly smaller threshold for touch
    
    if (Math.abs(dragDistance) > threshold) {
      if (dragDistance > 0) {
        // Swiping right - go to previous image
        const newIndex = dragStart.startIndex - 1;
        const targetIndex = newIndex < 0 ? ring.images.length - 1 : newIndex;
        if (targetIndex !== currentImageIndex) {
          setCurrentImageIndex(targetIndex);
          setDragStart({ x: touch.pageX, startIndex: targetIndex });
        }
      } else {
        // Swiping left - go to next image
        const targetIndex = (dragStart.startIndex + 1) % ring.images.length;
        if (targetIndex !== currentImageIndex) {
          setCurrentImageIndex(targetIndex);
          setDragStart({ x: touch.pageX, startIndex: targetIndex });
        }
      }
    }
  }, [isDragging, dragStart, currentImageIndex, ring.images.length]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Global event listeners
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => handleMouseMove(e);
    const handleGlobalMouseUp = () => handleMouseUp();
    const handleGlobalTouchMove = (e: TouchEvent) => handleTouchMove(e);
    const handleGlobalTouchEnd = () => handleTouchEnd();

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
      document.addEventListener('touchmove', handleGlobalTouchMove, { passive: false });
      document.addEventListener('touchend', handleGlobalTouchEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('touchmove', handleGlobalTouchMove);
      document.removeEventListener('touchend', handleGlobalTouchEnd);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  const handleBackClick = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    onBack();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-black text-white">
        <Menu className="w-6 h-6" />
        <h1 className="text-xl font-medium tracking-widest">RITANI</h1>
        <ShoppingBag className="w-6 h-6" />
      </header>

      {/* Recommendations Title */}
      <div className="bg-gray-50 py-4 text-center">
        <h2 className="text-lg font-medium tracking-widest">RECOMMENDATIONS</h2>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6">
        {/* Product Image Carousel */}
        <div className="relative bg-black rounded-lg overflow-hidden mb-6">
          {/* Navigation Arrows */}
          <button 
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:text-gray-300 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button 
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:text-gray-300 transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Carousel Container */}
          <div 
            ref={carouselRef}
            className={`relative aspect-square overflow-hidden ${
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
          >
            {/* Image Track */}
            <motion.div 
              className="flex w-full h-full"
              animate={{ 
                x: `${-currentImageIndex * 100}%` 
              }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30,
                duration: 0.5
              }}
            >
              {ring.images.map((image, index) => (
                <div key={index} className="w-full h-full flex-shrink-0">
                  <ImageWithFallback 
                    src={image}
                    alt={`${ring.name} - View ${index + 1}`}
                    className="w-full h-full object-cover select-none"
                    draggable={false}
                  />
                </div>
              ))}
            </motion.div>
          </div>

          {/* Carousel Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {ring.images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  currentImageIndex === index ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Star Rating */}
        <div className="flex items-center justify-center gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`w-6 h-6 ${
                i < ring.rating 
                  ? 'fill-yellow-400 text-yellow-400' 
                  : 'fill-gray-200 text-gray-200'
              }`} 
            />
          ))}
          <span className="ml-2 text-sm text-gray-600">({ring.reviewCount} reviews)</span>
        </div>

        {/* Product Title */}
        <h3 className="text-center text-md">
          <span className="font-medium">{ring.name}</span> in
        </h3>
        <p className="text-center text-lg pb-6">
          {ring.metal} ({ring.caratWeight}) with a {ring.diamondDetails}
        </p>

        {/* Price */}
        <div className="results text-center mb-8">
          <span className="result-text text-gray-500 italic pr-3">your price: </span>
          <span className="text-2xl font-medium">${ring.price.toLocaleString()}</span>
        </div>

        {/* Choose This Ring Button */}
        <div className="mb-6">
          <Button 
            className="choose-this w-full bg-transparent border-2 border-yellow-600 text-yellow-600 hover:bg-yellow-600 hover:text-white py-6 text-lg tracking-wide transition-all duration-200"
            size="lg"
          >
            CHOOSE THIS RING ▸
          </Button>
        </div>

        {/* Update Options Link */}
        <div className="flex justify-center">
          <button 
            onClick={handleBackClick}
            disabled={isTransitioning}
            className="text-gray-600 hover:text-gray-800 transition-colors flex items-center justify-center gap-1 disabled:opacity-50"
          >
            <ChevronLeft className="w-6 h-6" />
            <span className="update-options uppercase tracking-wide text-sm">
              {isTransitioning ? 'LOADING...' : 'UPDATE OPTIONS'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}