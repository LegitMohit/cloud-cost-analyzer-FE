import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard", "/api/", "/signup", "/login", "/change-password", "/connect-aws", "/aws", "/costs", "/recommendations"],
      },
    ],
    sitemap: "https://cloudvento.vercel.app/sitemap.xml",
  };
}
