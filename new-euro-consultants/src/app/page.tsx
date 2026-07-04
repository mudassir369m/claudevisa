import Hero from "@/components/Hero";
import TrustBadges from "@/components/TrustBadges";
import Stats from "@/components/Stats";
import Countries from "@/components/Countries";
import CeoProfile from "@/components/CeoProfile";
import VideoGallery from "@/components/VideoGallery";
import PhotoGallery from "@/components/PhotoGallery";
import CustomSections from "@/components/CustomSections";
import OfficeSection from "@/components/OfficeSection";
import { Services, Process, Tours, Testimonials, FAQ, FinalCTA } from "@/components/Sections";
import { getContent } from "@/lib/content";

export const revalidate = 60;

export default async function Home() {
  const content = await getContent();
  return (
    <>
      <Hero content={content} />
      <TrustBadges content={content} />
      <Stats content={content} />
      <Countries content={content} />
      <Services content={content} />
      <Process content={content} />
      <CeoProfile content={content} />
      <Tours content={content} />
      <VideoGallery videos={content.videos} />
      <PhotoGallery images={content.gallery} />
      <Testimonials content={content} />
      <CustomSections content={content} />
      <OfficeSection content={content} />
      <FAQ content={content} />
      <FinalCTA content={content} />
    </>
  );
}
