

export const topics = [
  {
    id: "basics",
    title: "Основы",
    shortDescription: "Общий вид, коэффициенты a, b, c и выбор метода решения.",
    icon: "📐",
    color: "from-slate-500 to-slate-700",
    theorySectionIds: ["general", "methods"],
    order: 1,
  },
  {
    id: "incomplete",
    title: "Неполные уравнения",
    shortDescription: "Когда b = 0 или c = 0: разложение, изолирование x².",
    icon: "🧩",
    color: "from-emerald-500 to-teal-600",
    theorySectionIds: ["incomplete"],
    order: 2,
  },
  {
    id: "discriminant",
    title: "Дискриминант и формула корней",
    shortDescription: "D = b² − 4ac, случаи D > 0, D = 0, D < 0, формула корней.",
    icon: "🔢",
    color: "from-indigo-500 to-violet-600",
    theorySectionIds: ["discriminant", "formula"],
    order: 3,
  },
  {
    id: "vieta",
    title: "Теорема Виета",
    shortDescription: "Сумма и произведение корней — быстрый способ при целых корнях.",
    icon: "🔗",
    color: "from-amber-500 to-orange-600",
    theorySectionIds: ["vieta"],
    order: 4,
  },
  {
    id: "reduction",
    title: "Приведение к стандартному виду",
    shortDescription: "Перенос слагаемых и приведение к ax² + bx + c = 0.",
    icon: "↔️",
    color: "from-rose-500 to-pink-600",
    theorySectionIds: ["reduction"],
    order: 5,
  },
  {
    id: "derivatives",
    title: "Производные",
    shortDescription: "Скорость изменения функции, правила дифференцирования и касательная.",
    icon: "📈",
    color: "from-cyan-500 to-blue-600",
    theorySectionIds: ["derivative-meaning", "derivative-rules"],
    order: 6,
  },
  {
    id: "integrals",
    title: "Интегралы",
    shortDescription: "Первообразная, неопределённый интеграл и площадь под графиком.",
    icon: "∫",
    color: "from-lime-500 to-green-600",
    theorySectionIds: ["integral-meaning", "integral-rules"],
    order: 7,
  },
  {
    id: "limits",
    title: "Пределы",
    shortDescription: "Поведение функции около точки, бесконечности и первые приёмы вычисления.",
    icon: "∞",
    color: "from-fuchsia-500 to-rose-600",
    theorySectionIds: ["limit-meaning", "limit-techniques"],
    order: 8,
  },
];

export function getTopic(id){
  return topics.find((t) => t.id === id);
}

export function isTopicId(id){
  return topics.some((t) => t.id === id);
}
