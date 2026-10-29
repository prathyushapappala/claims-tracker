import { useEffect, useState } from "react";
import * as api from "./api";
import ClaimForm from "./ClaimForm";
import ClaimList from "./ClaimList";
import type { Claim, ClaimStatus, NewClaim } from "./types";

const FILTERS: (ClaimStatus | "All")[] = ["All", "Submitted", "Approved", "Rejected"];

export default function App() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [filter, setFilter] = useState<ClaimStatus | "All">("All");
  const [error, setError] = useState("");

  async function load() {
    try {
      setClaims(await api.getClaims(filter === "All" ? undefined : filter));
      setError("");
    } catch (e) {
      setError((e as Error).message);
    }
  }

  useEffect(() => {
    load();
  }, [filter]);

  // Run an API call, then refresh the list (or show the error)
  async function run(action: () => Promise<unknown>) {
    try {
      await action();
      await load();
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <main>
      <h1>Insurance Claims Tracker</h1>
      {error && <p className="error">{error}</p>}

      <ClaimForm onSubmit={(claim: NewClaim) => run(() => api.createClaim(claim))} />

      <div className="filters">
        {FILTERS.map((f) => (
          <button key={f} className={f === filter ? "active" : ""} onClick={() => setFilter(f)}>
            {f}
          </button>
        ))}
      </div>

      <ClaimList
        claims={claims}
        onStatusChange={(id, status) => run(() => api.updateStatus(id, status))}
        onDelete={(id) => run(() => api.deleteClaim(id))}
      />
    </main>
  );
}
