import { apiRequest } from "./client";

export interface EnquiryPayload {
  name: string;
  company: string;
  email: string;
  product: string;
  message: string;
}

export async function submitEnquiry(payload: EnquiryPayload): Promise<void> {
  await apiRequest<void>("/api/enquiry", { method: "POST", body: payload });
}
