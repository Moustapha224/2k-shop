export function AnnonceBanner({ message }: { message: string }) {
  return (
    <div className="bg-foreground px-4 py-2 text-center text-xs font-medium text-background tracking-wide">
      {message}
    </div>
  );
}
