export function AnnonceBanner({ message }: { message: string }) {
  return (
    <div className="bg-primary px-4 py-1.5 text-center text-xs font-medium text-primary-foreground">
      {message}
    </div>
  );
}
