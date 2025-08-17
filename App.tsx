import { useState } from 'react';
import { Menu, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { MetalSelector } from './components/MetalSelector';
import { RingStyleSelector } from './components/RingStyleSelector';
import { DiamondShapeSelector } from './components/DiamondShapeSelector';
import { DiamondPreferenceSlider } from './components/DiamondPreferenceSlider';
import { BudgetSelector } from './components/BudgetSelector';
import { RingRecommendations } from './components/RingRecommendations';
import { Button } from './components/ui/button';

export default function App() {
  const [currentView, setCurrentView] = useState('customization'); // 'customization' or 'recommendations'
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedMetal, setSelectedMetal] = useState('white-metals');
  const [selectedRingStyle, setSelectedRingStyle] = useState('halo');
  const [selectedDiamondShape, setSelectedDiamondShape] = useState('round');
  const [diamondPreference, setDiamondPreference] = useState(2); // 0-4 scale, 2 is "most popular"
  const [selectedBudget, setSelectedBudget] = useState('4k');

  const handleViewChange = (newView: string) => {
    if (isTransitioning) return; // Prevent multiple clicks during transition
    
    setIsTransitioning(true);
    
    // Small delay to allow fade out, then change view
    setTimeout(() => {
      setCurrentView(newView);
      setIsTransitioning(false);
    }, 300); // Half of fade duration for smooth transition
  };

  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
        ease: "easeIn"
      }
    }
  };

  return (
    <div className="min-h-screen wrapper bg-white">
      <AnimatePresence mode="wait">
        {currentView === 'recommendations' ? (
          <motion.div
            key="recommendations"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <RingRecommendations 
              onBack={() => handleViewChange('customization')}
              selectedOptions={{
                metal: selectedMetal,
                ringStyle: selectedRingStyle,
                diamondShape: selectedDiamondShape,
                diamondPreference,
                budget: selectedBudget
              }}
            />
          </motion.div>
        ) : (
          <motion.div
            key="customization"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {/* Header */}
            <header className="flex items-center justify-between p-4 text-white">
              <img className='menu' src='/images/menu.png'></img>
              <img className='logo' src='/images/RITANI.png'></img>
              <img className='bag' src='/images/bag.png'></img>
            </header>

            {/* Hero Section */}
            <div className="hero relative">
              <img 
                src='/images/header-hero.jpg'
                alt="Diamond ring on hand"
                className="w-full object-cover"
              />
              <div className="absolute inset-0 flex flex-col justify-center px-6">
                <div className='text-left left-0 self-start'>
                  <h2 className="text-white text-center text-3xl">LET US<br/>FIND A RING</h2>
                  <h2 className="text-white text-center text-3xl italic">she'll love</h2>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="px-4 py-6 space-y-8">
              <MetalSelector 
                selected={selectedMetal}
                onSelect={setSelectedMetal}
              />
              
              <RingStyleSelector 
                selected={selectedRingStyle}
                onSelect={setSelectedRingStyle}
              />
              
              <DiamondShapeSelector 
                selected={selectedDiamondShape}
                onSelect={setSelectedDiamondShape}
              />
              
              <DiamondPreferenceSlider 
                value={diamondPreference}
                onChange={setDiamondPreference}
              />
              
              <BudgetSelector 
                selected={selectedBudget}
                onSelect={setSelectedBudget}
              />

              {/* View Rings Button */}
              <div className='pt-2'>
                <Button 
                  className="view-rings w-full bg-transparent border-2 border-yellow-600 text-yellow-600 hover:bg-yellow-600 hover:text-white py-6 transition-all duration-200"
                  size="lg"
                  onClick={() => handleViewChange('recommendations')}
                  disabled={isTransitioning}
                >
                  {isTransitioning ? 'LOADING...' : 'VIEW RINGS'}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}