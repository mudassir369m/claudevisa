import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import SocialRail from "@/components/SocialRail";
import CustomCursor from "@/components/CustomCursor";
import { getContent } from "@/lib/content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://neweuroconsultants.com";

export async function generateMetadata(): Promise<Metadata> {
  const c = await getContent();
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${c.contact.fullName} — ${c.contact.tagline}`,
      template: `%s | ${c.contact.fullName}`,
    },
    description:
      "Premium visa consultancy in Islamabad for UK, USA, Canada, Australia, Turkey & Schengen. 18 years of excellence. Free eligibility check, embassy-grade documentation, no hidden fees.",
    keywords: [
      "visa consultants Islamabad",
      "UK visit visa Pakistan",
      "Schengen visa Islamabad",
      "USA visa consultant",
      "Canada visit visa",
      "New Euro Consultants",
    ],
    openGraph: {
      type: "website",
      siteName: c.contact.fullName,
      title: `${c.contact.fullName} — ${c.contact.tagline}`,
      description: "18 years of visa excellence. UK · USA · Canada · Australia · Turkey · Schengen.",
    },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const content = await getContent();
  const { contact } = content;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": `${siteUrl}#business`,
    name: contact.fullName,
    description: "Visa consultancy and travel agency in Islamabad — UK, USA, Canada, Australia, Turkey, Schengen.",
    telephone: contact.phone,
    email: contact.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Office 17-18, 1st Floor, Lord Trade Centre",
      addressLocality: "F-11 Markaz, Islamabad",
      addressCountry: "PK",
    },
    geo: { "@type": "GeoCoordinates", latitude: contact.coords.lat, longitude: contact.coords.lng },
    openingHoursSpecification: [{
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "16:00",
    }],
    priceRange: "$$",
    url: siteUrl,
    sameAs: Object.values(contact.social),
    hasMap: contact.mapsUrl,
    aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", reviewCount: "500" },
  };

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <Navbar content={content} />
        <main>{children}</main>
        <Footer content={content} />
        <WhatsAppFloat content={content} />
        <SocialRail content={content} />
        <CustomCursor />
      </body>
    </html>
  );
}
