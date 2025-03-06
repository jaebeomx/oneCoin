import HtmlEditor from '@/components/HtmlEditor';

function Editor() {
  return (
    <div className="flex min-h-screen flex-col items-center p-4 md:p-8">
      <h1 className="mb-6 text-3xl font-bold">AF 게시글 작성</h1>
      <HtmlEditor />
    </div>
  );
}

export default Editor;
