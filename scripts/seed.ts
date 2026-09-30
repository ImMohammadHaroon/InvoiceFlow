import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

config({ path: ".env.local" });
config();

type FixtureItem = {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
};

type FixtureInvoice = {
  vendorName: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string | null;
  status: "processing" | "needs_review" | "approved" | "rejected";
  isDuplicate: boolean;
  tax?: number;
  items: FixtureItem[];
};

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    console.error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local",
    );
    process.exit(1);
  }

  const supabase = createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const fixturesPath = resolve(process.cwd(), "src/data/invoices.json");
  const fixtures = JSON.parse(
    readFileSync(fixturesPath, "utf-8"),
  ) as FixtureInvoice[];

  console.log("Clearing existing invoice data...");
  const { error: deleteItemsError } = await supabase
    .from("invoice_items")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");

  if (deleteItemsError) {
    throw new Error(`Failed to clear invoice_items: ${deleteItemsError.message}`);
  }

  const { error: deleteInvoicesError } = await supabase
    .from("invoices")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");

  if (deleteInvoicesError) {
    throw new Error(`Failed to clear invoices: ${deleteInvoicesError.message}`);
  }

  console.log(`Seeding ${fixtures.length} invoices from fixtures...`);

  for (const fixture of fixtures) {
    const tax = fixture.tax ?? 0;
    const subtotal = fixture.items.reduce((sum, item) => sum + item.amount, 0);
    const total = subtotal + tax;

    const { data: invoice, error: invoiceError } = await supabase
      .from("invoices")
      .insert({
        vendor_name: fixture.vendorName,
        invoice_number: fixture.invoiceNumber,
        invoice_date: fixture.invoiceDate,
        due_date: fixture.dueDate,
        subtotal,
        tax,
        total,
        status: fixture.status,
        is_duplicate: fixture.isDuplicate,
      })
      .select("id, invoice_number")
      .single();

    if (invoiceError || !invoice) {
      throw new Error(
        `Failed to insert ${fixture.invoiceNumber}: ${invoiceError?.message}`,
      );
    }

    const items = fixture.items.map((item) => ({
      invoice_id: invoice.id,
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      amount: item.amount,
    }));

    const { error: itemsError } = await supabase
      .from("invoice_items")
      .insert(items);

    if (itemsError) {
      throw new Error(
        `Failed to insert items for ${fixture.invoiceNumber}: ${itemsError.message}`,
      );
    }

    console.log(`  ✓ ${invoice.invoice_number} (${fixture.status})`);
  }

  console.log("Seed complete.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
