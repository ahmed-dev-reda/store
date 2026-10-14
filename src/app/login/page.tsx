import LoginForm from "./login-form";

type LoginPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { callbackUrl } = await searchParams;

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <LoginForm
        callbackUrl={typeof callbackUrl === "string" ? callbackUrl : "/"}
      />
    </div>
  );
}
