import axios from "axios";
import { toast } from "sonner";

export default async function FileToS3(file: File, folder: string) {
  console.log("file", file);

  const ext = file.name.split(".").pop();
  const envPrefix = process.env.NODE_ENV === "production" ? "prod" : "dev";
  const fileName = `${Date.now()}.${ext}`;

  try {
    const res = await axios.post("http://localhost:8080/api/s3/presigned-url", {
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
