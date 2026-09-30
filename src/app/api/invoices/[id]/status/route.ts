import { NextResponse } from "next/server";
import { mapInvoice } from "@/lib/invoices";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { updateStatusSchema } from "@/lib/validators";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json().catch(() => null);
    const parsed = updateStatusSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid invoice status" },
        { status: 400 },
      );
    }

    const supabase = getSupabaseServerClient();

    const { data: existing, error: existingError } = await supabase
      .from("invoices")
      .select("id")
      .eq("id", id)
      .maybeSingle();

    if (existingError) {
      console.error("Failed to look up invoice:", existingError);
      return NextResponse.json(
        { error: "Unable to update invoice" },
        { status: 500 },
      );
    }

    if (!existing) {
      return NextResponse.json(
        { error: "Invoice not found" },
        { status: 404 },
      );
    }

    const { data, error } = await supabase
      .from("invoices")
      .update({ status: parsed.data.status })
      .eq("id", id)
      .select("*, invoice_items(*), invoice_notes(*)")
      .single();

    if (error || !data) {
      console.error("Failed to update invoice status:", error);
      return NextResponse.json(
        { error: "Unable to update invoice" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      data: mapInvoice(data, true),
    });
  } catch (error) {
    console.error("PATCH /api/invoices/[id]/status error:", error);
    return NextResponse.json(
      { error: "Unable to update invoice" },
      { status: 500 },
    );
  }
}
