"use server";

import Image from "next/image";
import { getCartId } from "~/server/actions/cart";
import { auth as authClient } from "~/server/auth";
import { Book, Menu, Sunset, Trees, Zap } from "lucide-react";

import type { Store } from "@prisma/client";

import { env } from "~/env";
import { api, HydrateClient } from "~/trpc/server";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Button } from "~/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "~/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";

import { ShoppingCart } from "./shopping-cart";
import { UserDropdown } from "./user-dropdown";

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
}

export async function NavBar() {
  const cartId = await getCartId();
  const collections = await api.collection.getNavigation();
  const storeBrand = await api.store.getBrand();
  const cartItems = await api.cart.getItems(cartId ?? "");
  const session = await authClient();
  const store = await api.store.get();

  const logo = {
    url: "/",
    src: storeBrand?.logo
      ? `${env.NEXT_PUBLIC_STORAGE_URL}/misc/${storeBrand.logo}`
      : "/logo-atomic-trade.png",
    alt: "logo",
    title: storeBrand?.name ?? "Atomic Trade",
  };
  const menu = [
    {
      title: "Shop",
      url: "#",
      items: collections.map((collection) => ({
        title: collection.name,
        url: `/collections/${collection.slug}`,
      })),
    },
    {
      title: "Featured",
      url: "/collections/featured-products",
    },
    {
      title: "New Arrivals",
      url: "/collections/new-arrivals",
    },

    // {
    //   title: "The Shop",
    //   url: "#",
    //   items: [
    //     {
    //       title: "Help Center",
    //       description: "Get all the answers you need right here",
    //       icon: <Zap className="size-5 shrink-0" />,
    //       url: "#",
    //     },
    //     {
    //       title: "Contact Us",
    //       description: "We are here to help you with any questions you have",
    //       icon: <Sunset className="size-5 shrink-0" />,
    //       url: "#",
    //     },
    //     {
    //       title: "Status",
    //       description: "Check the current status of our services and APIs",
    //       icon: <Trees className="size-5 shrink-0" />,
    //       url: "#",
    //     },
    //     {
    //       title: "Terms of Service",
    //       description: "Our terms and conditions for using our services",
    //       icon: <Book className="size-5 shrink-0" />,
    //       url: "#",
    //     },
    //   ],
    // },
    {
      title: "Sale",
      url: "/collections/sale-products",
    },
    {
      title: "Blog",
      url: "/blog",
    },
  ];
  const auth = {
    login: { title: "Login", url: "/auth/sign-in" },
  };

  return (
    <HydrateClient>
      <section className="py-4">
        <div className="container mx-auto w-full">
          {/* Desktop Menu */}
          <nav className="mx-auto hidden w-full max-w-7xl items-center justify-between md:flex">
            <div className="flex items-center gap-6">
              {/* Logo */}
              <a href={logo.url} className="flex items-center gap-2">
                <div className="relative h-16 w-16">
                  <Image
                    src={logo.src}
                    fill
                    alt={logo.alt}
                    className="object-contain"
                    priority
                  />
                </div>
                <span className="sr-only text-lg font-semibold tracking-tighter">
                  {logo.title}
                </span>
              </a>
              <div className="flex items-center">
                <NavigationMenu>
                  <NavigationMenuList>
                    {menu.map((item) => renderMenuItem(item))}
                  </NavigationMenuList>
                </NavigationMenu>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <UserDropdown sessionData={session} />
              <ShoppingCart
                navCartId={cartId ?? ""}
                cartQuantity={cartItems ?? 0}
                store={(store as Store) ?? null}
              />
            </div>
          </nav>

          {/* Mobile Menu */}
          <div className="mx-auto block md:hidden">
            <div className="flex items-center justify-between px-4">
              {/* Logo */}
              <a href={logo.url} className="flex items-center gap-2">
                <div className="relative h-16 w-16">
                  <Image
                    src={logo.src}
                    fill
                    alt={logo.alt}
                    className="object-contain"
                    priority
                  />{" "}
                  <span className="sr-only text-lg font-semibold tracking-tighter">
                    {logo.title}
                  </span>
                </div>
              </a>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="size-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>
                      <a href={logo.url} className="flex items-center gap-2">
                        <div className="relative h-8 w-8">
                          <Image
                            src={logo.src}
                            fill
                            alt={logo.alt}
                            className="object-contain"
                            priority
                          />
                        </div>{" "}
                        <span className="sr-only text-lg font-semibold tracking-tighter">
                          {logo.title}
                        </span>
                      </a>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col gap-6 p-4">
                    <Accordion
                      type="single"
                      collapsible
                      className="flex w-full flex-col gap-4"
                    >
                      {menu.map((item) => renderMobileMenuItem(item))}
                    </Accordion>

                    <div className="flex flex-col gap-3">
                      <Button asChild variant="outline">
                        <a href={auth.login.url}>{auth.login.title}</a>
                      </Button>
                      {/* <Button asChild>
                        <a href={auth.signup.url}>{auth.signup.title}</a>
                      </Button> */}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </section>
    </HydrateClient>
  );
}

const renderMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <NavigationMenuItem key={item.title}>
        <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
        <NavigationMenuContent className="bg-popover text-popover-foreground">
          {item.items.map((subItem) => (
            <NavigationMenuLink asChild key={subItem.title} className="w-80">
              <SubMenuLink item={subItem} />
            </NavigationMenuLink>
          ))}
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem key={item.title}>
      <NavigationMenuLink
        href={item.url}
        className="group bg-background hover:bg-muted hover:text-accent-foreground inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors"
      >
        {item.title}
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};

const renderMobileMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title} className="border-b-0">
        <AccordionTrigger className="text-md py-0 font-semibold hover:no-underline">
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="mt-2">
          {item.items.map((subItem) => (
            <SubMenuLink key={subItem.title} item={subItem} />
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <a key={item.title} href={item.url} className="text-md font-semibold">
      {item.title}
    </a>
  );
};

const SubMenuLink = ({ item }: { item: MenuItem }) => {
  return (
    <a
      className="hover:bg-muted hover:text-accent-foreground flex flex-row gap-4 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none"
      href={item.url}
    >
      <div className="text-foreground">{item.icon}</div>
      <div>
        <div className="text-sm font-semibold">{item.title}</div>
        {item.description && (
          <p className="text-muted-foreground text-sm leading-snug">
            {item.description}
          </p>
        )}
      </div>
    </a>
  );
};
