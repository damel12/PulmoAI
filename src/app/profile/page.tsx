import type { Metadata } from "next";
import { getT } from "@/lib/i18n/server";
import { ProfileCard } from "./ProfileCard";
import { ProgressDashboard } from "./ProgressDashboard";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getT()).profile.title };
}

export default async function ProfilePage() {
  const t = await getT();
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-heading text-3xl font-extrabold text-ink">{t.profile.title}</h1>
      <ProfileCard />
      <ProgressDashboard />
    </div>
  );
}
