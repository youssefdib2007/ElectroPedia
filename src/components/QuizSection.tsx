import { QuizEngine } from './QuizEngine';

interface QuizSectionProps {
  onOpenFullPage?: () => void;
}

export function QuizSection({ onOpenFullPage }: QuizSectionProps) {
  return (
    <section
      id="quiz"
      className="bg-[#F8FAFC] dark:bg-[#0F172A]/85 border-b border-slate-200 dark:border-slate-800 py-14 lg:py-16"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <QuizEngine onOpenFullPage={onOpenFullPage} />
      </div>
    </section>
  );
}
