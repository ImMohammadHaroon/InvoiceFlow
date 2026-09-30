import { NextResponse } from "next/server";
import { addInvoiceNote } from "@/lib/invoice-service";
import { createNoteSchema } from "@/lib/validators";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json().catch(() => null);
    const parsed = createNoteSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid note" },
        { status: 400 },
      );
    }

    try {
      const note = await addInvoiceNote(id, parsed.data.body);
      return NextResponse.json({ data: note }, { status: 201 });
    } catch (error) {
      if (error instanceof Error && error.message === "NOT_FOUND") {
        return NextResponse.json(
          { error: "Invoice not found" },
          { status: 404 },
        );
      }
      throw error;
    }
  } catch (error) {
    console.error("POST /api/invoices/[id]/notes error:", error);
    return NextResponse.json(
      { error: "Unable to save note" },
      { status: 500 },
    );
  }
}
