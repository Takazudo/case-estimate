import React from 'react';

const priceData = [
  { model: 'zudo-block-40-3DP', lite: '4,980', nuts: '6,980', dual: '9,080', metal: '12,480' },
  { model: 'zudo-block-40-ACR', lite: '7,980', nuts: '9,980', dual: '12,080', metal: '15,480' },
  { model: 'zudo-block-40x2-3DP', lite: '15,060', nuts: '21,060', dual: '24,360', metal: '34,560' },
  { model: 'zudo-block-40x2-ACR', lite: '18,060', nuts: '24,060', dual: '27,360', metal: '37,560' },
  { model: 'zudo-block-60-3DP', lite: '6,980', nuts: '9,980', dual: '12,080', metal: '15,480' },
  { model: 'zudo-block-60-ACR', lite: '8,980', nuts: '11,980', dual: '14,080', metal: '17,480' },
  { model: 'zudo-block-60x2-3DP', lite: '17,760', nuts: '26,760', dual: '32,060', metal: '42,260' },
  { model: 'zudo-block-60x2-ACR', lite: '19,760', nuts: '28,760', dual: '34,060', metal: '44,260' },
  { model: '10BOX-3DP', lite: '19,680', nuts: '25,680', dual: '28,880', metal: '35,680' },
];

export function PriceTable() {
  // Define className variables for background colors
  const bgHeader = 'bg-zd-gray2';
  const bgEvenRow = 'bg-zd-gray2';
  const bgOddRow = 'bg-zd-black';

  // Base styles
  const baseCellStyle = 'border border-zd-gray whitespace-nowrap';

  // Header cell style group
  const headerCellStyle = {
    base: `${bgHeader} ${baseCellStyle} py-vgap-sm px-hgap-sm text-lg`,
    center: `${bgHeader} ${baseCellStyle} text-center py-vgap-md px-hgap-sm text-xl`,
  };

  // Body cell style group
  const bodyCellStyle = {
    even: {
      base: `${bgEvenRow} ${baseCellStyle} py-vgap-sm px-hgap-sm`,
      left: `${bgEvenRow} ${baseCellStyle} text-left py-vgap-sm px-hgap-sm`,
      right: `${bgEvenRow} ${baseCellStyle} text-right py-vgap-sm px-hgap-sm`,
      modelCell: `${bgEvenRow} ${baseCellStyle} text-left font-medium py-vgap-sm px-hgap-sm`,
    },
    odd: {
      base: `${bgOddRow} ${baseCellStyle} py-vgap-sm px-hgap-sm`,
      left: `${bgOddRow} ${baseCellStyle} text-left py-vgap-sm px-hgap-sm`,
      right: `${bgOddRow} ${baseCellStyle} text-right py-vgap-sm px-hgap-sm`,
      modelCell: `${bgOddRow} ${baseCellStyle} text-left font-medium py-vgap-sm px-hgap-sm`,
    },
  };

  return (
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
  );
}
