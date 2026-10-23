import LoginForm from "@/components/auth/login-form"

export default function Page() {
  return (
    <main className="min-h-dvh flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </main>
  )
}
