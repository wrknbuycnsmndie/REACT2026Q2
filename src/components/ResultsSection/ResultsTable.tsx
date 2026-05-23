import type { ReactNode } from 'react';
import { ResultsTableHeader } from './ResultsTableHeader';

type ResultsTableProps = {
    children: ReactNode;
};

export function ResultsTable({ children }: ResultsTableProps) {
    return (
        <div className="results-section__table">
            <ResultsTableHeader />
            {children}
        </div>
    );
}
