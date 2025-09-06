import { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/react/20/solid';
import type { Panel } from '../types';

interface PanelSelectorProps {
  panels: Panel[];
  panelColors: { [key: string]: string };
  selectedPanel: string | null;
  onPanelSelect: (panelId: string) => void;
  colorMap: { [key: string]: string };
}

const PanelSelector = ({
  panels,
  panelColors,
  selectedPanel,
  onPanelSelect,
  colorMap,
}: PanelSelectorProps) => {
  const selectedPanelObj = panels.find((p) => p.id === selectedPanel);
  const selectedColorValue = selectedPanel ? panelColors[selectedPanel] : undefined;
  const selectedColorName = selectedColorValue ? colorMap[selectedColorValue] : 'Default';

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-700">Select Panel</h3>
      <Listbox value={selectedPanel} onChange={onPanelSelect}>
        <div className="relative">
          <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-3 pl-3 pr-10 text-left border-2 border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
            <span className="block truncate">
              {selectedPanelObj ? (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{selectedPanelObj.name}</span>
                  <div className="flex items-center mr-6">
                    <div
                      className="w-5 h-5 rounded border border-gray-300 mr-2"
                      style={{ backgroundColor: selectedColorValue || '#f3f4f6' }}
                    />
                    <span className="text-xs text-gray-600">{selectedColorName}</span>
                  </div>
                </div>
              ) : (
                <span className="text-gray-500">Select a panel to customize</span>
              )}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none">
              {panels.map((panel) => {
                const colorValue = panelColors[panel.id];
                const colorName = colorMap[colorValue] || 'Default';

                return (
                  <Listbox.Option
                    key={panel.id}
                    className={({ active }) =>
                      `relative cursor-default select-none py-3 pl-10 pr-4 ${
                        active ? 'bg-blue-50 text-blue-900' : 'text-gray-900'
                      }`
                    }
                    value={panel.id}
                  >
                    {({ selected }) => (
                      <>
                        <div className="flex items-center justify-between">
                          <span
                            className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}
                          >
                            {panel.name}
                          </span>
                          <div className="flex items-center">
                            <div
                              className="w-5 h-5 rounded border border-gray-300 mr-2"
                              style={{ backgroundColor: colorValue || '#f3f4f6' }}
                            />
                            <span className="text-xs text-gray-600">{colorName}</span>
                          </div>
                        </div>
                        {selected ? (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                );
              })}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};

export default PanelSelector;
