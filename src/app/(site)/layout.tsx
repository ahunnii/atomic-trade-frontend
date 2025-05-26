import { getCartId } from "~/server/actions/cart";

import { api, HydrateClient } from "~/trpc/server";
import Footer from "~/components/layout/footer";
import { NavBar } from "~/components/layout/navbar";
import { InitCart } from "~/components/shared/init-cart";

type Props = {
  children: React.ReactNode;
};
export default async function SiteLayout({ children }: Props) {
  const cartId = await getCartId();
  console.log("cartId", cartId);
  return (
    <HydrateClient>
      <InitCart />
      <main className="flex min-h-screen flex-col">
        <NavBar />
        {children}
        <Footer />
      </main>
    </HydrateClient>
  );
}
