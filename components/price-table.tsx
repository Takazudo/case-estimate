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
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th
              rowSpan={2}
              className="bg-[#a8c8e1] text-black py-2 px-4 border border-gray-400 text-center"
            >
              ケースのモデル
            </th>
            <th
              colSpan={4}
              className="bg-[#a8c8e1] text-black text-center py-2 px-4 border border-gray-400"
            >
              レールの種類
            </th>
          </tr>
          <tr>
            <th className="bg-[#a8c8e1] text-black text-center py-2 px-4 border border-gray-400">
              Lite
            </th>
            <th className="bg-[#a8c8e1] text-black text-center py-2 px-4 border border-gray-400">
              Nuts
            </th>
            <th className="bg-[#a8c8e1] text-black text-center py-2 px-4 border border-gray-400">
              Dual
            </th>
            <th className="bg-[#a8c8e1] text-black text-center py-2 px-4 border border-gray-400">
              Metal
            </th>
          </tr>
        </thead>
        <tbody>
          {priceData.map((row, index) => (
            <tr key={row.model}>
              <td
                className={`${
                  index % 2 === 0 ? 'bg-[#a8c8e1]' : 'bg-[#d4e4f1]'
                } text-black text-left py-2 px-4 border border-gray-400 font-medium`}
              >
                {row.model}
              </td>
              <td
                className={`${
                  index % 2 === 0 ? 'bg-[#a8c8e1]' : 'bg-[#d4e4f1]'
                } text-black text-right py-2 px-4 border border-gray-400`}
              >
                {row.lite}
              </td>
              <td
                className={`${
                  index % 2 === 0 ? 'bg-[#a8c8e1]' : 'bg-[#d4e4f1]'
                } text-black text-right py-2 px-4 border border-gray-400`}
              >
                {row.nuts}
              </td>
              <td
                className={`${
                  index % 2 === 0 ? 'bg-[#a8c8e1]' : 'bg-[#d4e4f1]'
                } text-black text-right py-2 px-4 border border-gray-400`}
              >
                {row.dual}
              </td>
              <td
                className={`${
                  index % 2 === 0 ? 'bg-[#a8c8e1]' : 'bg-[#d4e4f1]'
                } text-black text-right py-2 px-4 border border-gray-400`}
              >
                {row.metal}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
