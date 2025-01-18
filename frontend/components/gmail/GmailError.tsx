interface GmailErrorProps {
  error: string;
}

export function GmailError({ error }: GmailErrorProps) {
  if (!error) return null;

  return <div className="text-red-500">{error}</div>;
}
