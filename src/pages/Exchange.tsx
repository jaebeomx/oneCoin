import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, XAxis, YAxis, BarChart, Tooltip, CartesianGrid, ReferenceLine } from 'recharts';
import { debounce } from 'lodash-es';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ChartCandlestick, ChartNoAxesCombined } from 'lucide-react';

type CandleStickData = {
  close: string;
  high: string;
  low: string;
  open: string;
  quote_volume: string;
  target_volume: string;
  timestamp: number;
};

const CandleStick = (props: any) => {
  const {
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
    <g stroke={color} fill={color} strokeWidth="1.5">
      {/* rect */}
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
const CustomTooltip = (props: any) => {
  const { active, payload } = props;
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

const prepareData = (data: CandleStickData[]) => {
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

  const handleMouseMove = debounce((e) => {
    if (e.activePayload && e.activePayload.length > 0) {
      setHoverHigh(e.activePayload[0].payload.openClose[1]);
    }
  }, 10); // 10ms 디바운스 설정

  const handleWheel = debounce((e: React.WheelEvent<HTMLDivElement>) => {
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
  console.log('prepared data', data);

  // data 배열에서 가장 낮은 값을 찾음
  const minValue = data.reduce((minValue, { low, openClose: [open, close] }) => {
    const currentMin = Math.min(Number(low), Number(open), Number(close));
    return Math.min(minValue, currentMin); // minValue가 null이 아닌 경우에만 비교
  }, Number.POSITIVE_INFINITY); // 초기값을 양의 무한대로 설정

  // data 배열에서 가장 높은 값을 찾음
  const maxValue = data.reduce((maxValue, { high, openClose: [open, close] }) => {
    const currentMax = Math.max(Number(high), Number(open), Number(close));
    return Math.max(maxValue, currentMax); // maxValue가 음의 무한대가 아닌 경우에만 비교
  }, Number.NEGATIVE_INFINITY); // 초기값을 음의 무한대로 설정

  return (
    <div className="p-3">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ChartNoAxesCombined />
            Bitcoin Chart
            <div className="ml-2 animate-pulse text-[14px] font-bold text-red-500">🚨 실시간</div>
          </CardTitle>
          <CardDescription>최대 500개의 데이터를 조회할 수 있습니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex w-full items-center gap-[10px]">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Coin Name" autoComplete="off" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="framework">Interval</Label>
                <Select
                  value={interval}
                  onValueChange={(e) => {
                    console.log(e);
                    setInterval(e);
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Interval" />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      '1m',
                      '3m',
                      '5m',
                      '15m',
                      '30m',
                      '1h',
                      '2h',
                      '4h',
                      '6h',
                      '1d',
                      '1w',
                      '1mon',
                    ].map((value) => (
                      <SelectItem key={value} value={value}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="name">Fetch</Label>
                <div className="flex flex-col space-y-1.5">
                  <Button onClick={fetchChartData}>조회하기</Button>
                </div>
              </div>
            </div>
          </form>
          <div className="my-2 flex items-center gap-2">
            <ChartCandlestick strokeWidth={1.5} color="#ff0000" />
            <div>{size}봉</div>
          </div>

          {/* 코인 차트 */}
          <div
            onWheel={(e: React.WheelEvent<HTMLDivElement>) => {
              handleWheel(e);
            }}
          >
            <BarChart
              width={1000}
              height={350}
              data={data}
              margin={{ right: 30, bottom: 5 }}
              onMouseMove={handleMouseMove}
            >
              {/* X축 Y축 설정 */}
              <XAxis dataKey="timestamp" />
              <YAxis domain={[minValue, maxValue]} orientation="right" />

              <Tooltip content={<CustomTooltip />} />

              {/* 그래프 눈금 설정 */}
              <CartesianGrid />

              {/* 제공된 데이터 배열에서 특정 키를 참조하여 각 막대의 값을 결정 */}
              {/* 각 막대의 높이가 openClose 값을 기반으로 렌더링 */}
              <Bar dataKey="openClose" shape={<CandleStick />} isAnimationActive={false}></Bar>
              {hoverHigh !== null && (
                <ReferenceLine y={hoverHigh} stroke="red" strokeDasharray="3 3" />
              )}
            </BarChart>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Exchange;
