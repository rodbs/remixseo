import { routes } from "@remix-run/dev/server-build";
import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
// import { generateSitemap } from '@nasa-gcn/remix-seo'
import { generateSitemap } from "#app/utils/remix-seo/src";
import { getEnvVars } from "#app/lib/getEnvVars.server";
import { getDomainUrl } from "#app/utils/misc";

export function loader({ request, context }: LoaderFunctionArgs) {
  // const { site } = getEnvVars(context)
  return generateSitemap({ request, context }, routes, {
    siteUrl: getDomainUrl(request),

    headers: {
      "Cache-Control": `public, max-age=${60 * 5}`,
    },
  });
}
