import { useState, ReactNode } from 'react';

interface Tab {
  id: string;
  label: string;
  content: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
}

const Tabs = ({ tabs, defaultTab, activeTab: controlledActiveTab, onTabChange }: TabsProps) => {
  const [internalActiveTab, setInternalActiveTab] = useState(defaultTab || tabs[0]?.id || '');
  const activeTab = controlledActiveTab !== undefined ? controlledActiveTab : internalActiveTab;

  const activeTabContent = tabs.find((tab) => tab.id === activeTab)?.content;

  return (
    <div>
      {/* Tab buttons */}
      <div className="flex gap-[14px] border-b-2 border-zd-white text-base px-[20px]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              if (controlledActiveTab === undefined) {
                setInternalActiveTab(tab.id);
              }
              onTabChange?.(tab.id);
            }}
            className={`
              flex-1 transition-all grid
              outline-offset-[-10px]
              rounded-[14px]
              ${activeTab === tab.id ? 'bg-zd-black text-zd-white' : 'bg-zd-black text-zd-gray'}
            `}
          >
            <span
              className={`
              bg-amber-200 px-hgap-sm pt-vgap-sm pb-vgap-xs
              ${
                activeTab === tab.id
                  ? 'bg-zd-black text-zd-white border-t-2 border-l-2 border-r-2 border-zd-white'
                  : 'bg-zd-black text-zd-gray border-t-2 border-l-2 border-r-2 border-b-0 border-zd-gray hover:text-zd-white'
              }
            `}
            >
              {tab.label}
            </span>
            <span
              className={`
              ${
                activeTab === tab.id
                  ? 'mb-[-2px] bg-zd-black h-[14px] border-r-2 border-l-2 border-zd-white'
                  : 'h-[12px]'
              }
            `}
            ></span>
          </button>
        ))}
      </div>

      {/* Tab content with connected border */}
      <div>{activeTabContent}</div>
    </div>
  );
};

export default Tabs;
