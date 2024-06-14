import FileReader from 'filereader';

export async function imageUrlToBase64(url: string): Promise<string> {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((onSuccess, onError) => {
    try {
      const reader = new FileReader();
      reader.onload = function () {
        onSuccess(this.result?.toString()!);
      };
      reader.readAsDataURL(blob);
    } catch (e) {
      onError(e);
    }
  });
}
