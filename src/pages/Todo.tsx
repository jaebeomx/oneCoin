import { useState } from 'react';
import '@/App.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { Link } from 'react-router-dom';

type TodoType = {
  id: number;
  text: string;
  completed: boolean;
  date: Date | undefined;
};

function Todo() {
  const [todos, setTodos] = useState<TodoType[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>();

  const handleAddTodo = () => {
    if (newTodo.trim()) {
      setTodos([
        ...todos,
        {
          id: Date.now(),
          text: newTodo.trim(),
          completed: false,
          date: selectedDate,
        },
      ]);
      setNewTodo('');
      setSelectedDate(undefined);

      toast.success('새로운 할 일이 추가되었습니다.');
    }
  };

  const handleToggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)),
    );
  };

  const handleDeleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
    toast.error('할 일이 삭제되었습니다.', {
      duration: 1000,
    });
  };

  return (
    <div className="min-h-screen bg-background p-10">
      <div className="mx-auto mb-8 flex max-w-[1000px] items-center justify-between gap-2">
        <div className="text-2xl font-bold">Todo List</div>
      </div>

      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>Todo 리스트</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyDown={(e) => {
                if (e.nativeEvent.isComposing) return;
                if (e.key === 'Enter') handleAddTodo();
              }}
              placeholder="할 일을 입력하세요"
            />
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[140px]">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  <span>
                    {selectedDate ? format(selectedDate, 'PPP', { locale: ko }) : '날짜 선택'}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  showOutsideDays={false}
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  locale={ko}
                />
              </PopoverContent>
            </Popover>
            <Button onClick={handleAddTodo}>추가</Button>
          </div>

          <div className="mt-6 space-y-4">
            {todos.map((todo) => (
              <div
                key={todo.id}
                className="flex items-center justify-between gap-2 rounded-lg border p-4"
              >
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={todo.completed}
                    onCheckedChange={() => handleToggleTodo(todo.id)}
                  />
                  <div className="flex flex-col">
                    <span
                      className={`text-foreground ${
                        todo.completed && 'text-muted-foreground line-through'
                      }`}
                    >
                      {todo.text}
                    </span>
                    {todo.date && (
                      <span className="text-sm text-muted-foreground">
                        {format(todo.date, 'PPP', { locale: ko })}
                      </span>
                    )}
                  </div>
                </div>
                <Button variant="destructive" size="sm" onClick={() => handleDeleteTodo(todo.id)}>
                  삭제
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Toaster duration={1000} richColors closeButton position="top-right" />

      <Link to="/exchange">goto exchange</Link>
    </div>
  );
}

export default Todo;
