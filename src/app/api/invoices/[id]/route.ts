import { NextResponse } from "next/server";
import { mapInvoice } from "@/lib/invoices";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const supabase = getSupabaseServerClient();

    const { data, error } = await supabase
      .from("invoices")
      .select("*, invoice_items(*), invoice_notes(*)")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error("Failed to fetch invoice:", error);
      return NextResponse.json(
        { error: "Unable to fetch invoice" },
        { status: 500 },
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Invoice not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      data: mapInvoice(data, true),
    });
  } catch (error) {
    console.error("GET /api/invoices/[id] error:", error);
    return NextResponse.json(
      { error: "Unable to fetch invoice" },
      { status: 500 },
    );
  }
}
