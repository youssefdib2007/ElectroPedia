import { FlashcardsDeck } from '../components/FlashcardsDeck';
import type { ElectronicComponent } from '../types/electronics';

interface FlashcardsPageProps {
  onSelectComponent: (component: ElectronicComponent) => void;
}

export function FlashcardsPage({ onSelectComponent }: FlashcardsPageProps) {
  return (
    <div
      data-testid="page-flashcards"
      className="bg-[#F8FAFC] dark:bg-[#0F172A] min-h-[75vh] py-10 lg:py-14"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <FlashcardsDeck onSelectComponent={onSelectComponent} />
      </div>
    </div>
  );
}
