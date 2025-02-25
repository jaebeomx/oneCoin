import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

function Test() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-background">
      <div className="w-full max-w-md rounded-lg bg-card p-8 shadow-lg">
        <div className="flex flex-col items-center justify-center gap-4">
          <CircleCheckIcon />
          <h2 className="text-2xl font-bold">결제가 완료되었습니다!</h2>
          <div className="grid w-full gap-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">주문 번호</span>
              <span>Oe31b70H</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">상품명</span>
              <span>Glimmer Lamps x 2, Aqua Filters x 1</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">결제 금액</span>
              <span className="font-medium">$329.00</span>
            </div>
          </div>
        </div>
        <Separator className="my-6" />
        <Button className="w-full">확인</Button>
      </div>
    </div>
  );
}

export default Test;

function CircleCheckIcon() {
  return (
    <svg
      className="size-12 text-green-500"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
