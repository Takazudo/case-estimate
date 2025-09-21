'use client';

import { Fragment, useState, useEffect } from 'react';
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
  Transition,
} from '@headlessui/react';
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/react/20/solid';
import type { Panel } from '@/types';

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
  const [panelAnimationKey, setPanelAnimationKey] = useState(0);
  const [colorAnimationKey, setColorAnimationKey] = useState(0);
  const [prevSelectedPanel, setPrevSelectedPanel] = useState<string | null>(null);
  const [prevColorValue, setPrevColorValue] = useState<string | undefined>(undefined);

  const selectedPanelObj = panels.find((p) => p.id === selectedPanel);
  const selectedColorValue = selectedPanel ? panelColors[selectedPanel] : undefined;
  const selectedColorName = selectedColorValue ? colorMap[selectedColorValue] : 'Default';

  // Track panel changes separately from color changes
  useEffect(() => {
    if (selectedPanel !== prevSelectedPanel) {
      setPanelAnimationKey((prev) => prev + 1);
      setPrevSelectedPanel(selectedPanel);
    }
  }, [selectedPanel, prevSelectedPanel]);

  // Track color changes
  useEffect(() => {
    if (selectedColorValue !== prevColorValue) {
      setColorAnimationKey((prev) => prev + 1);
      setPrevColorValue(selectedColorValue);
    }
  }, [selectedColorValue, prevColorValue]);

  return (
    <div className="space-y-vgap-xs">
      <h3 className="font-semibold text-zd-white pb-vgap-xs">Select Panel</h3>
      <Listbox value={selectedPanel} onChange={onPanelSelect}>
        <div className="relative text-sm">
          <ListboxButton className="relative w-full cursor-default rounded-lg bg-zd-gray2 py-vgap-sm pl-hgap-xs pr-hgap-sm text-left border-2 border-zd-gray focus:outline-none focus:border-zd-link focus:ring-2 focus:ring-zd-link/20 text-zd-white">
            <span className="block truncate">
              {selectedPanelObj ? (
                <div className="flex items-center justify-between">
                  <span
                    key={`panel-${panelAnimationKey}`}
                    className="font-medium"
                    style={{
                      animation: 'quickFadeIn 200ms ease-out',
                    }}
                  >
                    {selectedPanelObj.name}
                  </span>
                  <div
                    key={`color-${colorAnimationKey}`}
                    className="flex items-center mr-hgap-sm"
                    style={{
                      animation: 'quickFadeIn 200ms ease-out',
                    }}
                  >
                    <div
                      className="w-5 h-5 rounded border border-zd-gray mr-hgap-2xs"
                      style={{ backgroundColor: selectedColorValue || '#f3f4f6' }}
                    />
                    <span className="text-zd-gray">{selectedColorName}</span>
                  </div>
                </div>
              ) : (
                <span className="text-zd-gray">Select a panel to customize</span>
              )}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon className="h-5 w-5 text-zd-gray" aria-hidden="true" />
            </span>
          </ListboxButton>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <ListboxOptions className="absolute z-20 mt-1px max-h-[400px] w-full overflow-auto rounded-lg bg-zd-black border-2 border-zd-gray shadow-2xl focus:outline-none">
              {panels.map((panel) => {
                const colorValue = panelColors[panel.id];
                const colorName = colorMap[colorValue] || 'Default';

                return (
                  <ListboxOption
                    key={panel.id}
                    className={({ active }) =>
                      `relative cursor-default select-none py-[.5em] first:pt-[1em] last:pb-[1em] pl-hgap-md pr-hgap-xs ${
                        active ? 'bg-zd-active text-zd-white' : 'text-zd-white'
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
                              className="w-5 h-5 rounded border border-zd-gray mr-hgap-2xs"
                              style={{ backgroundColor: colorValue || '#f3f4f6' }}
                            />
                            <span className="text-zd-gray">{colorName}</span>
                          </div>
                        </div>
                        {selected ? (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-hgap-xs text-zd-link">
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </ListboxOption>
                );
              })}
            </ListboxOptions>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};

export default PanelSelector;
