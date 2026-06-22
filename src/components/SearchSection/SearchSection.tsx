import { useTranslations } from 'next-intl';
import type { ChangeEvent, SyntheticEvent } from 'react';

type SearchSectionProps = {
    onSearchTermChange: (value: string) => void;
    onRefresh: () => void;
    onSubmit: () => void;
    onTestError: () => void;
    searchTerm: string;
};

export function SearchSection({
    onSearchTermChange,
    onRefresh,
    onSubmit,
    onTestError,
    searchTerm,
}: SearchSectionProps) {
    const t = useTranslations('SearchSection');

    const handleSearchTermChange = (event: ChangeEvent<HTMLInputElement>) => {
        onSearchTermChange(event.target.value);
    };

    const handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSubmit();
    };

    return (
        <section className="search-section" aria-labelledby="search-title">
            <div className="search-section__header">
                <h2 id="search-title" className="search-section__title">
                    {t('title')}
                </h2>
                <p className="search-section__description">
                    {t('description')}
                </p>
            </div>

            <form className="search-section__form" onSubmit={handleSubmit}>
                <input
                    className="search-section__input"
                    type="search"
                    placeholder="pikachu"
                    aria-label={t('pokemonName')}
                    value={searchTerm}
                    onChange={handleSearchTermChange}
                />
                <button className="search-section__button" type="submit">
                    {t('submit')}
                </button>
            </form>

            <button className="search-section__error-button" type="button" onClick={onRefresh}>
                {t('refreshResults')}
            </button>
            <button className="search-section__error-button" type="button" onClick={onTestError}>
                {t('triggerError')}
            </button>
        </section>
    );
}
