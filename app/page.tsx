import Image from "next/image";
import { FormUploader } from "@/components/UploadForm";
export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center my-20 ">
      <h1 className="text-4xl font-bold tracking-tighter">Next.js + Better-Upload + S3 🔥</h1>
      <div className="flex mt-10 items-center justify-center gap-4">
        <FormUploader />
      </div>
      <div className="flex mt-10 items-center flex-col justify-center gap-4">
        
      </div>
    </div>
  );
}
