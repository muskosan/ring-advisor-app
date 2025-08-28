interface BudgetSelectorProps {
  selected: string;
  onSelect: (budget: string) => void;
}

export function BudgetSelector({ selected, onSelect }: BudgetSelectorProps) {
  const budgets = ['4k', '8k', '12k', '20k', 'other'];

  return (
    <div>
      <h3 className="text-gray-800 mb-2 uppercase tracking-wide">Approx. Budget</h3>
      <div className="flex gap-2">
        {budgets.map((budget) => (
          <button
            key={budget}
            onClick={() => onSelect(budget)}
            className={`budget flex-1 py-1 px-4 rounded-lg text-center transition-colors ${
              selected === budget 
                ? 'bg-gray-800 text-white' 
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {budget}
          </button>
        ))}
      </div>
    </div>
  );
}