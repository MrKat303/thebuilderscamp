import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Partner Schools",
  description:
    "Conoce cómo convertir a tu colegio en Partner School de The Builders Camp y acercar oportunidades de liderazgo, emprendimiento y tecnología a tus estudiantes.",
  alternates: {
    canonical: "/partner-schools",
  },
  openGraph: {
    title: "Partner Schools | The Builders Camp",
    description:
      "Conecta a tus estudiantes con una experiencia práctica de liderazgo, emprendimiento y tecnología.",
    url: "/partner-schools",
    images: [
      {
        url: "/hero/hero.webp",
        alt: "Partner Schools de The Builders Camp",
      },
    ],
  },
};

export default function PartnerSchoolsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
