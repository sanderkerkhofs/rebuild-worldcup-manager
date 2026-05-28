type Panel = {
  title: string;
  rows: string[];
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
          {left.rows.map((row) => (
            <li key={row}>{row}</li>
          ))}
        </ul>
      </section>
      <section className="panel">
        <h3>{right.title}</h3>
        <ul>
          {right.rows.map((row) => (
            <li key={row}>{row}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
