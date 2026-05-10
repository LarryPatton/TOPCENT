import { useLanguage } from "../i18n/LanguageContext";

const filterKeys = ["material", "finish", "installation", "color", "series"];

export default function FilterPanel({
  options,
  selectedFilters,
  onToggleFilter,
  onReset,
}) {
  const { filterLabel, localizedValue, t } = useLanguage();
  const visibleFilters = filterKeys.filter((key) => options[key]?.length);

  if (!visibleFilters.length) {
    return null;
  }

  return (
    <details className="sidebar-panel collapsible-panel" open>
      <summary className="panel-head inline">
        <div>
          <h3>{t("filters")}</h3>
          <p>{t("realFiltersOnly")}</p>
        </div>
        <button className="text-button" type="button" onClick={onReset}>
          {t("clear")}
        </button>
      </summary>

      <div className="filter-groups">
        {visibleFilters.map((key) => (
          <section className="filter-group" key={key}>
            <h4>{filterLabel(key)}</h4>
            <div className="filter-options">
              {options[key].map((value) => (
                <label className="checkbox-row" key={value}>
                  <input
                    type="checkbox"
                    checked={selectedFilters[key].includes(value)}
                    onChange={() => onToggleFilter(key, value)}
                  />
                  <span>{localizedValue(value)}</span>
                </label>
              ))}
            </div>
          </section>
        ))}
      </div>
    </details>
  );
}
