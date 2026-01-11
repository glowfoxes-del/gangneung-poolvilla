import { Hero } from "@/components/sections/hero";
import { Features } from "@/components/sections/features";
import { RoomPreview } from "@/components/sections/room-preview";
import { Location } from "@/components/sections/location";
import { FAQ } from "@/components/sections/faq";

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <RoomPreview />
      <Location />
      <FAQ />
    </>
  );
}
