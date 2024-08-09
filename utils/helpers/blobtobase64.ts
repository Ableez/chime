export function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    if (blob.size === 0) {
      reject(new Error("Blob is empty"));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        // reader.result is already the complete Data URL
        resolve(reader.result);
      } else {
        reject(new Error("Failed to convert blob to Data URL"));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export function isValidBase64(base64: string): boolean {
  if (typeof base64 !== "string") {
    return false;
  }

  // Base64 regex pattern
  const base64Pattern =
    /^(?:[A-Za-z0-9+\/]{4})*?(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)?$/;
  return base64Pattern.test(base64);
}
