'use client';

import { Fragment } from 'react';
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
  Transition,
} from '@headlessui/react';
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/react/20/solid';
import { cases } from '@/data/cases';

interface ModelSelectorProps {
  selectedCase: string | null;
  onCaseSelect: (caseType: string) => void;
}

const ModelSelector = ({ selectedCase, onCaseSelect }: ModelSelectorProps) => {
  // Group cases by their base model
  const caseGroups = [
    {
      label: 'Zudo Block 40',
      cases: Object.entries(cases).filter(([key]) => key.startsWith('zudo-block-40')),
    },
    {
      label: 'Zudo Block 60',
      cases: Object.entries(cases).filter(([key]) => key.startsWith('zudo-block-60')),
    },
    {
      label: '10BOX',
      cases: Object.entries(cases).filter(([key]) => key.startsWith('10box')),
    },
  ];

  const selectedCaseData = selectedCase ? cases[selectedCase] : null;

  return (
    <div className="space-y-vgap-xs pb-vgap-sm">
      <h3 className="font-semibold text-zd-white pb-vgap-xs">モデル選択</h3>
      <Listbox value={selectedCase ?? undefined} onChange={onCaseSelect}>
        <div className="relative text-sm">
          <ListboxButton className="relative w-full cursor-default rounded-lg bg-zd-gray2 py-vgap-sm pl-hgap-xs pr-hgap-sm text-left border-2 border-zd-gray focus:outline-none focus:border-zd-link focus:ring-2 focus:ring-zd-link/20 text-zd-white">
            <span className="block truncate">
              {selectedCaseData ? (
                <span className="font-medium">{selectedCaseData.name}</span>
              ) : (
                <span className="text-zd-gray">Select a case model</span>
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
              {caseGroups.map((group) => (
                <Fragment key={group.label}>
                  {group.cases.length > 0 && (
                    <>
                      {/* Group header - not selectable */}
                      <div className="px-hgap-xs py-vgap-xs bg-zd-gray2 text-zd-gray text-xs font-semibold uppercase tracking-wider sticky top-0 z-10">
                        {group.label}
                      </div>
                      {/* Group items */}
                      {group.cases.map(([key, caseData]) => (
                        <ListboxOption
                          key={key}
                          className={({ active }) =>
                            `relative cursor-default select-none py-[.5em] pl-hgap-md pr-hgap-xs ${
                              active ? 'bg-zd-active text-zd-white' : 'text-zd-white'
                            }`
                          }
                          value={key}
                        >
                          {({ selected }) => (
                            <>
                              <div className="flex items-center justify-between">
                                <span
                                  className={`block truncate ${
                                    selected ? 'font-medium' : 'font-normal'
                                  }`}
                                >
                                  {caseData.name}
                                </span>
                                {/* Material tag */}
                                <span className="text-xs text-zd-gray ml-2">
                                  {caseData.material === 'acrylic' ? 'Acrylic' : '3D Printed'}
                                </span>
                              </div>
                              {selected ? (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-hgap-xs text-zd-link">
                                  <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                </span>
                              ) : null}
                            </>
                          )}
                        </ListboxOption>
                      ))}
                    </>
                  )}
                </Fragment>
              ))}
            </ListboxOptions>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};

export default ModelSelector;
