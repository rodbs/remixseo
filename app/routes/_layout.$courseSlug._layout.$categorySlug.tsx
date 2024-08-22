import {
  useLoaderData,
  Form,
  useSubmit,
  Outlet,
  Link,
  useFetcher,
  useMatches,
  useParams,
  useOutletContext,
  useSearchParams,
} from "@remix-run/react";
import { createHeadlessEditor } from "@lexical/headless";
import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/cloudflare";
import { json, redirect } from "@remix-run/cloudflare-pages";
// import { getEnvVars } from '@turbolang/common'
import { LessonBox } from "~/components/layout/LessonBox";
import { LessonGrid } from "~/components/layout/LessonGrid";

import { useLocaleSwitch } from "~/helpers/use-locale-switch";
import { jsonHash } from "remix-utils/json-hash";
import { getEnvVars } from "#app/lib/getEnvVars.server";

import { CourseJsonLd, type SEOHandle } from "#app/utils/remix-seo/src";

export const handle: SEOHandle = {
  getSitemapEntries: async ({ request, context }) => {
    const { courses } = await context.readservices.org_course.getOrgsCourses(
      {}
    );
    // console.log('courses', courses)
    for (let course of courses) {
      const topicsGroup0 =
        await context.readservices.topic_tag.getLesTblTopicsGroupHier0({
          courseId: course.id,
        });

      return topicsGroup0.map((tpcGroup) => {
        return {
          route: `/${course.slug}/${tpcGroup.slug}`,
          priority: 0.7,
        };
      });
    }
  },
};

export default function CategorySlug() {
  // const { post } = useLoaderData<typeof loader>()
  // console.log('post', post)

  // console.log('lessonsListingdd', lessonsListing)
  // console.log('categotyListing', categotyListing)
  const matches = useMatches();
  // console.log('mathces cat', matches);
  // const lessonsListingCat = lessonsListing[0]?.lesson
  const [searchParams] = useSearchParams();
  const topicgrp = searchParams.get("topicgrp");
  // console.log('topic param', topic)
  const params = useParams();
  // console.log('params catory slug ', params)

  const levelPre = searchParams.getAll("level");
  const level = levelPre.length == 0 ? ["ALL"] : levelPre;
  console.log("level cat", level);

  const { locale } = useLocaleSwitch();

  const {
    courseList,
    lessonsList,
    blogListing,
    pageData,
    lessonsDone = [],
    language,
  } = matches?.find((el) => el.id == "routes/_layout.$courseSlug._layout")
    ?.data || {};

  console.log("lessonsList", lessonsList);
  const lessonsListFiltered = lessonsList
    ?.filter((les) => les?.topicGroups?.path.includes(topicgrp))
    ?.filter((les) => (level == "ALL" ? true : les.level == level));

  return (
    <LessonGrid>
      {lessonsListFiltered &&
        lessonsListFiltered?.map((les) => (
          <LessonBox
            key={les.id}
            lesson={les}
            params={params}
            // language={language}
            locale={locale}
          />
        ))}
    </LessonGrid>
    // <ul className="grid grid-cols-5 gap-2">
    //   {lessonsListingCat &&
    //     lessonsListingCat?.map((les, i) => (
    //       <li key={les.id} className="border rounded-lg flex flex-col items-center">
    //         <Link to={`/${params.courseSlug}/${les?.category?.slug}/${les.slug}`}>
    //           <h2>{les.id}</h2>
    //           <p className="p-2">{les?.excerpt}</p>
    //         </Link>
    //       </li>
    //     ))}
    // </ul>
  );
}
