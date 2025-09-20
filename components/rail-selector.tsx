'use client';

import type { RailOption } from '@/types';

interface RailSelectorProps {
  railOptions: RailOption[];
  selectedRail: RailOption | null;
  onRailSelect: (rail: RailOption) => void;
}

const RailSelector = ({ railOptions, selectedRail, onRailSelect }: RailSelectorProps) => {
  return (
    <div className="space-y-vgap-xs">
      <h3 className="font-semibold text-zd-white">Rail Type</h3>
      <div className="space-y-vgap-2xs">
        {railOptions.map((rail) => (
          <button
            key={rail.type}
            onClick={() => onRailSelect(rail)}
            className={`
              w-full text-left p-hgap-xs rounded-lg border-2 transition-all
              ${
                selectedRail?.type === rail.type
                  ? 'border-zd-link bg-zd-active'
                  : 'border-zd-gray hover:border-zd-link'
              }
            `}
          >
            <div className="flex justify-between items-center">
              <span className="font-medium">{rail.name}</span>
              <span className="text-zd-gray">¥{rail.price.toLocaleString()}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RailSelector;
