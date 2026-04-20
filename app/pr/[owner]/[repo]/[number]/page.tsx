import { PrDetailView } from "@/components/pr-detail-view";

type Params = Promise<{ owner: string; repo: string; number: string }>;

export default async function PrPage({ params }: { params: Params }) {
  const { owner, repo, number } = await params;
  return (
    <PrDetailView owner={owner} repo={repo} number={Number(number)} />
  );
}
