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

export type CUserPublicMetadata = {
  profilePicture?: string | File;
  bio?: string;
};

interface UserResource extends ClerkResource {
  id: string;
  externalId: string | null;
  primaryEmailAddressId: string | null;
  primaryEmailAddress: EmailAddressResource | null;
  primaryPhoneNumberId: string | null;
  primaryPhoneNumber: PhoneNumberResource | null;
  primaryWeb3WalletId: string | null;
  primaryWeb3Wallet: Web3WalletResource | null;
  username: string | null;
  fullName: string | null;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string;
  hasImage: boolean;
  emailAddresses: EmailAddressResource[];
  phoneNumbers: PhoneNumberResource[];
  web3Wallets: Web3WalletResource[];
  externalAccounts: ExternalAccountResource[];
  passkeys: PasskeyResource[];
  samlAccounts: SamlAccountResource[];
  organizationMemberships: OrganizationMembershipResource[];
  passwordEnabled: boolean;
  totpEnabled: boolean;
  backupCodeEnabled: boolean;
  twoFactorEnabled: boolean;
  publicMetadata: UserPublicMetadata;
  unsafeMetadata: UserUnsafeMetadata;
  lastSignInAt: Date | null;
  createOrganizationEnabled: boolean;
  deleteSelfEnabled: boolean;
  updatedAt: Date | null;
  createdAt: Date | null;
  update: (params: UpdateUserParams) => Promise<UserResource>;
  delete: () => Promise<void>;
  updatePassword: (params: UpdateUserPasswordParams) => Promise<UserResource>;
  removePassword: (params: RemoveUserPasswordParams) => Promise<UserResource>;
  createEmailAddress: (
    params: CreateEmailAddressParams
  ) => Promise<EmailAddressResource>;
  createPasskey: () => Promise<PasskeyResource>;
  createPhoneNumber: (
    params: CreatePhoneNumberParams
  ) => Promise<PhoneNumberResource>;
  createWeb3Wallet: (
    params: CreateWeb3WalletParams
  ) => Promise<Web3WalletResource>;
  isPrimaryIdentification: (
    ident: EmailAddressResource | PhoneNumberResource | Web3WalletResource
  ) => boolean;
  getSessions: () => Promise<SessionWithActivitiesResource[]>;
  setProfileImage: (params: SetProfileImageParams) => Promise<ImageResource>;
  createExternalAccount: (
    params: CreateExternalAccountParams
  ) => Promise<ExternalAccountResource>;
  getOrganizationMemberships: GetOrganizationMemberships;
  getOrganizationInvitations: (
    params?: GetUserOrganizationInvitationsParams
  ) => Promise<ClerkPaginatedResponse<UserOrganizationInvitationResource>>;
  getOrganizationSuggestions: (
    params?: GetUserOrganizationSuggestionsParams
  ) => Promise<ClerkPaginatedResponse<OrganizationSuggestionResource>>;
  leaveOrganization: (organizationId: string) => Promise<DeletedObjectResource>;
  createTOTP: () => Promise<TOTPResource>;
  verifyTOTP: (params: VerifyTOTPParams) => Promise<TOTPResource>;
  disableTOTP: () => Promise<DeletedObjectResource>;
  createBackupCode: () => Promise<BackupCodeResource>;
  get verifiedExternalAccounts(): ExternalAccountResource[];
  get unverifiedExternalAccounts(): ExternalAccountResource[];
  get hasVerifiedEmailAddress(): boolean;
  get hasVerifiedPhoneNumber(): boolean;
}
