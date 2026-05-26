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
  return (
    <label className="results-section__checkbox">
      <input
        aria-label={`Select ${itemName}`}
        checked={checked}
        className="results-section__checkbox-input"
        type="checkbox"
        onChange={onChange}
      />
    </label>
  );
}
