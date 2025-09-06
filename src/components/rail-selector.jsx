const RailSelector = ({ railOptions, selectedRail, onRailSelect }) => {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-700">Rail Type</h3>
      <div className="space-y-2">
        {railOptions.map((rail) => (
          <button
            key={rail.type}
            onClick={() => onRailSelect(rail)}
            className={`
              w-full text-left p-3 rounded-lg border-2 transition-all
              ${
                selectedRail?.type === rail.type
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }
            `}
          >
            <div className="flex justify-between items-center">
              <span className="font-medium">{rail.name}</span>
              <span className="text-sm text-gray-600">¥{rail.price.toLocaleString()}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RailSelector;
