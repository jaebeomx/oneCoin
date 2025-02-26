import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Bar,
  ComposedChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Cell,
  BarChart,
  Tooltip,
  Legend,
  Line,
  LineChart,
  CartesianGrid,
  Brush,
  ReferenceLine,
} from 'recharts';
import { debounce } from 'lodash-es';

const CandleStick = (props) => {
  // console.log('CandleStick:', props);
  const {
    fill,
    x,
    y,
    width,
    height,
    low,
    high,
    openClose: [open, close],
  } = props;

  const isGrowing = open < close;
  const color = isGrowing ? 'red' : 'blue';
  const ratio = Math.abs(height / (open - close));

  return (
    <g stroke={color} fill={color} strokeWidth="2">
      <path
        d={`
          M ${x},${y}
          L ${x},${y + height}
          L ${x + width},${y + height}
          L ${x + width},${y}
          L ${x},${y}
        `}
      />
      {/* bottom line */}
      {isGrowing ? (
        <path
          d={`
            M ${x + width / 2}, ${y + height}
            v ${(open - low) * ratio}
          `}
        />
      ) : (
        <path
          d={`
            M ${x + width / 2}, ${y}
            v ${(close - low) * ratio}
          `}
        />
      )}
      {/* top line */}
      {isGrowing ? (
        <path
          d={`
            M ${x + width / 2}, ${y}
            v ${(close - high) * ratio}
          `}
        />
      ) : (
        <path
          d={`
            M ${x + width / 2}, ${y + height}
            v ${(open - high) * ratio}
          `}
        />
      )}
    </g>
  );
};

// 커스텀 툴팁 컴포넌트 정의
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { timestamp, openClose } = payload[0].payload; // 필요한 데이터 추출
    return (
      <div className="custom-tooltip">
        <p>{`시간: ${new Date(timestamp).toLocaleString()}`}</p>
        <p>{`Open: ${openClose[0]}`}</p>
        <p>{`Close: ${openClose[1]}`}</p>
      </div>
    );
  }
  return null;
};

const prepareData = (data) => {
  return data.map(({ open, close, ...other }) => {
    return {
      ...other,
      openClose: [open, close],
    };
  });
};

const Exchange = () => {
  const [chartData, setChartData] = useState([]);
  const [size, setSize] = useState(100);
  const [hoverHigh, setHoverHigh] = useState(null);

  const fetchChartData = () => {
    fetch(`/api/public/v2/chart/KRW/BTC?interval=1m&size=${size}`)
      .then((res) => res.json())
      .then((data) => {
        setChartData(data.chart);
      });
  };

  const handleMouseMove = debounce((e) => {
    if (e.activePayload && e.activePayload.length > 0) {
      setHoverHigh(e.activePayload[0].payload.openClose[1]);
    }
  }, 10); // 10ms 디바운스 설정

  useEffect(() => {
    fetchChartData();
  }, []); // size가 변경될 때마다 refetch

  const data = prepareData(chartData); // open과 close를 배열로 묶어서 저장

  // const data = prepareData(rawData); // open과 close를 배열로 묶어서 저장

  data.reduce((acc, item) => console.log(item), 0); // 각각의 data 출력

  // data 배열에서 가장 낮은 값을 찾음
  const minValue = data.reduce((minValue, { low, openClose: [open, close] }) => {
    const currentMin = Math.min(low, open, close);
    return minValue === null || currentMin < minValue ? currentMin : minValue;
  }, null);

  // data 배열에서 가장 높은 값을 찾음
  const maxValue = data.reduce((maxValue, { high, openClose: [open, close] }) => {
    const currentMax = Math.max(high, open, close);
    return currentMax > maxValue ? currentMax : maxValue;
  }, minValue);

  // console.log(data);
  // console.log(minValue, maxValue);

  return (
    <div className="p-3">
      <div className="mb-4 flex items-center gap-2">
        <input
          type="number"
          value={size}
          onChange={(e) => {
            const newSize = e.target.value; // 입력값을 문자열로 가져옴
            setSize(Number(newSize));
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              fetchChartData();
            }
          }}
          className="rounded border bg-primary p-2 text-background"
          min={0}
          max={1000}
        />
        <button onClick={fetchChartData} className="rounded bg-primary px-4 py-2 text-background">
          BTC 조회하기
        </button>
      </div>
      <div
        onWheel={(e) => {
          console.log(e);
        }}
      >
        <BarChart
          // width={1000}
          width={window.innerWidth}
          height={350}
          data={data}
          margin={{ top: 20, right: 30, left: 30, bottom: 5 }}
          onMouseMove={handleMouseMove}
        >
          {/* X축 Y축 설정 */}
          <XAxis dataKey="timestamp" />
          <YAxis domain={[minValue, maxValue]} />

          <Tooltip content={<CustomTooltip />} />

          {/* 그래프 눈금 설정 */}
          <CartesianGrid />

          {/* 제공된 데이터 배열에서 특정 키를 참조하여 각 막대의 값을 결정 */}
          {/* 각 막대의 높이가 openClose 값을 기반으로 렌더링 */}
          <Bar
            dataKey="openClose"
            // fill="#8884d8"
            shape={<CandleStick />}
            isAnimationActive={false}
            // label={{ position: 'top' }}
            // activeBar={{ strokeWidth: 0.5, stroke: 'red' }}
          >
            {/* {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={'black'} />
            ))} */}
          </Bar>
          {hoverHigh !== null && <ReferenceLine y={hoverHigh} stroke="red" strokeDasharray="3 3" />}
        </BarChart>
      </div>
    </div>
  );
};

export default Exchange;
