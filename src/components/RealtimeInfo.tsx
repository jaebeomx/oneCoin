import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';

type CoinData = {
  ask_best_price: string;
  ask_best_qty: string;
  bid_best_price: string;
  bid_best_qty: string;
  first: string;
  high: string;
  id: string;
  last: string;
  low: string;
  quote_currency: string;
  quote_volume: string;
  target_currency: string;
  target_volume: string;
  timestamp: number;
  volume_power: string;
  yesterday_first: string;
  yesterday_high: string;
  yesterday_last: string;
  yesterday_low: string;
  yesterday_quote_volume: string;
  yesterday_target_volume: string;
};

function RealtimeInfo() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [coinData, setCoinData] = useState<CoinData | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const ws = new WebSocket('wss://stream.coinone.co.kr'); // 코인원 WebSocket 주소

    // 연결이 열리면
    ws.onopen = () => {
      console.log('웹소켓 연결됨,', ws);
      setIsConnected(true);
      setSocket(ws);

      // 구독 메시지 생성(예: BTC-KRW 체결 데이터)
      const subscribeMessage = {
        request_type: 'SUBSCRIBE',
        channel: 'TICKER',
        topic: {
          quote_currency: 'KRW',
          target_currency: 'BTC',
        },
      };

      // 구독 메세지 전송
      ws.send(JSON.stringify(subscribeMessage));
    };

    // 메시지 수신
    ws.onmessage = (e) => {
      const response = JSON.parse(e.data);
      if (response.data) {
        console.log(response.data);
        // 여기에 로딩 걸자
        setCoinData(response.data);
        setIsLoading(false);
      }
    };

    // 에러 처리
    ws.onerror = (error) => {
      console.error('WebSocket 에러:', error);
    };

    ws.onclose = () => {
      console.log('웹소켓 연결 해제');
      setSocket(null);
    };

    // 컴포넌트 언마운트 시 WebSocket 연결 해제
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  // 가격 변동률 계산 함수
  const calculatePriceChange = () => {
    if (!coinData) return { change: 0, isPositive: false };

    const currentPrice = parseFloat(coinData.last);
    const yesterdayPrice = parseFloat(coinData.yesterday_last);
    const change = ((currentPrice - yesterdayPrice) / yesterdayPrice) * 100;

    return {
      change: Math.abs(change).toFixed(2),
      isPositive: change >= 0,
    };
  };

  // 가격 포맷팅 함수
  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('ko-KR').format(parseFloat(price));
  };

  // 거래량 포맷팅 함수
  const formatVolume = (volume: string) => {
    const num = parseFloat(volume);
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(2) + 'B';
    } else if (num >= 1000000) {
      return (num / 1000000).toFixed(2) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(2) + 'K';
    }
    return num.toFixed(2);
  };

  // 타임스탬프를 시간 문자열로 변환하는 함수
  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  const { change, isPositive } = calculatePriceChange();

  // 가격 변동 계산
  const priceChange = coinData
    ? Math.abs(parseFloat(coinData.last) - parseFloat(coinData.yesterday_last)).toString()
    : '0';

  return (
    <>
      <div
        className={`relative mb-3 w-[90px] px-3 py-1 text-xs font-semibold ${isConnected ? 'bg-green-100 text-green-950' : 'bg-red-100 text-red-950'}`}
      >
        <span
          className={`absolute -left-[6px] -top-[6px] h-3 w-3 animate-pulse rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}
        ></span>
        {isConnected ? '실시간 연결됨' : '연결 중...'}
      </div>
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* 현재가 카드 */}
        <Card className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex flex-col gap-1">
              <div className="text-4xl font-bold text-primary">
                {coinData ? formatPrice(coinData.last) : '로딩 중...'}
                <span className="text-sm">KRW</span>
                <span className="ml-1 text-sm text-text-secondary">
                  ({coinData ? formatTimestamp(coinData.timestamp) : ''} 기준)
                </span>
              </div>
              {coinData && (
                <div
                  className={`flex items-center gap-2 text-lg font-medium ${isPositive ? 'text-red-600' : 'text-blue-600'}`}
                >
                  <span>
                    {isPositive ? '▲' : '▼'} {change}%
                  </span>
                  <span className="text-sm">
                    {isPositive ? '+' : '-'}
                    {formatPrice(priceChange)}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 고가/저가 카드 */}
        <Card className="overflow-hidden">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <div className="text-sm text-muted-foreground">고가</div>
                <div className="text-lg font-medium">
                  {coinData ? formatPrice(coinData.high) : '-'}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-sm text-muted-foreground">저가</div>
                <div className="text-lg font-medium">
                  {coinData ? formatPrice(coinData.low) : '-'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 거래량 카드 */}
        <Card className="overflow-hidden">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <div className="text-sm text-muted-foreground">거래량(24H)</div>
                <div className="text-lg font-medium">
                  {coinData ? formatVolume(coinData.target_volume) : '-'}
                  <span className="text-xs">BTC</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-sm text-muted-foreground">거래대금(24H)</div>
                <div className="text-lg font-medium">
                  {coinData ? formatVolume(coinData.quote_volume) : '-'}
                  <span className="text-xs">KRW</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default RealtimeInfo;
