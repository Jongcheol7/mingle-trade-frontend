import axios from "axios";
import { toast } from "sonner";

export default async function DeleteFromS3(src: string) {
  try {
    await axios.post("http://localhost:8080/api/s3/delete", {
      imageUrl: src,
    });
  } catch (err) {
    console.error("S3 저장소로부터 사진 삭제에 실패했습니다.", err);
    toast.error("S3 저장소로부터 사진 삭제 실패");
  }
}
