import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Open Doors",
  description:
    "Open Doors conecta a jóvenes con empresas, colegios, universidades y organizaciones que abren sus puertas para compartir conocimientos, espacios y experiencias.",
  alternates: { canonical: "/open-doors" },
  openGraph: {
    title: "Open Doors | The Builders",
    description: "Abrimos puertas. Creamos oportunidades.",
    url: "/open-doors",
    images: [{ url: "/hero/hero.webp", alt: "Open Doors, un programa de The Builders" }],
  },
};

export default function OpenDoorsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
