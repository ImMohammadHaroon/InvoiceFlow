import { NextRequest, NextResponse } from "next/server";
import {
  buildStatusCounts,
  buildSummary,
  mapInvoice,
} from "@/lib/invoices";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { listInvoicesQuerySchema } from "@/lib/validators";
import type { Invoice } from "@/types/invoice";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const parsed = listInvoicesQuerySchema.safeParse({
      status: searchParams.get("status") ?? undefined,
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid invoice status" },
        { status: 400 },
      );
    }

    const supabase = getSupabaseServerClient();

    const { data, error } = await supabase
      .from("invoices")
      .select("*")
      .order("invoice_date", { ascending: false });

    if (error) {
      console.error("Failed to list invoices:", error);
      return NextResponse.json(
        { error: "Unable to fetch invoices" },
        { status: 500 },
      );
    }

    const invoices: Invoice[] = (data ?? []).map((row) => mapInvoice(row));
    const filtered = parsed.data.status
      ? invoices.filter((invoice) => invoice.status === parsed.data.status)
      : invoices;

    return NextResponse.json({
      data: filtered,
      summary: buildSummary(invoices),
      counts: buildStatusCounts(invoices),
    });
  } catch (error) {
    console.error("GET /api/invoices error:", error);
    return NextResponse.json(
      { error: "Unable to fetch invoices" },
      { status: 500 },
    );
  }
}
