import { useState, useEffect } from 'react';
import DOMPurify from 'dompurify'; // npm install dompurify @types/dompurify

// 게시글 타입 정의
interface Article {
  id: string;
  content: string;
  createdAt: string;
}

function Article() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 게시글 데이터 가져오기
  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:3000/api/articles')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`서버 오류: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log('받아온 게시글:', data);
        // setArticles(Array.isArray(data) ? data : [data]);
        setArticles(data.articles);
        setLoading(false);
      })
      .catch((error) => {
        console.error('게시글 불러오기 오류:', error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return <div className="flex justify-center p-8">게시글을 불러오는 중...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-500">오류 발생: {error}</div>;
  }

  if (articles.length === 0) {
    return <div className="p-8">게시글이 없습니다.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-2xl font-bold">게시글 목록</h1>

      <div className="space-y-6">
        {articles.map((article) => (
          <div
            key={article.id}
            className="overflow-hidden rounded-lg border border-gray-200 bg-background-elevated shadow-sm"
          >
            {/* 게시글 헤더 */}
            <div className="border-b border-gray-200 bg-background-secondary p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-primary">ID: {article.id}</span>
                <time className="text-sm text-text-primary" dateTime={article.createdAt}>
                  {formatDate(article.createdAt)}
                </time>
              </div>
            </div>

            {/* 게시글 내용 XSS 방지를 위한 DOMPurify 사용 */}
            <div className="p-6">
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content) }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Article;
