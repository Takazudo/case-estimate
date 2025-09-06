import React, { useState, useEffect } from 'react'
import { cases } from './data/cases'
import { colors } from './data/colors'
import PanelLayout from './components/PanelLayout'
import CaseSelector from './components/CaseSelector'
import ColorPicker from './components/ColorPicker'
import RailSelector from './components/RailSelector'
import PanelList from './components/PanelList'

function App() {
  const [selectedCase, setSelectedCase] = useState('zudo-block-40')
  const [selectedPanel, setSelectedPanel] = useState(null)
  const [selectedColor, setSelectedColor] = useState(null)
  const [panelColors, setPanelColors] = useState({})
  const [selectedRail, setSelectedRail] = useState(null)

  const currentCase = cases[selectedCase]
  const material = currentCase.material

  // Initialize rail selection
  useEffect(() => {
    if (currentCase && !selectedRail) {
      setSelectedRail(currentCase.railOptions[0])
    }
  }, [currentCase])

  // Load state from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const caseType = params.get('case')
    const railType = params.get('rail')
    const colorsParam = params.get('colors')

    if (caseType && cases[caseType]) {
      setSelectedCase(caseType)
    }

    if (railType && currentCase) {
      const rail = currentCase.railOptions.find(r => r.type === railType)
      if (rail) setSelectedRail(rail)
    }

    if (colorsParam) {
      try {
        const parsedColors = JSON.parse(decodeURIComponent(colorsParam))
        setPanelColors(parsedColors)
      } catch (e) {
        console.error('Failed to parse colors from URL', e)
      }
    }
  }, [])

  // Update URL when state changes
  useEffect(() => {
    const params = new URLSearchParams()
    params.set('case', selectedCase)
    if (selectedRail) {
      params.set('rail', selectedRail.type)
    }
    if (Object.keys(panelColors).length > 0) {
      params.set('colors', encodeURIComponent(JSON.stringify(panelColors)))
    }
    
    const newUrl = `${window.location.pathname}?${params.toString()}`
    window.history.replaceState({}, '', newUrl)
  }, [selectedCase, selectedRail, panelColors])

  const handlePanelClick = (panelId) => {
    setSelectedPanel(panelId)
  }

  const handleColorSelect = (color) => {
    setSelectedColor(color)
    if (selectedPanel) {
      setPanelColors(prev => ({
        ...prev,
        [selectedPanel]: color.value
      }))
    }
  }

  const handleCaseSelect = (caseType) => {
    setSelectedCase(caseType)
    setPanelColors({})
    setSelectedPanel(null)
    setSelectedColor(null)
    const newCase = cases[caseType]
    setSelectedRail(newCase.railOptions[0])
  }

  const handlePreset = (preset) => {
    const newColors = {}
    currentCase.panels.forEach(panel => {
      if (preset.colors.all) {
        const color = colors[material].find(c => c.id === preset.colors.all)
        if (color) newColors[panel.id] = color.value
      } else {
        // Apply primary/secondary pattern
        const isPrimary = panel.id.includes('side') || panel.id.includes('center')
        const colorId = isPrimary ? preset.colors.primary : preset.colors.secondary
        const color = colors[material].find(c => c.id === colorId)
        if (color) newColors[panel.id] = color.value
      }
    })
    setPanelColors(newColors)
  }

  const resetColors = () => {
    setPanelColors({})
    setSelectedPanel(null)
    setSelectedColor(null)
  }

  // Create color map for display
  const colorMap = {}
  colors[material]?.forEach(color => {
    colorMap[color.value] = color.name
  })

  const totalPrice = selectedRail ? selectedRail.price : 0

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Panel - Visualization */}
      <div className="flex-1 bg-white border-r border-gray-200">
        <div className="h-full flex flex-col">
          <div className="border-b border-gray-200 p-4">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-2xl font-bold text-gray-900">Takazudo Modular Case Estimate</h1>
            </div>
          </div>
          <div className="flex-1 p-8">
            <PanelLayout
              caseType={selectedCase}
              panelColors={panelColors}
              onPanelClick={handlePanelClick}
              selectedPanel={selectedPanel}
            />
          </div>
        </div>
      </div>

      {/* Right Panel - Controls */}
      <div className="w-96 bg-gray-50 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Case Selector */}
          <CaseSelector 
            selectedCase={selectedCase}
            onCaseSelect={handleCaseSelect}
          />

          {/* Rail Selector */}
          <RailSelector
            railOptions={currentCase.railOptions}
            selectedRail={selectedRail}
            onRailSelect={setSelectedRail}
          />

          {/* Panel List */}
          <PanelList
            panels={currentCase.panels}
            panelColors={panelColors}
            selectedPanel={selectedPanel}
            onPanelSelect={setSelectedPanel}
            colorMap={colorMap}
          />

          {/* Color Picker */}
          {selectedPanel && (
            <ColorPicker
              material={material}
              selectedColor={selectedColor}
              onColorSelect={handleColorSelect}
            />
          )}

          {/* Presets for 3D Printed */}
          {material === '3d-printed' && colors.presets['3d-printed'] && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-700">Presets</h3>
              <div className="space-y-2">
                {colors.presets['3d-printed'].map(preset => (
                  <button
                    key={preset.id}
                    onClick={() => handlePreset(preset)}
                    className="w-full text-left p-3 rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-all"
                  >
                    <span className="text-sm">{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={resetColors}
              className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Reset All Colors
            </button>
          </div>

          {/* Price Display */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total Price:</span>
              <span className="text-2xl font-bold text-blue-600">
                ¥{totalPrice.toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              * Price includes selected rail type and shipping
            </p>
          </div>

          {/* Info */}
          <div className="text-xs text-gray-500 space-y-1">
            <p>• Click on any panel to select it</p>
            <p>• Choose a color to apply to the selected panel</p>
            <p>• Your configuration is saved in the URL</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App