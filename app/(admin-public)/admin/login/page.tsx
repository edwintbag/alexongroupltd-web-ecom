import { LoginForm } from '@/components/admin/login-form';

export const dynamic = 'force-dynamic';

export default function AdminLoginPage() {
  return (
    <div className="shell flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-sm">
        <p className="eyebrow mb-4">Alexon Group Ltd</p>
        <h1 className="text-display-sm text-bone">Staff sign in</h1>
        <p className="mt-3 text-sm leading-relaxed text-mute">
          For the Alexon team. Everything customers send through the website arrives here.
        </p>
        <LoginForm />
      </div>
    </div>
  );
}
