"use client";

import type { AnswerMode, UserAnswer } from "@/lib/types";

interface AnswerFormProps {
  value: UserAnswer;
  onChange: (value: UserAnswer) => void;
  onSubmit: () => void;
  disabled?: boolean;
  inputIdPrefix?: string;
  shake?: boolean;
}

const modes: { id: AnswerMode; label: string }[] = [
  { id: "two", label: "Два корня" },
  { id: "one", label: "Один корень" },
  { id: "none", label: "Нет корней" },
];

export function AnswerForm({
  value,
  onChange,
  onSubmit,
  disabled,
  inputIdPrefix = "answer",
  shake = false,
}: AnswerFormProps) {
  const x1Id = `answer-x1-${inputIdPrefix}`;
  const setMode = (mode: AnswerMode) => {
    onChange({
      mode,
      x1: mode === "none" ? "" : value.x1,
      x2: mode === "none" || mode === "one" ? "" : value.x2,
    });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="space-y-5"
    >
      <div>
        <p className="mb-2 text-sm font-medium text-[var(--foreground)]">Сколько корней?</p>
        <div className="inline-flex rounded-xl bg-[var(--surface)] p-1">
          {modes.map((m) => (
            <button
              key={m.id}
              type="button"
              disabled={disabled}
              onClick={() => setMode(m.id)}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-all sm:px-4 ${
                value.mode === m.id
                  ? "bg-white text-[var(--primary)] shadow-sm"
                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
              } disabled:opacity-50`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {value.mode !== "none" && (
        <div className="flex flex-wrap gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">{value.mode === "one" ? "x" : "x₁"}</span>
            <input
              id={x1Id}
              type="text"
              inputMode="decimal"
              value={value.x1}
              onChange={(e) => onChange({ ...value, x1: e.target.value })}
              disabled={disabled}
              className={`input-field w-32 ${shake ? "animate-shake border-red-300" : ""}`}
              placeholder={value.mode === "one" ? "напр. 5" : "напр. 2"}
            />
          </label>
          {value.mode === "two" && (
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">x₂</span>
              <input
                type="text"
                inputMode="decimal"
                value={value.x2}
                onChange={(e) => onChange({ ...value, x2: e.target.value })}
                disabled={disabled}
                className="input-field w-32"
                placeholder="напр. -3"
              />
            </label>
          )}
        </div>
      )}

      {value.mode === "none" && (
        <p className="rounded-xl bg-indigo-50 px-4 py-3 text-sm text-indigo-700">
          D &lt; 0 — уравнение не имеет действительных корней.
        </p>
      )}

      <p className="text-xs text-[var(--muted)]">
        Можно вводить дроби: 1/2, -1/3. Порядок корней не важен.
      </p>

      <button type="submit" disabled={disabled} className="btn-primary">
        Проверить ответ
      </button>
    </form>
  );
}
