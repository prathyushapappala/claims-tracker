import type { Claim, ClaimStatus } from "./types";

interface Props {
  claims: Claim[];
  onStatusChange: (id: string, status: ClaimStatus) => void;
  onDelete: (id: string) => void;
}

const formatAmount = (value: string | number) => {
  const text = String(value).trim();
  if (!text) return "—";

  const numericValue = Number(text);
  return Number.isFinite(numericValue)
    ? numericValue.toLocaleString("en-US", { style: "currency", currency: "USD" })
    : text;
};

export default function ClaimList({ claims, onStatusChange, onDelete }: Props) {
  if (claims.length === 0) return <p className="empty">No claims yet.</p>;

  return (
    <table className="card">
      <thead>
        <tr>
          <th>Policy #</th>
          <th>Claimant</th>
          <th>Type</th>
          <th>Amount</th>
          <th>Description</th>
          <th>Status</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {claims.map((c) => (
          <tr key={c.id}>
            <td>{c.policyNumber}</td>
            <td>{c.claimantName}</td>
            <td>{c.type}</td>
            <td>{formatAmount(c.amount)}</td>
            <td>{c.description}</td>
            <td>
              <span className={`badge ${c.status.toLowerCase()}`}>{c.status}</span>
            </td>
            <td className="actions">
              {c.status === "Submitted" && (
                <button onClick={() => onStatusChange(c.id, "Approved")}>Approve</button>
              )}
              <button className="danger" onClick={() => onDelete(c.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
