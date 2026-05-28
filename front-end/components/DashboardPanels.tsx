type Panel = {
  title: string;
  rows: string[];
  emptyText?: string;
};

type DashboardPanelsProps = {
  left: Panel;
  right: Panel;
};

export default function DashboardPanels({ left, right }: DashboardPanelsProps) {
  return (
    <div className="two-col">
      <section className="panel">
        <h3>{left.title}</h3>
        <ul>
          {left.rows.length === 0 && <li>{left.emptyText ?? 'No data available yet.'}</li>}
          {left.rows.map((row) => (
            <li key={row}>{row}</li>
          ))}
        </ul>
      </section>
      <section className="panel">
        <h3>{right.title}</h3>
        <ul>
          {right.rows.length === 0 && <li>{right.emptyText ?? 'No data available yet.'}</li>}
          {right.rows.map((row) => (
            <li key={row}>{row}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
