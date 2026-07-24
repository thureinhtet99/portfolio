type EmptyStateProps = {
  message: string;
  icon?: React.ReactNode;
};

export default function EmptyState({ message, icon }: EmptyStateProps) {
  return (
    <div className="text-center py-12 text-muted-foreground">
      {icon && <div className="mb-3 flex justify-center">{icon}</div>}
      <p>{message}</p>
    </div>
  );
}
