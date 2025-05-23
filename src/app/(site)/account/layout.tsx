import { redirect } from "next/navigation";
import { auth } from "~/server/auth";

type Props = {
  children: React.ReactNode;
};
export default async function AccountLayout({ children }: Props) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/account");
  }

  return <div>{children}</div>;
}
