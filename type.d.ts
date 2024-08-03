// type User = {
//   id: string;
//   email: string;
//   username: "";
//   profilePicture: string;
// };

type EmailAddress = {
  email_address: string;
  id: string;
  linked_to: any[];
  object: "email_address";
  verification: {
    status: "verified" | "unverified";
    strategy: string;
  };
};

type User = {
  birthday: string;
  created_at: number;
  email_addresses: EmailAddress[];
  external_accounts: any[];
  external_id: string;
  first_name: string;
  gender: string;
  id: string;
  image_url: string;
  last_name: string;
  last_sign_in_at: number;
  object: "user";
  password_enabled: boolean;
  phone_numbers: any[];
  primary_email_address_id: string;
  primary_phone_number_id: string | null;
  primary_web3_wallet_id: string | null;
  private_metadata: Record<string, unknown>;
  profile_image_url: string;
  public_metadata: Record<string, unknown>;
  two_factor_enabled: boolean;
  unsafe_metadata: Record<string, unknown>;
  updated_at: number;
  username: string | null;
  web3_wallets: any[];
};

type WebhookUserEvent = {
  data: User;
  object: "event";
  type: "user.created";
};

type ClerkWebhook = WebhookUserEvent;

type UserMetadata = {
  bio: string;
};
