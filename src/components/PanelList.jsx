import React from 'react'

const PanelList = ({ panels, panelColors, selectedPanel, onPanelSelect, colorMap }) => {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-700">Panels</h3>
      <div className="space-y-2 max-h-[300px] overflow-y-auto">
        {panels.map((panel) => {
          const colorValue = panelColors[panel.id]
          const colorName = colorMap[colorValue] || 'Default'
          
          return (
            <button
              key={panel.id}
              onClick={() => onPanelSelect(panel.id)}
              className={`
                w-full text-left p-3 rounded-lg border-2 transition-all
                ${selectedPanel === panel.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{panel.name}</span>
                <div className="flex items-center">
                  <div 
                    className="w-5 h-5 rounded border border-gray-300 mr-2"
                    style={{ backgroundColor: colorValue || '#1f2937' }}
                  />
                  <span className="text-xs text-gray-600">{colorName}</span>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default PanelList