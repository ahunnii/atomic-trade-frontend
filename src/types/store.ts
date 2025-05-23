export type Address = {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  formatted: string;
  street: string;
  additional?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean | null;
};
