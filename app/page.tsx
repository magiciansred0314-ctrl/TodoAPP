"use client";

import { useState, useEffect } from "react";

type Todo = {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
};

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  // localStorageから読み込み
  useEffect(() => {
    const saved = localStorage.getItem("todos");
    if (saved) {
      setTodos(JSON.parse(saved));
    }
  }, []);

  // localStorageへ保存
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setTodos((prev) => [
      {
        id: crypto.randomUUID(),
        text: trimmed,
        completed: false,
        createdAt: Date.now(),
      },
      ...prev,
    ]);
    setInput("");
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const filteredTodos = todos.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  const activeCount = todos.filter((t) => !t.completed).length;

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-16">
      {/* ヘッダー */}
      <div className="w-full max-w-md mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-stone-900">
          やること
        </h1>
        <p className="mt-2 text-sm text-stone-400">
          {activeCount > 0 ? `残り ${activeCount} 件` : "すべて完了！"}
        </p>
      </div>

      {/* 入力フォーム */}
      <div className="w-full max-w-md mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.nativeEvent.isComposing && addTodo()}
            placeholder="新しいタスクを入力..."
            className="flex-1 rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm shadow-sm placeholder:text-stone-300 focus:border-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-200 transition"
          />
          <button
            onClick={addTodo}
            className="rounded-xl bg-stone-800 px-5 py-3 text-sm font-medium text-white shadow-sm hover:bg-stone-700 active:bg-stone-900 transition disabled:opacity-40"
            disabled={!input.trim()}
          >
            追加
          </button>
        </div>
      </div>

      {/* フィルター */}
      <div className="w-full max-w-md mb-4 flex gap-1 rounded-xl bg-stone-100 p-1">
        {(["all", "active", "completed"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-1 rounded-lg py-2 text-xs font-medium transition ${
              filter === f
                ? "bg-white text-stone-800 shadow-sm"
                : "text-stone-400 hover:text-stone-600"
            }`}
          >
            {f === "all" ? "すべて" : f === "active" ? "未完了" : "完了済み"}
          </button>
        ))}
      </div>

      {/* タスクリスト */}
      <div className="w-full max-w-md space-y-2">
        {filteredTodos.length === 0 && (
          <div className="rounded-xl border border-dashed border-stone-200 py-12 text-center text-sm text-stone-300">
            タスクがありません
          </div>
        )}
        {filteredTodos.map((todo) => (
          <div
            key={todo.id}
            className={`group flex items-center gap-3 rounded-xl border bg-white px-4 py-3.5 shadow-sm transition ${
              todo.completed ? "border-stone-100 opacity-60" : "border-stone-200"
            }`}
          >
            {/* チェックボックス */}
            <button
              onClick={() => toggleTodo(todo.id)}
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition ${
                todo.completed
                  ? "border-emerald-400 bg-emerald-400"
                  : "border-stone-300 hover:border-stone-400"
              }`}
              aria-label={todo.completed ? "未完了に戻す" : "完了にする"}
            >
              {todo.completed && (
                <svg
                  className="h-3 w-3 text-white"
                  viewBox="0 0 12 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 6l3 3 5-5" />
                </svg>
              )}
            </button>

            {/* テキスト */}
            <span
              className={`flex-1 text-sm leading-relaxed ${
                todo.completed ? "line-through text-stone-400" : "text-stone-700"
              }`}
            >
              {todo.text}
            </span>

            {/* 削除ボタン */}
            <button
              onClick={() => deleteTodo(todo.id)}
              className="ml-1 shrink-0 rounded-lg p-1 text-stone-300 opacity-0 transition hover:bg-stone-100 hover:text-stone-500 group-hover:opacity-100"
              aria-label="削除"
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 4l8 8M12 4l-8 8" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* 完了済みをまとめて削除 */}
      {todos.some((t) => t.completed) && (
        <div className="w-full max-w-md mt-6 text-right">
          <button
            onClick={() => setTodos((prev) => prev.filter((t) => !t.completed))}
            className="text-xs text-stone-400 hover:text-stone-600 transition"
          >
            完了済みをすべて削除
          </button>
        </div>
      )}
    </main>
  );
}
