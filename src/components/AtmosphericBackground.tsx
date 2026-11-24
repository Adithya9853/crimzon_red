export function AtmosphericBackground() {
  return (
    <>
      <div
        aria-hidden="true"
        className="web-pattern-bg pointer-events-none fixed inset-0 z-0 opacity-75"
      />
      <div className="ambient" aria-hidden="true">
        <i className="o1" />
        <i className="o3" />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 42%, rgba(7, 7, 10, 0.78) 100%)',
        }}
      />
    </>
  );
}
