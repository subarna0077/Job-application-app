import { BarChart, Bar, Cell, XAxis, YAxis, ResponsiveContainer } from 'recharts';


export interface DataType {
    key: string,
    color: string,
    count: number
}


const TinyBarChart = ({ data }: {data: DataType[]} ) => {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart
        data={data}
        margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
        barCategoryGap="20%"
      >
        <XAxis
          dataKey="key"
          tick={{ fontSize: 10, fill: '#ac9a9a' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 10, fill: '#aaa' }}
          axisLine={false}
          tickLine={false}
        />
        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={index} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default TinyBarChart;