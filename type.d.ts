import { drizzle } from "drizzle-orm/sqlite-proxy";

type TokenCache = {
  getToken: (key: string) => Promise<string | undefined | null>;
  saveToken: (key: string, token: string) => Promise<void>;
  clearToken?: (key: string) => void;
};

interface SignUpResource extends ClerkResource {
  status: SignUpStatus | null;
  requiredFields: SignUpField[];
  optionalFields: SignUpField[];
  missingFields: SignUpField[];
  unverifiedFields: SignUpIdentificationField[];
  verifications: SignUpVerificationsResource;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  emailAddress: string | null;
  phoneNumber: string | null;
  web3wallet: string | null;
  hasPassword: boolean;
  unsafeMetadata: SignUpUnsafeMetadata;
  createdSessionId: string | null;
  createdUserId: string | null;
  abandonAt: number | null;
  create: (params: SignUpCreateParams) => Promise<SignUpResource>;
  update: (params: SignUpUpdateParams) => Promise<SignUpResource>;
  prepareVerification: (
    params: PrepareVerificationParams
  ) => Promise<SignUpResource>;
  attemptVerification: (
    params: AttemptVerificationParams
  ) => Promise<SignUpResource>;
  prepareEmailAddressVerification: (
    params?: PrepareEmailAddressVerificationParams
  ) => Promise<SignUpResource>;
  attemptEmailAddressVerification: (
    params: AttemptEmailAddressVerificationParams
  ) => Promise<SignUpResource>;
  preparePhoneNumberVerification: (
    params?: PreparePhoneNumberVerificationParams
  ) => Promise<SignUpResource>;
  attemptPhoneNumberVerification: (
    params: AttemptPhoneNumberVerificationParams
  ) => Promise<SignUpResource>;
  prepareWeb3WalletVerification: () => Promise<SignUpResource>;
  attemptWeb3WalletVerification: (
    params: AttemptWeb3WalletVerificationParams
  ) => Promise<SignUpResource>;
  createEmailLinkFlow: () => CreateEmailLinkFlowReturn<
    StartEmailLinkFlowParams,
    SignUpResource
  >;
  validatePassword: (
    password: string,
    callbacks?: ValidatePasswordCallbacks
  ) => void;
  authenticateWithRedirect: (
    params: AuthenticateWithRedirectParams & {
      unsafeMetadata?: SignUpUnsafeMetadata;
    }
  ) => Promise<void>;
  authenticateWithWeb3: (
    params: AuthenticateWithWeb3Params & {
      unsafeMetadata?: SignUpUnsafeMetadata;
    }
  ) => Promise<SignUpResource>;
  authenticateWithMetamask: (
    params?: SignUpAuthenticateWithMetamaskParams
  ) => Promise<SignUpResource>;
}

export type Database = {
  localDB: ExpoSQLiteDatabase<Record<string, never>>;
  remoteDB: PostgresJsDatabase<typeof remoteSchema>;
};
