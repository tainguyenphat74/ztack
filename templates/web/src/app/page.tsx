import Link from "next/link";
import { Database, Lock, Moon, Sparkles } from "lucide-react";
import { Show } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: Lock,
    title: "Auth with Clerk",
    description:
      "Sign-in, sign-up, and protected routes wired up out of the box.",
  },
  {
    icon: Database,
    title: "Drizzle ORM",
    description:
      "Type-safe Postgres — point it at Supabase or a self-hosted VPS.",
  },
  {
    icon: Sparkles,
    title: "shadcn/ui + lucide",
    description:
      "Accessible components and a clean icon set, ready to compose.",
  },
  {
    icon: Moon,
    title: "Dark mode",
    description: "Light / dark / system theming via next-themes, no flash.",
  },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <section className="flex flex-col items-center text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Next.js 16 Boilerplate
        </h1>
        <p className="text-muted-foreground mt-4 max-w-xl text-lg">
          TypeScript · Tailwind · shadcn/ui · Clerk · Drizzle. A
          production-ready starting point for your next web app.
        </p>
        <div className="mt-8 flex gap-3">
          <Show when="signed-out">
            <Button render={<Link href="/sign-up" />} size="lg">
              Get started
            </Button>
          </Show>
          <Show when="signed-in">
            <Button render={<Link href="/dashboard" />} size="lg">
              Go to dashboard
            </Button>
          </Show>
        </div>
      </section>

      <section className="mt-16 grid gap-4 sm:grid-cols-2">
        {features.map((feature) => (
          <Card key={feature.title}>
            <CardHeader>
              <feature.icon className="text-primary h-6 w-6" />
              <CardTitle className="mt-2">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground text-sm">
              {feature.description}
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
