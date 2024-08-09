import { OurFileRouter } from "@/app/api/uploadthing+api";
import { generateReactNativeHelpers } from "@uploadthing/expo";

export const { useImageUploader, useDocumentUploader } =
  generateReactNativeHelpers<OurFileRouter>({
    /**
     * Your server url.
     * @default process.env.EXPO_PUBLIC_SERVER_URL
     * @remarks In dev we will also try to use Expo.debuggerHost
     */
    url: "http://localhost:3000",
  });
