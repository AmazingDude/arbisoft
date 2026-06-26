/**
 * Controlled search input. State is owned by the parent (Dashboard) so it can
 * feed the useMemo'd filtering — this component is purely a controlled view.
 *
 * @param {{ value: string, onChange: (value: string) => void }} props
 */
export default function SearchBar({ value, onChange }) {
  return (
    <label>
      Search
      <input
        type="search"
        placeholder="Search by title, content, or notes…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
