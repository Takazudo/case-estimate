import React from 'react'
import PanelSVG from './PanelSVG'

const PanelLayout = ({ caseType, panelColors, onPanelClick, selectedPanel }) => {
  const is60hp = caseType.includes('60')
  
  const renderPanel = (panelId, type, position, size) => {
    const color = panelColors[panelId] || '#1f2937'
    const isSelected = selectedPanel === panelId
    
    return (
      <div
        key={panelId}
        className={`absolute cursor-pointer transition-all ${
          isSelected ? 'ring-4 ring-blue-500 z-10 scale-105' : 'hover:opacity-80'
        }`}
        style={{ ...position, ...size }}
        onClick={() => onPanelClick(panelId)}
      >
        <PanelSVG type={type} color={color} className="w-full h-full" />
      </div>
    )
  }

  const panelWidth = is60hp ? 280 : 200
  const sideWidth = 60
  const topHeight = 80
  const bottomHeight = 180
  const centerHeight = 80
  const gap = 20

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="relative" style={{ width: `${panelWidth + sideWidth * 2 + gap * 4}px`, height: '600px' }}>
        {/* Top row */}
        {renderPanel('top-front', is60hp ? '60hp-front-back-top' : '40hp-front-back-top', 
          { top: 0, left: '50%', transform: 'translateX(-50%)' },
          { width: `${panelWidth}px`, height: `${topHeight}px` }
        )}
        {renderPanel('top-back', is60hp ? '60hp-front-back-top' : '40hp-front-back-top', 
          { top: `${topHeight + gap}px`, left: '50%', transform: 'translateX(-50%)' },
          { width: `${panelWidth}px`, height: `${topHeight}px` }
        )}
        
        {/* Middle row */}
        {renderPanel('left-side', is60hp ? 'shared-side-tall' : 'shared-side-short', 
          { top: `${(topHeight + gap) * 2}px`, left: 0 },
          { width: `${sideWidth}px`, height: `${is60hp ? 250 : 200}px` }
        )}
        {renderPanel('center-top', is60hp ? '60hp-bottom' : '40hp-bottom', 
          { top: `${(topHeight + gap) * 2}px`, left: '50%', transform: 'translateX(-50%)' },
          { width: `${panelWidth}px`, height: `${centerHeight}px` }
        )}
        {renderPanel('center-bottom', is60hp ? '60hp-bottom' : '40hp-bottom', 
          { top: `${(topHeight + gap) * 2 + centerHeight + gap}px`, left: '50%', transform: 'translateX(-50%)' },
          { width: `${panelWidth}px`, height: `${centerHeight}px` }
        )}
        {renderPanel('right-side', is60hp ? 'shared-side-tall' : 'shared-side-short', 
          { top: `${(topHeight + gap) * 2}px`, right: 0 },
          { width: `${sideWidth}px`, height: `${is60hp ? 250 : 200}px` }
        )}
        
        {/* Bottom row */}
        {renderPanel('bottom-front', is60hp ? '60hp-front-back-bottom' : '40hp-front-back-bottom', 
          { bottom: `${bottomHeight + gap}px`, left: '50%', transform: 'translateX(-50%)' },
          { width: `${panelWidth}px`, height: `${bottomHeight}px` }
        )}
        {renderPanel('bottom-back', is60hp ? '60hp-front-back-bottom' : '40hp-front-back-bottom', 
          { bottom: 0, left: '50%', transform: 'translateX(-50%)' },
          { width: `${panelWidth}px`, height: `${bottomHeight}px` }
        )}
      </div>
    </div>
  )
}

export default PanelLayout