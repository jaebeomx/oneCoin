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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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

// const prepareData = (data) => {
//   return data.map(({ open, close, ...other }) => {
//     return {
//       ...other,
//       openClose: [open, close],
//     };
//   });
// };
const prepareData = (data) => {
  return data
    .map(({ open, close, ...other }) => {
      return {
        ...other,
        openClose: [open, close],
      };
    })
    .reverse(); // 데이터를 역순으로 변환
};

const Exchange = () => {
  const [chartData, setChartData] = useState([]);
  const [size, setSize] = useState(100);
  const [hoverHigh, setHoverHigh] = useState(null);
  const [interval, setInterval] = useState('1d');

  const fetchChartData = () => {
    fetch(`/api/public/v2/chart/KRW/BTC?interval=${interval}&size=${size}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setChartData(data.chart);
      });
  };

  const handleMouseDown = (e) => {
    dragStartX.current = e.clientX; // 마우스 클릭 시작 위치 저장
    isDragging.current = true;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = debounce((e) => {
    if (e.activePayload && e.activePayload.length > 0) {
      setHoverHigh(e.activePayload[0].payload.openClose[1]);
    }
  }, 10); // 10ms 디바운스 설정

  const handleWheel = debounce((e: WheelEvent) => {
    e.preventDefault(); // 기본 스크롤 동작 방지

    const delta = Math.sign(e.deltaY); // 줌인: -1, 줌아웃: 1
    const changeAmount = 10; // 한 번에 변경할 데이터 수량

    setSize((prevSize) => {
      const newSize = Math.max(50, Math.min(1000, prevSize + delta * changeAmount));
      return newSize;
    });
  }, 10); // 10ms 디바운스

  useEffect(() => {
    fetchChartData();
  }, [size]); // size가 변경될 때마다 데이터 조회

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

        <Select
          value={interval}
          onValueChange={(e) => {
            setInterval(e);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1m">1m</SelectItem>
            <SelectItem value="3m">3m</SelectItem>
            <SelectItem value="5m">5m</SelectItem>
            <SelectItem value="10m">10m</SelectItem>
            <SelectItem value="15m">15m</SelectItem>
            <SelectItem value="30m">30m</SelectItem>
            <SelectItem value="1h">1h</SelectItem>
            <SelectItem value="2h">2h</SelectItem>
            <SelectItem value="4h">4h</SelectItem>
            <SelectItem value="6h">6h</SelectItem>
            <SelectItem value="1d">1d</SelectItem>
            <SelectItem value="1w">1w</SelectItem>
            <SelectItem value="1mon">1mon</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div
        onWheel={(e) => {
          handleWheel(e);
        }}
        // className="overflow-hidden" // 스크롤바 숨김
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
