import { useState, useEffect } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

import { Card, CardContent } from '@/components/ui/card';

const Test = () => {
  // 가상의 인기 검색어 데이터
  const initialKeywords = [
    '비트코인',
    '이더리움',
    '리플',
    '도지코인',
    '솔라나',
    '에이다',
    '시바이누',
    '폴카닷',
  ];

  const [keywords, _] = useState(initialKeywords);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // 3초마다 검색어를 변경
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % keywords.length);
    }, 2500);

    return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 정리
  }, [keywords.length]);

  return (
    <div className="mx-auto mt-10 w-full max-w-xs">
      <h2 className="mb-4 text-center text-lg font-bold">실시간 인기 검색어</h2>
      <div className="relative h-10 overflow-hidden rounded-md bg-gray-100 shadow-md">
        {/* 검색어 리스트 */}
        <div
          className="absolute left-0 top-0 w-full transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateY(-${currentIndex * 2.5}rem)`, // 각 항목 높이(2.5rem)
          }}
        >
          {keywords.map((keyword, index) => (
            <div
              key={index}
              className="flex h-10 items-center justify-center text-sm font-medium text-gray-800"
            >
              {index + 1}. {keyword}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-10 text-center text-sm text-text-primary">실검</div>

      <Carousel className="w-full max-w-xs">
        <CarouselContent>
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <span className="text-4xl font-semibold">{index + 1}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default Test;
