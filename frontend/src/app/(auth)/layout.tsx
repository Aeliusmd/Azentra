import { Logo } from "@/components/ui/logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-[460px]">
        <header className="flex flex-col items-center text-center">
          <Logo />
          <p className="mt-3 text-sm text-muted">Apartment Management System</p>
        </header>
        {children}
      </div>
    </main>
  );
}
