import type { ChangeEvent, SyntheticEvent } from 'react';
import './SearchSection.css';

type SearchSectionProps = {
    onSearchTermChange: (event: ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (event: SyntheticEvent<HTMLFormElement>) => void;
    onTestError: () => void;
    searchTerm: string;
};

export function SearchSection({
    onSearchTermChange,
    onSubmit,
    onTestError,
    searchTerm,
}: SearchSectionProps) {
    return (
        <section className="search-section" aria-labelledby="search-title">
            <div className="search-section__header">
                <h2 id="search-title" className="search-section__title">
                    Search
                </h2>
                <p className="search-section__description">
                    The search input restores the last saved term and drives the initial request.
                </p>
            </div>

            <form className="search-section__form" onSubmit={onSubmit}>
                <input
                    className="search-section__input"
                    type="search"
                    placeholder="pikachu"
                    aria-label="Pokemon name"
                    value={searchTerm}
                    onChange={onSearchTermChange}
                />
                <button className="search-section__button" type="submit">
                    Search
                </button>
            </form>

            <button className="search-section__error-button" type="button" onClick={onTestError}>
                Trigger Error
            </button>
        </section>
    );
}
