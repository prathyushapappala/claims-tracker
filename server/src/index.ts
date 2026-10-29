import express from "express";
import cors from "cors";
import { randomUUID } from "node:crypto";
import { readClaims, writeClaims } from "./store.js";
import type { Claim, ClaimStatus, ClaimType } from "./types.js";

const app = express();
app.use(cors());
app.use(express.json());

const TYPES: ClaimType[] = ["Auto", "Home", "Health", "Life"];
const STATUSES: ClaimStatus[] = ["Submitted", "Approved", "Rejected"];

// List all claims
app.get("/api/claims", async (req, res) => {
  const claims = await readClaims();
  res.json(claims);
});

app.get("/api/claims/:id", async (req, res) => {
  const claim = (await readClaims()).find((c) => c.id === req.params.id);
  if (!claim) return res.status(404).json({ error: "Claim not found" });
  res.json(claim);
});

// Submit a new claim
app.post("/api/claims", async (req, res) => {
  const { policyNumber, claimantName, type, amount, description } = req.body ?? {};

  if (!policyNumber || !claimantName || !description) {
    return res.status(400).json({ error: "policyNumber, claimantName and description are required" });
  }
  if (!TYPES.includes(type)) {
    return res.status(400).json({ error: `type must be one of ${TYPES.join(", ")}` });
  }

  const normalizedAmount = typeof amount === "number" ? String(amount) : typeof amount === "string" ? amount.trim() : "";
  if (!normalizedAmount) {
    return res.status(400).json({ error: "amount is required" });
  }

  const claim: Claim = {
    id: randomUUID(),
    policyNumber,
    claimantName,
    type,
    amount: normalizedAmount,
    description,
    status: "Submitted",
    createdAt: new Date().toISOString(),
  };

  const claims = await readClaims();
  claims.push(claim);
  await writeClaims(claims);
  res.status(201).json(claim);
});

// Approve or reject a claim
app.patch("/api/claims/:id/status", async (req, res) => {
  const { status } = req.body ?? {};
  if (!STATUSES.includes(status)) {
    return res.status(400).json({ error: `status must be one of ${STATUSES.join(", ")}` });
  }

  const claims = await readClaims();
  const claim = claims.find((c) => c.id === req.params.id);
  if (!claim) return res.status(404).json({ error: "Claim not found" });

  claim.status = status;
  await writeClaims(claims);
  res.json(claim);
});

app.delete("/api/claims/:id", async (req, res) => {
  const claims = await readClaims();
  const remaining = claims.filter((c) => c.id !== req.params.id);
  if (remaining.length === claims.length) return res.status(404).json({ error: "Claim not found" });
  await writeClaims(remaining);
  res.status(204).end();
});

const PORT = Number(process.env.PORT) || 4000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
