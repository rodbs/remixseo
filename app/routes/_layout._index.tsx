// import { SignInButton, SignedIn, SignedOut, useUser } from '@clerk/remix'
import { CarouselJsonLd, CourseJsonLd } from "#app/utils/remix-seo/src";
import { type MetaFunction, json } from "@remix-run/cloudflare";
import { Link, useLoaderData } from "@remix-run/react";
import { useOptionalUser } from "~/helpers/use-user.hook";

import type { loader as rootLoader } from "../root";
import { setProvider } from "#app/utils/remix-seo/src/utils/schema/setProvider";

// import type { MetaFunction } from "@remix-run/cloudflare";

export const meta: MetaFunction<typeof rootLoader> = ({ data, matches }) => {
  const { site, courses, orgs, url, seoData } = matches.find(
    (match) => match.id === "root"
  ).data;
  // console.log('ameta', matches)

  return [
    { title: "Spanish on the Rocks" },
    {
      name: "Learn Spanish using the natural way",
      content: "Welcome to Remix!",
    },
    CarouselJsonLd({
      ofType: "course",
      data: seoData?.courses?.map((course) => ({
        courseName: course?.seoName,
        courseDesc: course?.seoDesc,
        provider: { name: seoData?.name, url: url },
        url: `${url}/${course?.slug}`,

        hasCourseInstance: [
          {
            "@type": "CourseInstance",
            courseMode: "Online",
            location: `${url}`,
            courseSchedule: {
              "@type": "Schedule",
              repeatCount: 6,
              repeatFrequency: "Weekly",
            },
            courseWorkload: "PT4H",
          },
        ],
        offers: [
          {
            "@type": "Offer",
            category: "Subscription",
            priceCurrency: "USD",
            price: 18,
          },
        ],
        hasPart: course?.topicGroups0?.map((tpGrp) => ({
          "@type": "Course",
          name: tpGrp?.seoName,
          description: tpGrp?.seoName,
          url: `${url}/${course.slug}/${tpGrp.slug}`,
          provider: setProvider({ name: seoData?.name, url: url }),
          hasCourseInstance: [
            {
              "@type": "CourseInstance",
              courseMode: "Online",
              location: `${url}`,
              courseWorkload: "PT4H",
            },
          ],
          hasPart: tpGrp?.lessons0?.map((ls) => ({
            "@type": "LearningResource",
            "@id": `${url}/${course.slug}/${tpGrp.slug}/${ls.slug}`,
            name: ls?.seoName,
            description: ls?.seoName,
          })),
        })),
      })),
    }),
  ];
};

export async function loader(args) {
  // console.log('env', args.context.env)
  //   console.log("context", args.context);
  //   const { userId } = await getAuth(args);
  //   const user = await getUser({ userId, context: args.context });
  //   console.log("user", user);
  //   return json({ user });
  return json({ loc: args.context.env.LOCALE });
}

export default function MainRoute() {
  const { loc } = useLoaderData();
  // console.log('loc', loc)
  // let t = useT('translation', 'igls')
  // console.log('t-title', t('home.header.title'))

  const user = useOptionalUser();
  console.log("uuseOptionalUserser", user);

  return (
    <main className="space-y-8">
      <h1 className="mb-4 text-3xl font-bold">User status</h1>

      {/* <SignedIn>
                <p className="bg-green-300 text-sm font-semibold">
                    You have successfully signed in
                </p>
            </SignedIn>

            <SignedOut>
                <p className="bg-yellow-300 text-sm font-semibold">
                    Sign up for an account to get started
                </p>
            </SignedOut> */}

      {/* <div className="flex flex-row space-x-2 rounded-md border bg-gray-200 p-4">
                <a
                    href="https://dashboard.clerk.dev/last-active?utm_source=github&utm_medium=starter_repos&utm_campaign=remix_starter"
                    target="_blank"
                    rel="noreferrer"
                    className="flex flex-row space-x-2 "
                >
                    <h3>Dashboard</h3>
                </a>
            </div> */}

      <div className="rounded-md bg-gray-100 p-8 font-mono text-xs">
        {/* <pre>{JSON.stringify({ isLoaded })}</pre>
                <pre>{JSON.stringify({ isSignedIn })}</pre> */}
        <pre className="whitespace-pre-wrap break-all">
          {JSON.stringify({ user }, null, 2)}
        </pre>
      </div>
    </main>
  );
}
