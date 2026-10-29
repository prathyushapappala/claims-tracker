export type ClaimType = "Auto" | "Home" | "Health" | "Life";
export type ClaimStatus = "Submitted" | "Approved" | "Rejected";

export interface Claim {
  id: string;
  policyNumber: string;
  claimantName: string;
  type: ClaimType;
  amount: string;
  description: string;
  status: ClaimStatus;
  createdAt: string;
}

export type NewClaim = Pick<Claim, "policyNumber" | "claimantName" | "type" | "amount" | "description">;
