import Head from 'next/head';

type LayoutProps = {
  children: React.ReactNode;
  className?: string;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Head>
        <title>Tabbied</title>
      </Head>

      {children}
    </>
  );
}
