import { QuizEngine } from '../components/QuizEngine';

export function QuizzesPage() {
  return (
    <section
      data-testid="page-quizzes"
      className="bg-[#F8FAFC] dark:bg-[#0F172A] py-12 lg:py-16 min-h-[75vh]"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <QuizEngine showFullHeader />
      </div>
    </section>
  );
}
