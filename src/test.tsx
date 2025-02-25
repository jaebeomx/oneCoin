function Test() {
  return (
    <div className="min-h-screen bg-background p-10">
      <div className="rounded-lg bg-background-elevated p-4">
        <div className="mb-3 rounded-lg bg-background-secondary p-4 text-text-primary">test</div>
        
        <p className="text-text-primary">기본 텍스트</p>
        <p className="text-text-secondary">부가 설명</p>
        <div className="border border-border-primary p-4">
          <p className="text-error">에러 메시지</p>
        </div>
      </div>
    </div>
  );
}

export default Test;
