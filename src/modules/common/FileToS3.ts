import api from "@/lib/api";
import { toast } from "sonner";

export default async function FileToS3(file: File, folder: string) {
  const ext = file.name.split(".").pop();
  const envPrefix = process.env.NODE_ENV === "production" ? "prod" : "dev";
  const fileName = `${Date.now()}.${ext}`;

  try {
    const res = await api.post("/api/s3/presigned-url", {
      fileName,
      contentType: file.type,
      envPrefix,
      folder,
    });
    return res.data.url;
  } catch (err) {
    toast.error("Presigned Url 생성 오류" + err);
  }
}
