import { useTranslations } from 'next-intl';

type ResultsTableRowCheckboxProps = {
  checked: boolean;
  itemName: string;
  onChange: () => void;
};

export function ResultsTableRowCheckbox({
  checked,
  itemName,
  onChange,
}: ResultsTableRowCheckboxProps) {
  const t = useTranslations('ResultsSection');

  return (
    <label className="results-section__checkbox">
      <input
        aria-label={t('selectPokemon', { name: itemName })}
        checked={checked}
        className="results-section__checkbox-input"
        type="checkbox"
        onChange={onChange}
      />
    </label>
  );
}
