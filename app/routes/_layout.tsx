import { type MetaFunction, Outlet, useMatches } from "@remix-run/react";

// import { Header, Footer } from "@turbolang/components";
import { Header } from "~/components/layout/Header";
import { Footer } from "~/components/layout/Footer";
import { type SEOHandle } from "#app/utils/remix-seo/src";

import { OrganizationJsonLd, WebSiteJsonLd } from "#app/utils/remix-seo/src";

export const handle: SEOHandle = {
  getSitemapEntries: () => null,
};

export const meta: MetaFunction = () => {
  return [
    OrganizationJsonLd({
      key: "org1",
      id: "https://www.purpule-fox.io/#corporation",
      logo: "https://carambaapp.com/photos/logo.jpg",
      name: "Caramba",
      url: "https://carambaapp.com",
    }),
    WebSiteJsonLd({
      key: "web1",
      id: "https://www.purpule-fox.io/#corporation",
      name: "Caramba",
      url: "https://carambaapp.com",
    }),
  ];
};

export default function Layout() {
  // console.log('layot')
  const matches = useMatches();

  // console.log('courses', courses)

  const { locale, site, language, courses, seoData } =
    matches?.find((el) => el.id == "root")?.data || {};
  //  console.log('seoData', seoData)
  //     const dynamicSlug= `slug_${language}`

  return (
    <div className="mx-auto flex flex-col h-screen max-w-7xl  items-center px-6">
      {/* <ClientOnly fallback={<></>}>{() => <Header />}</ClientOnly> */}
      <Header courses={courses} site={site} />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer site={site} />
    </div>
  );
}
//2//
