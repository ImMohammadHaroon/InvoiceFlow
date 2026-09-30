import { AppShell } from "@/components/layout/app-shell";
import { StatusBadge, DuplicateBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function HomePage() {
  return (
    <AppShell
      counts={{
        all: 0,
        processing: 0,
        needs_review: 0,
        approved: 0,
        rejected: 0,
      }}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            Design system & shell
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            UI primitives and app layout are ready for the next invoice features.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Buttons</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="danger">Danger</Button>
              <Button variant="ghost">Ghost</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Badges</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <StatusBadge status="processing" />
              <StatusBadge status="needs_review" />
              <StatusBadge status="approved" />
              <StatusBadge status="rejected" />
              <DuplicateBadge />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shell</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Sidebar filters and topbar search are wired for upcoming list
                pages.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
