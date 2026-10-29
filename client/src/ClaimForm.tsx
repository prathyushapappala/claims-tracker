import { useState, type FormEvent } from "react";
import type { ClaimType, NewClaim } from "./types";

const EMPTY = { policyNumber: "", claimantName: "", type: "Auto" as ClaimType, amount: "", description: "" };

export default function ClaimForm({ onSubmit }: { onSubmit: (claim: NewClaim) => Promise<void> }) {
  const [form, setForm] = useState(EMPTY);

  const update = (field: keyof typeof EMPTY, value: string) => setForm({ ...form, [field]: value });

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await onSubmit({ ...form, amount: form.amount.trim() });
    setForm(EMPTY);
  }

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <h2>Submit a claim</h2>
      <input placeholder="Policy number" value={form.policyNumber} onChange={(e) => update("policyNumber", e.target.value)} required />
      <input placeholder="Claimant name" value={form.claimantName} onChange={(e) => update("claimantName", e.target.value)} required />
      <select value={form.type} onChange={(e) => update("type", e.target.value)}>
        <option>Auto</option>
        <option>Home</option>
        <option>Health</option>
        <option>Life</option>
      </select>
      <input placeholder="Amount" value={form.amount} onChange={(e) => update("amount", e.target.value)} required />
      <textarea placeholder="What happened?" value={form.description} onChange={(e) => update("description", e.target.value)} required />
      <button type="submit">Submit claim</button>
    </form>
  );
}
