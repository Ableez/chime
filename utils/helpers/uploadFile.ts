import { supabase } from "@/db/supabase";
import { decode } from "base64-arraybuffer";
import type { ImagePickerAsset } from "expo-image-picker";

export const uploadFile = async ({
  media,
  bucket,
  uid,
}: {
  media: ImagePickerAsset;
  bucket: "post_images" | "chat_images";
  uid?: string;
}) => {
  if (!media || !uid) {
    return null;
  }

  const filename = `${uid}/asterisk_${Date.now()}_${media.fileName}`;

  const { error } = await supabase.storage
    .from(bucket ?? "image")
    .upload(filename, decode(media.base64 as string), {
      upsert: true,
      contentType: media.mimeType,
    });

  if (error) {
    console.log("SUPABASE ERROR", error);
    return null;
  }

  const url = await supabase.storage
    .from(bucket ?? "image")
    .getPublicUrl(filename).data.publicUrl;

  return url ?? null;
};
