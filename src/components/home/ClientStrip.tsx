// Dải tên khách hàng. Chỉ render khi `approval.clientNames` bật: tên khách hàng chưa được xác nhận công bố.
export function ClientStrip({ label, clients }: { label: string; clients: string[] }) {
  return (
    <section aria-label={label} className="border-b border-line py-9">
      <div className="container-x flex flex-wrap items-center gap-x-10 gap-y-4">
        <span className="eyebrow !text-muted">{label}</span>
        <ul className="contents">
          {clients.map((name) => (
            <li key={name} className="font-display text-lg font-bold leading-6 tracking-[-0.01em] text-muted">{name}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
