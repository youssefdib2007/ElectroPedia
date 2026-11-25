import { CalculatorsWorkspace } from '../components/CalculatorsWorkspace';

export function CalculatorsPage() {
  return (
    <div
      data-testid="page-calculators"
      className="bg-[#F8FAFC] dark:bg-[#0F172A] min-h-[75vh] py-10 lg:py-14"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CalculatorsWorkspace />
      </div>
    </div>
  );
}
