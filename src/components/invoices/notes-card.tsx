"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import type { InvoiceNote } from "@/types/invoice";
import { useState } from "react";

interface NotesCardProps {
  invoiceId: string;
  initialNotes?: InvoiceNote[];
}

export function NotesCard({
  invoiceId,
  initialNotes = [],
}: NotesCardProps) {
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState<InvoiceNote[]>(initialNotes);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAdd() {
    const value = note.trim();
    if (!value || saving) return;

    setSaving(true);
    setError(null);

    try {
      const response = await fetch(`/api/invoices/${invoiceId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: value }),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(payload?.error ?? "Couldn't save note. Please try again.");
      }

      setNotes((current) => [payload.data as InvoiceNote, ...current]);
      setNote("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Couldn't save note. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <textarea
          value={note}
          onChange={(event) => setNote(event.target.value)}
          rows={4}
          placeholder="Add a review note..."
          className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:bg-white focus:ring-2 focus:ring-green-600/20"
          disabled={saving}
        />
        <div className="flex items-center justify-between gap-3">
          {error ? <p className="text-sm text-red-600">{error}</p> : <span />}
          <Button
            type="button"
            onClick={handleAdd}
            disabled={!note.trim() || saving}
          >
            {saving ? "Saving..." : "Add Note"}
          </Button>
        </div>
        {notes.length > 0 ? (
          <ul className="space-y-2 border-t border-gray-100 pt-3">
            {notes.map((item) => (
              <li
                key={item.id}
                className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700"
              >
                <p>{item.body}</p>
                <p className="mt-1 text-xs text-gray-400">
                  {formatDate(item.createdAt.slice(0, 10))}
                </p>
              </li>
            ))}
          </ul>
        ) : null}
      </CardContent>
    </Card>
  );
}
