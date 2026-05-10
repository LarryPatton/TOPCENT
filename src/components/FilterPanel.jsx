const filterLabels = {
  material: "材质",
  finish: "表面处理",
  installation: "安装方式",
  color: "颜色",
  series: "系列",
};

export default function FilterPanel({
  options,
  selectedFilters,
  onToggleFilter,
  onReset,
}) {
  const visibleFilters = Object.entries(filterLabels).filter(([key]) => options[key]?.length);

  if (!visibleFilters.length) {
    return null;
  }

  return (
    <details className="sidebar-panel collapsible-panel" open>
      <summary className="panel-head inline">
        <div>
          <h3>筛选</h3>
          <p>仅显示已有数据维度</p>
        </div>
        <button className="text-button" type="button" onClick={onReset}>
          清空
        </button>
      </summary>

      <div className="filter-groups">
        {visibleFilters.map(([key, label]) => (
          <section className="filter-group" key={key}>
            <h4>{label}</h4>
            <div className="filter-options">
              {options[key].map((value) => (
                <label className="checkbox-row" key={value}>
                  <input
                    type="checkbox"
                    checked={selectedFilters[key].includes(value)}
                    onChange={() => onToggleFilter(key, value)}
                  />
                  <span>{value}</span>
                </label>
              ))}
            </div>
          </section>
        ))}
      </div>
    </details>
  );
}
