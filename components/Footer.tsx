export async function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-10 pb-6 px-8">
      <h4 className="text-sm text-muted-foreground text-center sm:text-end">
        © {currentYear} Thu Rein Htet. All rights reserved.
      </h4>
    </footer>
  );
}
