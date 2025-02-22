import Image from "next/image";
import { permanentRedirect } from "next/navigation";

export default function Home() {
  permanentRedirect("/chemistry");
  return (
   <div>

   </div>
  );
}
