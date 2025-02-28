import { useEffect, useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Bar,
  XAxis,
  YAxis,
  BarChart,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  Rectangle,
  ResponsiveContainer,
} from 'recharts';
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
import RealtimeInfo from '@/components/RealtimeInfo';
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

  const isGrowing = Number(open) < Number(close);
  const color = isGrowing ? '#dc2626' : '#2563eb';
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
      <div className="rounded-lg border border-secondary bg-background-elevated p-3 shadow-lg">
        <p className="text-center text-sm font-semibold text-primary">{`${new Date(timestamp).toLocaleDateString('ko-KR', { year: 'numeric', month: 'numeric', day: 'numeric' })}`}</p>
        <p className="text-teritary text-sm">{`시가: ${Number(openClose[0]).toLocaleString()}원`}</p>
        <p className="text-teritary text-sm">{`종가: ${Number(openClose[1]).toLocaleString()}원`}</p>
      </div>
    );
  }
  return null;
};

const CustomCursor = (props: any) => {
  // 사용 가능 props bottom, brushButtom, className, fill, height, left, payload, payloadIndex, pointerEvents, right, stroke, top, width, x, y
  const { x, y, height } = props;
  return <Rectangle fill="red" x={x + 6} y={y} width={1} height={height} />; // 두께 조정으로 인한 가운데가 안맞음 현상..
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

  const fetchChartData = useCallback(() => {
    fetch(`/api/public/v2/chart/KRW/BTC?interval=${interval}&size=${size}`)
      .then((res) => res.json())
      .then((data) => {
        setChartData(data.chart);
      });
  }, [interval, size]);

  // 차트 확대 함수 (데이터 감소)
  const handleZoomIn = useCallback(() => {
    setSize((prevSize) => {
      const newSize = Math.max(50, prevSize - 50);
      return newSize;
    });
  }, []);

  // 차트 축소 함수 (데이터 증가)
  const handleZoomOut = useCallback(() => {
    setSize((prevSize) => {
      const newSize = Math.min(500, prevSize + 50);
      return newSize;
    });
  }, []);

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
      const newSize = Math.max(50, Math.min(500, prevSize + delta * changeAmount)); // 최대 500으로 제한
      return newSize;
    });
  }, 10); // 10ms 디바운스

  useEffect(() => {
    fetchChartData();
  }, [size]); // size가 변경될 때마다 데이터 조회

  // 데이터 처리 메모이제이션
  const data = useMemo(() => prepareData(chartData), [chartData]); // open과 close를 배열로 묶어서 저장

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
            <div className="ml-2 animate-pulse text-[14px] font-bold text-red-700">🚨 실시간</div>
          </CardTitle>
          <CardDescription>최대 500개의 데이터를 조회할 수 있습니다.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* 실시간 코인 정보 (웹소켓) */}
          <RealtimeInfo />
          <form>
            <div className="flex w-full flex-wrap items-center gap-[10px]">
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
                  <Button
                    onClick={(e) => {
                      e.preventDefault(); // form 기본동작 방지
                      fetchChartData();
                    }}
                  >
                    조회하기
                  </Button>
                </div>
              </div>
            </div>
          </form>
          <div className="my-2 flex items-center gap-2">
            <ChartCandlestick strokeWidth={1.5} color="#ff0000" />
            <div>{size}봉</div>
          </div>

          {/* 코인 차트 - 반응형으로 변경*/}
          <div
            className="relative w-full"
            onWheel={(e: React.WheelEvent<HTMLDivElement>) => {
              handleWheel(e);
            }}
          >
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={data} margin={{ bottom: 5, right: 40 }} onMouseMove={handleMouseMove}>
                {/* X축 Y축 설정 */}
                <XAxis
                  dataKey="timestamp"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(timestamp) => new Date(timestamp).toLocaleDateString()}
                  tickSize={5}
                  tickMargin={10}
                />
                <YAxis
                  domain={[minValue, maxValue]}
                  orientation="right"
                  tickFormatter={(value) => `₩${value.toLocaleString()}`}
                  tick={{ fontSize: 12 }}
                  tickSize={5}
                  tickMargin={10}
                />

                <Tooltip
                  content={<CustomTooltip />}
                  isAnimationActive={false}
                  // cursor={{ strokeWidth: 0.5, color: 'red' }} // bar 호버 시 툴팁 세로 강조 박스
                  cursor={<CustomCursor />}
                />

                {/* 그래프 눈금 설정 */}
                <CartesianGrid />

                {/* 제공된 데이터 배열에서 특정 키를 참조하여 각 막대의 값을 결정 */}
                {/* 각 막대의 높이가 openClose 값을 기반으로 렌더링 */}
                <Bar dataKey="openClose" shape={<CandleStick />} isAnimationActive={false}></Bar>
                {hoverHigh !== null && (
                  <ReferenceLine y={hoverHigh} stroke="red" strokeDasharray="3 3" />
                )}
              </BarChart>
            </ResponsiveContainer>
            <div className="absolute bottom-[20%] left-[50%] flex transform items-center gap-1 transition duration-200 hover:scale-110">
              <Button variant="adjust" size="sm" onClick={handleZoomOut} title="줌 아웃 (축소)">
                -
              </Button>
              <Button variant="adjust" size="sm" onClick={handleZoomIn} title="줌 인 (확대)">
                +
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Exchange;
