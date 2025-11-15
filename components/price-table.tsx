import React from 'react';
import { H3 } from './article/h3';

type PriceRowWithRails = {
  model: string;
  lite: number;
  nuts: number;
  dual: number;
  metal: number;
};

type SimplePriceRow = {
  model: string;
  price: number;
};

// Main case models with rail options
const caseModelsData: PriceRowWithRails[] = [
  { model: 'zudo-block-40-3DP-A/B', lite: 4980, nuts: 6980, dual: 9080, metal: 12480 },
  { model: 'zudo-block-40-ACR-A/B', lite: 7980, nuts: 9980, dual: 12080, metal: 15480 },
  {
    model: 'zudo-block-40x2-3DP-A/B',
    lite: 15060,
    nuts: 21060,
    dual: 24360,
    metal: 34560,
  },
  {
    model: 'zudo-block-40x2-ACR-A/B',
    lite: 18060,
    nuts: 24060,
    dual: 27360,
    metal: 37560,
  },
  { model: 'zudo-block-60-3DP-A/B', lite: 6980, nuts: 9980, dual: 12080, metal: 15480 },
  {
    model: 'zudo-block-60-ACR-A/B',
    lite: 8980,
    nuts: 11980,
    dual: 14080,
    metal: 17480,
  },
  {
    model: 'zudo-block-60x2-3DP-A/B',
    lite: 17760,
    nuts: 26760,
    dual: 32060,
    metal: 42260,
  },
  {
    model: 'zudo-block-60x2-ACR-A/B',
    lite: 19760,
    nuts: 28760,
    dual: 34060,
    metal: 44260,
  },
  {
    model: 'zudo-block-60-open-3DP-A/B',
    lite: 3480,
    nuts: 6480,
    dual: 9580,
    metal: 12980,
  },
  {
    model: 'zudo-block-60-open-ACR-A/B',
    lite: 4280,
    nuts: 7280,
    dual: 9380,
    metal: 12780,
  },
  { model: '10box-shallow-3DP', lite: 19680, nuts: 28680, dual: 28880, metal: 35680 },
  { model: '10box-deep-3DP', lite: 20680, nuts: 29680, dual: 29880, metal: 36680 },
];

// Upgrade kits (panels only, no rails)
const upgradeKitsData: SimplePriceRow[] = [
  { model: 'zudo-block-60-open-upgrade-3DP', price: 4980 },
  { model: 'zudo-block-60-open-upgrade-ACR', price: 6180 },
];

// Accessories
const accessoriesData: SimplePriceRow[] = [
  { model: 'zudo-stand-40', price: 2480 },
  { model: 'zudo-stand-40x2', price: 2980 },
  { model: 'zudo-stand-60', price: 3980 },
  { model: 'zudo-stand-60x2', price: 4480 },
];

/**
 * Formats a price value for display
 * @param price - A number or string (for special values like 'dummy')
 * @returns Formatted string with comma separators for numbers
 */
function formatPrice(price: number | string): string {
  if (typeof price === 'string') {
    return price;
  }
  return price.toLocaleString('ja-JP');
}

export function PriceTable() {
  // Define className variables for background colors
  const bgHeader = 'bg-zd-gray2';
  const bgEvenRow = 'bg-zd-black';
  const bgOddRow = 'bg-zd-gray2';

  // Base styles
  const baseCellStyle = 'border border-zd-gray whitespace-nowrap';
  const basePadding = 'py-vgap-sm px-hgap-sm';

  // Header cell style group
  const headerCellStyle = {
    center: `${bgHeader} ${baseCellStyle} py-vgap-md px-hgap-sm text-center text-xl`,
  };

  // Body cell style group helper
  const createBodyStyles = (bg: string) => ({
    base: `${bg} ${baseCellStyle} ${basePadding}`,
    left: `${bg} ${baseCellStyle} ${basePadding} text-left`,
    right: `${bg} ${baseCellStyle} ${basePadding} text-right`,
    center: `${bg} ${baseCellStyle} ${basePadding} text-center`,
    modelCell: `${bg} ${baseCellStyle} ${basePadding} text-left font-medium`,
  });

  const bodyCellStyle = {
    even: createBodyStyles(bgEvenRow),
    odd: createBodyStyles(bgOddRow),
  };

  return (
    <div className="space-y-vgap-xl pb-vgap-lg">
      {/* Main Case Models Table */}
      <div>
        <H3 subText="Basic Lineup">基本ラインナップ</H3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th rowSpan={2} className={headerCellStyle.center}>
                  モデル
                </th>
                <th colSpan={4} className={`${headerCellStyle.center} border-b-0`}>
                  レールの種類
                </th>
              </tr>
              <tr>
                <th className={headerCellStyle.center}>Lite</th>
                <th className={headerCellStyle.center}>Nuts</th>
                <th className={headerCellStyle.center}>Dual</th>
                <th className={headerCellStyle.center}>Metal</th>
              </tr>
            </thead>
            <tbody>
              {caseModelsData.map((row, index) => {
                const styles = index % 2 === 0 ? bodyCellStyle.even : bodyCellStyle.odd;
                return (
                  <tr key={row.model}>
                    <td className={styles.modelCell}>{row.model}</td>
                    <td className={styles.right}>{formatPrice(row.lite)}</td>
                    <td className={styles.right}>{formatPrice(row.nuts)}</td>
                    <td className={styles.right}>{formatPrice(row.dual)}</td>
                    <td className={styles.right}>{formatPrice(row.metal)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upgrade Kits Table */}
      <div>
        <H3 subText="Upgrade Kits">アップグレードキット</H3>
        <p className="mb-vgap-sm text-sm text-zd-gray3">
          ※ パネルのみの販売です。レールは付属しません。
        </p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className={headerCellStyle.center}>モデル</th>
                <th className={headerCellStyle.center}>価格</th>
              </tr>
            </thead>
            <tbody>
              {upgradeKitsData.map((row, index) => {
                const styles = index % 2 === 0 ? bodyCellStyle.even : bodyCellStyle.odd;
                return (
                  <tr key={row.model}>
                    <td className={styles.modelCell}>{row.model}</td>
                    <td className={styles.right}>{formatPrice(row.price)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Accessories Table */}
      <div>
        <H3 subText="Accessories">アクセサリー</H3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className={headerCellStyle.center}>モデル</th>
                <th className={headerCellStyle.center}>価格</th>
              </tr>
            </thead>
            <tbody>
              {accessoriesData.map((row, index) => {
                const styles = index % 2 === 0 ? bodyCellStyle.even : bodyCellStyle.odd;
                return (
                  <tr key={row.model}>
                    <td className={styles.modelCell}>{row.model}</td>
                    <td className={styles.right}>{formatPrice(row.price)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
