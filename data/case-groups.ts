import { cases, type CaseEntry } from './cases';

export interface CaseGroup {
  label: string;
  displayLabel: string;
  imageSlug: string;
  cases: CaseEntry[];
}

export const caseGroups: CaseGroup[] = [
  {
    label: 'zudo-block-60-open',
    displayLabel: 'Zudo Block 60 Open (Starter Kit)',
    imageSlug: 'zb60-open-high-view-a',
    cases: Object.entries(cases)
      .filter(([key]) => key.includes('zudo-block-60-open'))
      .sort(([keyA], [keyB]) => {
        // Order: 3DP-A, 3DP-B, 3DP-upgrade, ACR-A, ACR-B, ACR-upgrade
        const order = [
          'zudo-block-60-open-3DP-A',
          'zudo-block-60-open-3DP-B',
          'zudo-block-60-open-upgrade-3DP',
          'zudo-block-60-open-ACR-A',
          'zudo-block-60-open-ACR-B',
          'zudo-block-60-open-upgrade-ACR',
        ];
        return order.indexOf(keyA) - order.indexOf(keyB);
      }),
  },
  {
    label: 'zudo-block-60',
    displayLabel: 'Zudo Block 60',
    imageSlug: 'panels-gallery-zudo-blocks-110',
    cases: Object.entries(cases).filter(
      ([key]) => key.startsWith('zudo-block-60') && !key.includes('x2') && !key.includes('open'),
    ),
  },
  {
    label: 'zudo-block-40',
    displayLabel: 'Zudo Block 40',
    imageSlug: 'panels-gallery-zudo-blocks-102',
    cases: Object.entries(cases).filter(
      ([key]) => key.startsWith('zudo-block-40') && !key.includes('x2'),
    ),
  },
  {
    label: 'zudo-block-60x2',
    displayLabel: 'Zudo Block 60x2',
    imageSlug: 'panels-gallery-zudo-blocks-114',
    cases: Object.entries(cases).filter(([key]) => key.startsWith('zudo-block-60x2')),
  },
  {
    label: 'zudo-block-40x2',
    displayLabel: 'Zudo Block 40x2',
    imageSlug: 'panels-gallery-zudo-blocks-101',
    cases: Object.entries(cases).filter(([key]) => key.startsWith('zudo-block-40x2')),
  },
  {
    label: '10box',
    displayLabel: '10BOX Ju-Bako',
    imageSlug: 'panels-gallery-zudo-blocks-142',
    cases: Object.entries(cases).filter(([key]) => key.startsWith('10box')),
  },
  {
    label: 'zudo-stand',
    displayLabel: 'zudo-stand',
    imageSlug: 'zudo-stand-40-view1',
    cases: Object.entries(cases).filter(([key]) => key.startsWith('zudo-stand')),
  },
];
