import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getAllPatternIds, getPattern } from 'lib/pattern';
import EditPattern from 'components/edit-pattern-page/EditPattern';

// Replicates the old `getStaticPaths` with `fallback: false` — only the
// pattern ids known at build time are rendered, anything else 404s.
export const dynamicParams = false;

export async function generateStaticParams() {
  const ids = await getAllPatternIds();

  return ids.map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const pattern = await getPattern(id);

  return {
    title: `Customize ${pattern.name}`,
  };
}

export default async function PatternPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pattern = await getPattern(id);

  return (
    <Suspense>
      <EditPattern pattern={pattern} />
    </Suspense>
  );
}
