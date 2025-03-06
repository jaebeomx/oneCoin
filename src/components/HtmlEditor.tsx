import React from 'react';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Link,
  Image,
  ChevronDown,
  Highlighter,
  Type,
  Palette,
  X,
  Superscript,
  Subscript,
  Download,
  Trash2,
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Toggle } from '@/components/ui/toggle';

interface HtmlEditorProps {
  initialValue?: string;
}

// 첨부파일 타입 정의
interface AttachmentFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  date: Date;
}

// 툴바 컴포넌트 props 타입 정의
interface EditorToolbarProps {
  applyFormat: (command: string, value?: string) => void;
  applyHighlight: (color: string) => void;
  applyColor: (color: string) => void;
  applyFontSize: (size: string) => void;
  handleImageButtonClick: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  colors: string[];
  fontSizes: Array<{ label: string; value: string }>;
}

// 메모이제이션된 툴바 컴포넌트
const EditorToolbar = React.memo(
  ({
    applyFormat,
    applyHighlight,
    applyColor,
    applyFontSize,
    handleImageButtonClick,
    fileInputRef,
    colors,
    fontSizes,
  }: EditorToolbarProps) => {
    return (
      <div className="flex flex-wrap items-center gap-1 rounded-md border border-gray-200 bg-background-elevated p-1.5">
        {/* 글자 크기 */}
        <TooltipProvider>
          <Tooltip>
            <Popover>
              <TooltipTrigger asChild>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 px-2">
                    <Type className="h-4 w-4" />
                    <ChevronDown className="ml-1 h-3 w-3" />
                  </Button>
                </PopoverTrigger>
              </TooltipTrigger>
              <PopoverContent className="w-56 p-2">
                <div className="grid gap-1">
                  {fontSizes.map((size) => (
                    <Button
                      key={size.value}
                      variant="ghost"
                      className="justify-start"
                      onClick={() => applyFontSize(size.value)}
                    >
                      <span style={{ fontSize: `${parseInt(size.value) * 0.25 + 0.75}rem` }}>
                        {size.label}
                      </span>
                    </Button>
                  ))}
                </div>
              </PopoverContent>
              <TooltipContent side="bottom">글자 크기</TooltipContent>
            </Popover>
          </Tooltip>
        </TooltipProvider>

        <div className="mx-1 h-6 w-px bg-gray-300"></div>

        {/* 굵게, 기울임, 밑줄 */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2"
                onClick={() => applyFormat('bold')}
              >
                <Bold className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">굵게 (Ctrl+B)</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2"
                onClick={() => applyFormat('italic')}
              >
                <Italic className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">기울임 (Ctrl+I)</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2"
                onClick={() => applyFormat('underline')}
              >
                <Underline className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">밑줄 (Ctrl+U)</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="mx-1 h-6 w-px bg-gray-300"></div>

        {/* 위첨자, 아래첨자 */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2"
                onClick={() => applyFormat('superscript')}
              >
                <Superscript className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">위첨자</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2"
                onClick={() => applyFormat('subscript')}
              >
                <Subscript className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">아래첨자</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="mx-1 h-6 w-px bg-gray-300"></div>

        {/* 글자 색상 */}
        <TooltipProvider>
          <Tooltip>
            <Popover>
              <TooltipTrigger asChild>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 px-2">
                    <Palette className="h-4 w-4" />
                    <ChevronDown className="ml-1 h-3 w-3" />
                  </Button>
                </PopoverTrigger>
              </TooltipTrigger>
              <PopoverContent className="w-64 p-2">
                <div className="grid grid-cols-5 gap-1">
                  {colors.map((color) => (
                    <Button
                      key={color}
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      style={{ backgroundColor: color }}
                      onClick={() => applyColor(color)}
                    />
                  ))}
                </div>
                <Button variant="outline" className="mt-3 w-full justify-center">
                  사용자 지정
                </Button>
              </PopoverContent>
              <TooltipContent side="bottom">글자 색상</TooltipContent>
            </Popover>
          </Tooltip>
        </TooltipProvider>

        {/* 형광펜 */}
        <TooltipProvider>
          <Tooltip>
            <Popover>
              <TooltipTrigger asChild>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 px-2">
                    <Highlighter className="h-4 w-4" />
                    <ChevronDown className="ml-1 h-3 w-3" />
                  </Button>
                </PopoverTrigger>
              </TooltipTrigger>
              <PopoverContent className="w-64 p-2">
                <div className="grid grid-cols-5 gap-1">
                  {[
                    '#ffff00',
                    '#a5d8ff',
                    '#d8f5a2',
                    '#ffc9c9',
                    '#e599f7',
                    '#ffec99',
                    '#transparent',
                  ].map((color) => (
                    <Button
                      key={color}
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      style={{
                        backgroundColor: color === '#transparent' ? 'transparent' : color,
                        border: color === '#transparent' ? '1px solid #e2e8f0' : 'none',
                      }}
                      onClick={() =>
                        applyHighlight(color === '#transparent' ? 'transparent' : color)
                      }
                    >
                      {color === '#transparent' && <X className="h-4 w-4" />}
                    </Button>
                  ))}
                </div>
                <Button variant="outline" className="mt-3 w-full justify-center">
                  사용자 지정
                </Button>
              </PopoverContent>
              <TooltipContent side="bottom">형광펜</TooltipContent>
            </Popover>
          </Tooltip>
        </TooltipProvider>

        <div className="mx-1 h-6 w-px bg-gray-300"></div>

        {/* 정렬 */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2"
                onClick={() => applyFormat('justifyLeft')}
              >
                <AlignLeft className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">왼쪽 정렬</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2"
                onClick={() => applyFormat('justifyCenter')}
              >
                <AlignCenter className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">가운데 정렬</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2"
                onClick={() => applyFormat('justifyRight')}
              >
                <AlignRight className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">오른쪽 정렬</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="mx-1 h-6 w-px bg-gray-300"></div>

        {/* 목록 */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2"
                onClick={() => applyFormat('insertUnorderedList')}
              >
                <List className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">글머리 기호</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2"
                onClick={() => applyFormat('insertOrderedList')}
              >
                <ListOrdered className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">번호 매기기</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="mx-1 h-6 w-px bg-gray-300"></div>

        {/* 링크 */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2"
                onClick={() => {
                  const url = prompt('링크 URL을 입력하세요:');
                  if (url) applyFormat('createLink', url);
                }}
              >
                <Link className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">링크</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* 이미지 */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2"
                onClick={handleImageButtonClick}
              >
                <Image className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" multiple />
            <TooltipContent side="bottom">이미지</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  },
);

// 첨부파일 목록 컴포넌트
const AttachmentList = React.memo(
  ({
    attachments,
    onViewAttachment,
    onDeleteAttachment,
  }: {
    attachments: AttachmentFile[];
    onViewAttachment: (attachment: AttachmentFile) => void;
    onDeleteAttachment: (id: string) => void;
  }) => {
    if (attachments.length === 0) return null;

    return (
      <div className="mt-4 rounded-md border border-gray-200 bg-background-secondary p-2">
        <h3 className="mb-2 font-medium text-primary">첨부파일</h3>
        <div className="space-y-2">
          {attachments.map((file) => (
            <div
              key={file.id}
              className="bg-background-primary flex items-center justify-between rounded-md border border-gray-100 p-2"
            >
              <div className="flex items-center gap-2">
                {file.type.startsWith('image/') ? (
                  <div className="h-10 w-10 overflow-hidden rounded-md border border-gray-200">
                    <img src={file.url} alt={file.name} className="h-full w-full object-cover" />
                  </div>
                ) : (
                  <Image className="h-5 w-5 text-gray-600" />
                )}
                <button
                  onClick={() => onViewAttachment(file)}
                  className="text-sm font-medium text-info hover:underline"
                >
                  {file.name}
                </button>
                <span className="text-xs text-text-primary">
                  ({(file.size / 1024).toFixed(0)} KB)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">
                  {file.date.toLocaleString('ko-KR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
                <button
                  onClick={() => onDeleteAttachment(file.id)}
                  className="ml-2 rounded-full p-1 hover:bg-gray-100"
                  title="삭제"
                >
                  <Trash2 className="h-4 w-4 text-gray-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  },
);

const HtmlEditor = ({ initialValue = '' }: HtmlEditorProps) => {
  const [html, setHtml] = useState(initialValue);
  const [attachments, setAttachments] = useState<AttachmentFile[]>([]);
  const [selectedAttachment, setSelectedAttachment] = useState<AttachmentFile | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = html;
    }
  }, []);

  // useCallback으로 함수들 메모이제이션
  const handleEditorChange = useCallback(() => {
    if (editorRef.current) {
      const newHtml = editorRef.current.innerHTML;
      setHtml(newHtml);
    }
  }, []);

  const handleImageButtonClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // 파일 업로드 핸들러 수정
  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // 여러 파일을 처리하기 위해 배열로 변환
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return;

      // 이미지 파일을 Base64로 변환 (FileReader 사용) - 이진 데이터를 ASCII 문자열로 변환
      // Base 64 Url로 전환하는 이유는 이미지를 서버로 전송하지 않고도 브라우저에서 미리보기 등을 할 수 있도록 하기 위함
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Url = event.target?.result;
        if (typeof base64Url === 'string') {
          // 첨부파일 목록에 추가

          const newAttachment: AttachmentFile = {
            id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
            name: file.name,
            type: file.type,
            size: file.size,
            url: base64Url,
            date: new Date(),
          };

          setAttachments((prev) => [...prev, newAttachment]);
        }
      };
      reader.readAsDataURL(file);
    });

    // 같은 파일 재선택 시에도 동작하도록 초기화
    e.target.value = '';
  }, []);

  // 첨부파일 보기
  const handleViewAttachment = useCallback((attachment: AttachmentFile) => {
    setSelectedAttachment(attachment);
    setIsDialogOpen(true);
  }, []);

  // 첨부파일 삭제
  const handleDeleteAttachment = useCallback((id: string) => {
    setAttachments((prev) => prev.filter((file) => file.id !== id));
  }, []);

  // 다른 메서드들도 useCallback으로 감싸기
  const applyFormat = useCallback(
    (command: string, value?: string) => {
      document.execCommand(command, false, value);
      handleEditorChange();
      if (editorRef.current) {
        editorRef.current.focus();
      }
    },
    [handleEditorChange],
  );

  const applyHighlight = useCallback(
    (color: string) => {
      document.execCommand('backColor', false, color);
      handleEditorChange();
    },
    [handleEditorChange],
  );

  const applyColor = useCallback(
    (color: string) => {
      document.execCommand('foreColor', false, color);
      handleEditorChange();
    },
    [handleEditorChange],
  );

  const htmlContent = `
  <i><span style="background-color: rgb(229, 153, 247);"><b><font size="5">안녕하세요</font></b></span></i><div><b>반갑<span style="background-color: rgb(216, 245, 162);">습니다.</span></b></div>
`;

  const applyFontSize = useCallback(
    (size: string) => {
      document.execCommand('fontSize', false, size);
      handleEditorChange();
    },
    [handleEditorChange],
  );

  // 배열이나 객체도 useMemo로 메모이제이션
  const colors = useMemo(
    () => [
      '#000000',
      '#e03131',
      '#2f9e44',
      '#1971c2',
      '#f08c00',
      '#9c36b5',
      '#495057',
      '#ffffff',
      '#ffc9c9',
      '#d8f5a2',
      '#a5d8ff',
      '#ffec99',
      '#e599f7',
    ],
    [],
  );

  const fontSizes = useMemo(
    () => [
      { label: '아주 작게', value: '1' },
      { label: '작게', value: '2' },
      { label: '보통', value: '3' },
      { label: '크게', value: '4' },
      { label: '더 크게', value: '5' },
      { label: '아주 크게', value: '6' },
      { label: '최대', value: '7' },
    ],
    [],
  );

  // fileInputRef와 handleImageUpload 연결
  useEffect(() => {
    const fileInput = fileInputRef.current;
    if (fileInput) {
      fileInput.onchange = handleImageUpload as any;
    }

    return () => {
      if (fileInput) {
        fileInput.onchange = null;
      }
    };
  }, [handleImageUpload]);

  const handleClear = () => {
    if (editorRef.current) {
      editorRef.current.innerHTML = '';
      setHtml('');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(html);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Ctrl+B: 굵게
    if (e.ctrlKey && e.key === 'b') {
      e.preventDefault();
      document.execCommand('bold', false);
      handleEditorChange();
    }
    // Ctrl+I: 기울임
    else if (e.ctrlKey && e.key === 'i') {
      e.preventDefault();
      document.execCommand('italic', false);
      handleEditorChange();
    }
    // Ctrl+U: 밑줄
    else if (e.ctrlKey && e.key === 'u') {
      e.preventDefault();
      document.execCommand('underline', false);
      handleEditorChange();
    }
  };

  return (
    <div className="bg-background-primary w-full space-y-4">
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={handleClear}>
          초기화
        </Button>
        <Button variant="outline" onClick={copyToClipboard}>
          HTML 복사
        </Button>
      </div>

      {/* 메모이제이션된 툴바 컴포넌트 사용 */}
      <EditorToolbar
        applyFormat={applyFormat}
        applyHighlight={applyHighlight}
        applyColor={applyColor}
        applyFontSize={applyFontSize}
        handleImageButtonClick={handleImageButtonClick}
        fileInputRef={fileInputRef as React.RefObject<HTMLInputElement>}
        colors={colors}
        fontSizes={fontSizes}
      />

      <div className="flex flex-col gap-4 bg-background-elevated md:flex-row">
        {/* 미리보기 영역 (왼쪽) - 여기서 직접 타이핑 */}
        <div className="w-full md:w-1/2">
          <Card>
            {/* contentEditable 속성을 사용하면 별도의 에디터 라이브러리를 사용하지 않고도 빠르게 편집 가능한 텍스트 영역 구현 가능 */}
            <CardContent className="bg-background-secondary pt-6">
              <div
                ref={editorRef}
                contentEditable
                onInput={handleEditorChange}
                onBlur={handleEditorChange} // 포커스 아웃 시 상태 업데이트
                onKeyDown={handleKeyDown}
                className="prose min-h-[300px] max-w-none overflow-y-auto rounded-md border border-gray-200 bg-background-secondary p-4 text-base leading-relaxed outline-none"
              />
            </CardContent>
          </Card>
        </div>

        {/* HTML 코드 영역 (오른쪽) */}
        <div className="w-full bg-background-elevated md:w-1/2">
          <Card>
            <CardContent className="bg-background-secondary pt-6">
              <pre className="h-full min-h-[300px] overflow-x-auto whitespace-pre-wrap rounded-md border border-gray-200 bg-background-secondary p-4 font-mono text-sm leading-relaxed">
                {html}
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 첨부파일 목록 */}
      <AttachmentList
        attachments={attachments}
        onViewAttachment={handleViewAttachment}
        onDeleteAttachment={handleDeleteAttachment}
      />

      {/* 단축키 설명 */}
      <div className="mt-4 text-sm text-gray-500">
        <p>
          단축키: <kbd className="rounded border bg-gray-100 px-1 py-0.5">Ctrl+B</kbd> 굵게,{' '}
          <kbd className="rounded border bg-gray-100 px-1 py-0.5">Ctrl+I</kbd> 기울임,{' '}
          <kbd className="rounded border bg-gray-100 px-1 py-0.5">Ctrl+U</kbd> 밑줄
        </p>
      </div>

      {/* <div dangerouslySetInnerHTML={{ __html: htmlContent }} /> */}

      {/* 첨부파일 미리보기 모달 */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogTitle>{selectedAttachment?.name}</DialogTitle>
          <DialogDescription>
            {selectedAttachment?.date.toLocaleString('ko-KR', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            })}
          </DialogDescription>
          {selectedAttachment && (
            <div className="flex flex-col items-center gap-4">
              {selectedAttachment.type.startsWith('image/') && (
                <div className="overflow-auto">
                  <img
                    src={selectedAttachment.url}
                    alt={selectedAttachment.name}
                    className="max-h-[70vh] max-w-full object-contain"
                  />
                </div>
              )}

              <div className="flex w-full justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  닫기
                </Button>

                <Button asChild>
                  <a
                    href={selectedAttachment.url}
                    download={selectedAttachment.name}
                    className="inline-flex items-center gap-1"
                  >
                    <Download className="h-4 w-4" />
                    다운로드
                  </a>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 파일 입력 필드 (다중 선택 가능) */}
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" multiple />
    </div>
  );
};

export default HtmlEditor;
