import { currentUser } from "@clerk/nextjs/server";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DashboardPage() {
  // This route is protected by `src/proxy.ts`; `currentUser()` is guaranteed
  // to be present here.
  const user = await currentUser();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="text-muted-foreground mt-1">
        A protected route — only signed-in users can see this.
      </p>

      <Card className="mt-6 max-w-md">
        <CardHeader>
          <CardTitle>Welcome back</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm">
          <p>
            <span className="text-muted-foreground">Name: </span>
            {user?.fullName ?? "—"}
          </p>
          <p>
            <span className="text-muted-foreground">Email: </span>
            {user?.primaryEmailAddress?.emailAddress ?? "—"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
