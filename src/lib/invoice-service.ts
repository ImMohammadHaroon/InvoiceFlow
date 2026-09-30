import { getSupabaseServerClient } from "@/lib/supabase/server";
import {
  buildStatusCounts,
  buildSummary,
  mapInvoice,
  mapInvoiceNote,
} from "@/lib/invoices";
import type {
  Invoice,
  InvoiceDetailResponse,
  InvoiceListResponse,
  InvoiceNote,
  InvoiceStatus,
} from "@/types/invoice";

export async function listInvoices(
  status?: InvoiceStatus,
): Promise<InvoiceListResponse> {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("invoices")
    .select("*")
    .order("invoice_date", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const invoices: Invoice[] = (data ?? []).map((row) => mapInvoice(row));
  const filtered = status
    ? invoices.filter((invoice) => invoice.status === status)
    : invoices;

  return {
    data: filtered,
    summary: buildSummary(invoices),
    counts: buildStatusCounts(invoices),
  };
}

export async function getInvoiceById(
  id: string,
): Promise<InvoiceDetailResponse | null> {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("invoices")
    .select("*, invoice_items(*), invoice_notes(*)")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return null;
  }

  return {
    data: mapInvoice(data, true),
  };
}

export async function addInvoiceNote(
  invoiceId: string,
  body: string,
): Promise<InvoiceNote> {
  const supabase = getSupabaseServerClient();

  const { data: existing, error: existingError } = await supabase
    .from("invoices")
    .select("id")
    .eq("id", invoiceId)
    .maybeSingle();

  if (existingError) {
    throw new Error(existingError.message);
  }

  if (!existing) {
    throw new Error("NOT_FOUND");
  }

  const { data, error } = await supabase
    .from("invoice_notes")
    .insert({
      invoice_id: invoiceId,
      body,
    })
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Unable to save note");
  }

  return mapInvoiceNote(data);
}
