import React from 'react'
import { cases } from '../data/cases'

const CaseSelector = ({ selectedCase, onCaseSelect }) => {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-700">Case Model</h3>
      <select
        value={selectedCase}
        onChange={(e) => onCaseSelect(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {Object.entries(cases).map(([key, caseData]) => (
          <option key={key} value={key}>
            {caseData.name}
          </option>
        ))}
      </select>
    </div>
  )
}

export default CaseSelector