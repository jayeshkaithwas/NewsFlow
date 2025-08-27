import Link from 'next/link';

export function Header() {
  return (
    <header className="py-6 border-b bg-card">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/"
              className="text-3xl font-bold font-headline text-primary transition-opacity hover:opacity-80"
            >
              NewsFlow
            </Link>
            <p className="text-muted-foreground mt-1">
              Your daily digest of tech news.
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
