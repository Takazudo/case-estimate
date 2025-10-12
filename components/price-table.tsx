import React from 'react';

const priceData = [
  { model: 'zudo-block-40-3DP-A/B', lite: '4,980', nuts: '6,980', dual: '9,080', metal: '12,480' },
  { model: 'zudo-block-40-ACR-A/B', lite: '7,980', nuts: '9,980', dual: '12,080', metal: '15,480' },
  {
    model: 'zudo-block-40x2-3DP-A/B',
    lite: '15,060',
    nuts: '21,060',
    dual: '24,360',
    metal: '34,560',
  },
  {
    model: 'zudo-block-40x2-ACR-A/B',
    lite: '18,060',
    nuts: '24,060',
    dual: '27,360',
    metal: '37,560',
  },
  { model: 'zudo-block-60-3DP-A/B', lite: '6,980', nuts: '9,980', dual: '12,080', metal: '15,480' },
  {
    model: 'zudo-block-60-ACR-A/B',
    lite: '8,980',
    nuts: '11,980',
    dual: '14,080',
    metal: '17,480',
  },
  {
    model: 'zudo-block-60x2-3DP-A/B',
    lite: '17,760',
    nuts: '26,760',
    dual: '32,060',
    metal: '42,260',
  },
  {
    model: 'zudo-block-60x2-ACR-A/B',
    lite: '19,760',
    nuts: '28,760',
    dual: '34,060',
    metal: '44,260',
  },
  {
    model: 'zudo-block-60-open-3DP-A/B',
    lite: '3,480',
    nuts: '5,480',
    dual: '7,580',
    metal: '10,980',
  },
  {
    model: 'zudo-block-60-open-ACR-A/B',
    lite: '4,280',
    nuts: '6,280',
    dual: '8,380',
    metal: '11,780',
  },
  {
    model: 'zudo-block-60-open-upgrade-3DP',
    lite: 'dummy',
    nuts: 'dummy',
    dual: 'dummy',
    metal: 'dummy',
  },
  {
    model: 'zudo-block-60-open-upgrade-ACR',
    lite: 'dummy',
    nuts: 'dummy',
    dual: 'dummy',
    metal: 'dummy',
  },
  { model: '10BOX-shallow-3DP', lite: '19,680', nuts: '28,680', dual: '28,880', metal: '35,680' },
  { model: '10BOX-deep-3DP', lite: '20,680', nuts: '29,680', dual: '29,880', metal: '36,680' },
];

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
    modelCell: `${bg} ${baseCellStyle} ${basePadding} text-left font-medium`,
  });

  const bodyCellStyle = {
    even: createBodyStyles(bgEvenRow),
    odd: createBodyStyles(bgOddRow),
  };

  return (
    <div className="pb-vgap-lg">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th rowSpan={2} className={headerCellStyle.center}>
                ケースのモデル
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
            {priceData.map((row, index) => {
              const styles = index % 2 === 0 ? bodyCellStyle.even : bodyCellStyle.odd;

              return (
                <tr key={row.model}>
                  <td className={styles.modelCell}>{row.model}</td>
                  <td className={styles.right}>{row.lite}</td>
                  <td className={styles.right}>{row.nuts}</td>
                  <td className={styles.right}>{row.dual}</td>
                  <td className={styles.right}>{row.metal}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
