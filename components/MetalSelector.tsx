interface MetalSelectorProps {
  selected: string;
  onSelect: (metal: string) => void;
}

export function MetalSelector({ selected, onSelect }: MetalSelectorProps) {
  const metals = [
    { id: 'white-metals', name: 'white metals', percentage: '75% choose', bgColor: 'bg-gray-500' },
    { id: 'yellow-gold', name: 'yellow gold', percentage: '20% choose', bgColor: 'bg-yellow-500' },
    { id: 'rose-gold', name: 'rose gold', percentage: '5% choose', bgColor: 'bg-rose-400' }
  ];

  return (
    <div className='metals'>
      <h3 className="text-gray-800 mb-2 uppercase tracking-wide">Choose your metal color</h3>
      <div className="space-y-3">
        <div className="flex gap-2">
          {metals.map((metal) => (
            <button
              key={metal.id}
              onClick={() => onSelect(metal.id)}
              className={`flex-1 py-1 px-4 text-center transition-all ${
                metal.bgColor
              } text-white ${
                selected === metal.id 
                  ? 'active' 
                  : ''
              }`}
            >
              <div className="text-sm">{metal.name}</div>
            </button>
          ))}
        </div>
        
        {/* Percentage display below */}
        <div className="percentage flex gap-2">
          {metals.map((metal) => (
            <div key={`${metal.id}-percentage`} className="flex-1 text-center">
              {metal.percentage && (
                <div className="text-xs text-gray-500 italic">{metal.percentage}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}