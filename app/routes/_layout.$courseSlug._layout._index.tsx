import React, { useState } from "react";
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
  NavLink,
} from "@remix-run/react";

import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/cloudflare";
import { json, redirect } from "@remix-run/cloudflare";

import { LessonBox } from "~/components/layout/LessonBox";
import { LessonGrid } from "~/components/layout/LessonGrid";
import { NotionBlock } from "../components/var/notion-block";
import { NotionText } from "~/components/var/notion-text";

import { useLocaleSwitch } from "~/helpers/use-locale-switch";
import { loader } from "./_layout.$courseSlug_.$categorySlug.$lessonSlug";
import { CarouselJsonLd, CourseJsonLd } from "#app/utils/remix-seo/src";

export const otherURLs = [
  "blog",
  "escuela-ingles",
  "favicon.ico",
  "app",
  "adxm",
  "build",
];

export const handle: SEOHandle = {
  getSitemapEntries: async ({ request, context }) => {
    const { courses } = await context.readservices.org_course.getOrgsCourses(
      {}
    );
    // console.log('courses', courses)
    for (let course of courses) {
      return {
        route: `/${course.slug}`,
        priority: 0.7,
      };
    }
  },
};

//main categories
export default function CourseIndex() {
  // const { lessonsListing, courses, blogData, pageData, categotyListing, params } = useLoaderData()
  // const { pageData = {} } = useLoaderData();
  // console.log('pageData', pageData);
  //const [levelSel, setLevelSel] = React.useState('ALL')
  // const [level, setLevel] = React.useState('ALL')
  //  console.log('levelSel', levelSel)
  const { locale, locales } = useLocaleSwitch();
  const [cat, setCat] = useState("ALL");

  const [searchParams] = useSearchParams();
  const levelPre = searchParams.getAll("level");
  const level = levelPre.length == 0 ? ["ALL"] : levelPre;
  // console.log('level index', level)

  const matches = useMatches<typeof loader>();
  // console.log('matches course', matches)
  const params = useParams();
  //console.log('params layout.index', params);

  const {
    course,
    lessonsList,
    blogListing = [],
    pageData,
    lessonsDone = [],
    language,
    // posts,
    // postCategories,
  } = matches?.find((el) => el.id == "routes/_layout.$courseSlug._layout")
    ?.data || {};

  //console.log('lessonsList', lessonsList)
  //console.log('level', level)
  const lessonsListFiltered = lessonsList?.filter((les) =>
    level == "ALL" ? true : les.level == level
  );

  // console.log('lessonsListFiltered', lessonsListFiltered)
  // console.log('lessonsList', lessonsList)
  //const levelFetcher = useFetcher();

  // const submit = useSubmit();
  // function handleChange(event) {
  //   submit(event.currentTarget, { replace: true });
  // }

  // return <></>
  if (
    course?.id
    // courses &&
    // courses?.map((el) => el?.slug)?.includes(params?.courseSlug)
  ) {
    return (
      <div>
        <LessonGrid>
          {lessonsListFiltered &&
            lessonsListFiltered?.map((les) => {
              const lesson_done = lessonsDone.find(
                (el) => el.lessonId == les.id
              )?.status;
              return (
                <LessonBox
                  key={les?.id}
                  lesson={{ ...les, lesson_done }}
                  params={params}
                  locale={locale}
                />
              );
            })}
        </LessonGrid>
      </div>
    );
  }

  // else if (
  //     !courses.map((el) => el.slug).includes(params?.courseSlug) &&
  //     !otherURLs.includes(params?.courseSlug)
  // ) {
  //     return (
  //         <div className=" mx-auto w-2/3">
  //             {/* pagess - slug {params?.courseSlug} */}
  //             {/* <p>{pageData?.title}</p> */}
  //             {pageData?.blocks.map((block) => (
  //                 <NotionBlock key={block.id} block={block} />
  //             ))}
  //         </div>
  //     )
  // }
}
