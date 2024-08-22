import { useState, Fragment } from 'react'
import {
    useLoaderData,
    Form,
    useSubmit,
    Outlet,
    Link,
    useParams,
    useSearchParams,
    useMatches,
    NavLink,
    useNavigate,
} from '@remix-run/react'
import type {
    ActionFunction,
    LoaderFunction,
    LoaderArgs,
    AppLoadContext,
    LoaderFunctionArgs,
} from '@remix-run/cloudflare'
import { getEnvVars } from '~/lib/getEnvVars.server'

import { createHeadlessEditor } from '@lexical/headless'
import { $convertToMarkdownString, TRANSFORMERS } from '@lexical/markdown'
import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import { ListNode, ListItemNode } from '@lexical/list'
import { CodeHighlightNode, CodeNode } from '@lexical/code'
import { AutoLinkNode, LinkNode } from '@lexical/link'
// import { parseMarkdown } from '#app/utils/markdown.server'
// import { Markdown } from '#app/components/var/markdown'
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode'
import { json, redirect } from '@remix-run/cloudflare'
import { jsonHash } from 'remix-utils/json-hash'

import { NavLink2 } from '~/components/layout/NavLink2'
import { useLocaleSwitch } from '~/helpers/use-locale-switch'
import { useOptionalUser } from '~/helpers/use-user.hook'

import { i18n } from '#app/utils/i18n.server'
import { MarkdownToJsx } from '#app/components/var/markdowntojsx'

const EDITOR_NODES = [
    CodeNode,
    HeadingNode,
    LinkNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    HorizontalRuleNode,
]

export const loader: LoaderFunction = async ({
    params,
    request,
    context,
}: LoaderFunctionArgs) => {
    // let user = await context.services.auth.authenticator.isAuthenticated(
    //     request
    // )

    // return json({ courses: [], lessonsList: [], topicGroupWithChildren: [] })

    const { locales, site, language } = await getEnvVars(context)
    //   console.log('xxx', site, language)
    const locale = await i18n.getLocale(request)

    const pages = await context.readservices.post.listAllPages()
    const { courses } = await context.readservices.org_course.getOrgsCourses({
        locales,
        locale,
    })
    // const site = courses.find((el) => el.slug == params.courseSlug)?.site

    let textContent = ''
    if (pages.some((el) => el.slug == params.courseSlug)) {
        textContent = await new Promise<string>((resolve, reject) => {
            const editor = createHeadlessEditor({
                nodes: EDITOR_NODES,
                onError: reject,
            })

            editor.setEditorState(
                editor.parseEditorState(
                    pages.find((pg) => pg.slug == params?.courseSlug)?.content
                )
            )

            editor.update(() => {
                // const rootNode = $getRoot()
                // const text = $getRoot().getTextContent()
                const markdown = $convertToMarkdownString(TRANSFORMERS)
                resolve(markdown)
            })
        })
        return jsonHash({
            // page: parseMarkdown({ markdown: textContent }),
            page: textContent,
        })
    } else if (courses.find((el) => el.slug == params.courseSlug)) {
        //to-do: remove courses form here ,only in root

        const course = courses.find((el) => el.slug == params.courseSlug)
        //to do: fetch when:  params.courseSlug != 'blog'
        const lessonsList =
            await context.readservices.lesson.listLessonGridPerCourseSlug({
                slug: params.courseSlug,
                locales,
                locale,
            })

        const topicGroupWithChildren =
            await context.readservices.topic_tag.getLesTblTagGroupHierarchyWithChildren(
                {
                    courseId: course?.id,
                    locales,
                    locale,
                }
            )
        // const topicGroupsWithLessons = topicGroupWithChildren.map((tpG) => ({
        //     ...tpG,
        //     lessons: lessonsList?.filter(
        //         (les) => les?.topic?.path.includes(tpG?.id)
        //     ),
        // }))

        return jsonHash({
            course,
            lessonsList,
            // context.services.lesson.listLessonGridPerCourse({
            //     site: site,
            //     slug: params.courseSlug,
            // }) ?? [],

            topicGroupWithChildren,
            //topicGroupsWithLessons,
        })
    }
}

// export const action: ActionFunction = async ({ request, context }) => {
//     return null
// }

//main categories
export default function LayoutLesson() {
    // const [level, setLevel] = useState('ALL')
    const {
        course,
        lessonsList,
        topicGroupWithChildren,
        page,
        //topicGroupsWithLessons,
        //  posts,

        //  params
    } = useLoaderData<typeof loader>()
    // const [level, setLevel] = React.useState('ALL')
    const user = useOptionalUser()
    // console.log('user', user)
    //  console.log('lessonsList', lessonsList)
    // console.log('courses', courses)
    console.log('topicGroupWithChildren', topicGroupWithChildren)
    //  console.log('topicGroupsWithLessons', topicGroupsWithLessons)

    // console.log('lessonsListPre', lessonsListPre)
    // console.log('posts', posts)
    //  console.log('topics0', topics0)
    const params = useParams()
    const navigate = useNavigate()
    // console.log('params', params)

    const submit = useSubmit()
    const [searchParams] = useSearchParams()
    const levelPre = searchParams.getAll('level')
    const level = levelPre.length == 0 ? ['ALL'] : levelPre
    const topicgrp = searchParams.get('topicgrp')
    console.log('level', level)

    const matches = useMatches()
    //   console.log('matches', matches)
    // const levelFetcher = useFetcher();

    const { locale } = useLocaleSwitch()

    //const submit = useSubmit();
    // function handleChange(event) {
    //   submit(event.currentTarget, { replace: true });
    // }

    // const context = useOutletContext()
    // console.log('context', context)
    // const dynamicTopicSlug = ''.concat('slug', '_', language) ?? 'slug_SP'

    const label = `label_` + locale
    const sidebar = (
        <nav className="  flex flex-col  space-y-2">
            {topicGroupWithChildren &&
                topicGroupWithChildren?.map((tpc) => (
                    <Fragment key={tpc?.id}>
                        <NavLink2
                            cond={topicgrp === tpc.id}
                            to={`/${params?.courseSlug}/${tpc.slug}?level=${level}&topicgrp=${tpc.id}`}
                        >
                            <p className="whitespace-nowrap">
                                {tpc.label} ({tpc?.count_lesson})
                            </p>
                        </NavLink2>
                        {tpc?.children?.length > 0 &&
                            tpc?.children?.map((ch) => (
                                <NavLink2
                                    key={ch?.id}
                                    cond={topicgrp === ch.id}
                                    to={`/${params?.courseSlug}/${tpc.slug}?level=${level}&topicgrp=${ch.id}`}
                                >
                                    <p className="whitespace-nowrap ml-2">
                                        {ch.label} ({ch?.count_lesson})
                                    </p>
                                </NavLink2>
                            ))}
                    </Fragment>
                ))}
        </nav>
    )

    if (
        course?.id
        // courses?.length > 0 &&
        // courses?.map((el) => el?.slug)?.includes(params?.courseSlug)
    ) {
        return (
            <div>
                {/* </levelFetcher.Form>   */}
                <main className="flex   flex-col">
                    <div className="flex flex-1 overflow-hidden">
                        <div className="flex flex-1 flex-col">
                            {/* <div className="flex h-16 justify-center bg-gray-100 p-4">
                LAYOUT
              </div> */}
                            {/* <Form
                                method="get"
                                action={
                                    !params.categorySlug
                                        ? `/${params.courseSlug}`
                                        : `/${params.courseSlug}/${params.categorySlug}`
                                }
                            > */}
                            <div className="flex h-16 justify-center space-x-2 p-4">
                                <div>
                                    <input
                                        type="radio"
                                        name="level"
                                        id="levelSel1"
                                        value="ALL"
                                        checked={level.includes('ALL')}
                                        onChange={(e) => {
                                            //submit(e.currentTarget.form)
                                            navigate(
                                                !params.categorySlug
                                                    ? `/${params.courseSlug}?level=ALL`
                                                    : `/${params.courseSlug}/${params.categorySlug}?level=ALL&topicgrp=${topicgrp}`
                                            )
                                        }}
                                    />
                                    <label className="ml-2" htmlFor="levelSel1">
                                        ALL
                                    </label>
                                </div>
                                <div>
                                    <input
                                        type="radio"
                                        name="level"
                                        id="levelSel2"
                                        value="A"
                                        checked={level.includes('A')}
                                        onChange={(e) => {
                                            // submit(e.currentTarget.form)
                                            navigate(
                                                !params.categorySlug
                                                    ? `/${params.courseSlug}?level=A`
                                                    : `/${params.courseSlug}/${params.categorySlug}?level=A&topicgrp=${topicgrp}`
                                            )

                                            // {`/${params?.courseSlug}/${tpc.slug}?level=${level}&topicgrp=${ch.id}`})
                                        }}
                                    />
                                    <label className="ml-2" htmlFor="levelSel2">
                                        A
                                    </label>
                                </div>
                                <div>
                                    <input
                                        type="radio"
                                        name="level"
                                        id="levelSel2"
                                        value="B"
                                        checked={level.includes('B')}
                                        onChange={(e) => {
                                            // submit(e.currentTarget.form)
                                            navigate(
                                                !params.categorySlug
                                                    ? `/${params.courseSlug}?level=B`
                                                    : `/${params.courseSlug}/${params.categorySlug}?level=B&topicgrp=${topicgrp}`
                                            )
                                        }}
                                    />
                                    <label className="ml-2" htmlFor="levelSel2">
                                        B
                                    </label>
                                </div>
                                <div>
                                    <input
                                        type="radio"
                                        name="level"
                                        id="levelSel2"
                                        value="C"
                                        checked={level.includes('C')}
                                        onChange={(e) => {
                                            //submit(e.currentTarget.form)
                                            navigate(
                                                !params.categorySlug
                                                    ? `/${params.courseSlug}?level=C`
                                                    : `/${params.courseSlug}/${params.categorySlug}?level=C&topicgrp=${topicgrp}`
                                            )
                                        }}
                                    />
                                    <label className="ml-2" htmlFor="levelSel2">
                                        C
                                    </label>
                                </div>
                            </div>
                            {/* </Form> */}
                            <div className="paragraph flex   flex-1 overflow-y-auto px-4">
                                {/* {main} */}
                                {/* {transition.state == 'idle' ? 'Loading...' : ''} */}
                                <Outlet />
                            </div>
                        </div>
                        <aside className="mt-8 flex w-32 bg-gray-100 p-4">
                            {sidebar}
                        </aside>
                    </div>
                </main>
                {/* <Outlet /> */}
            </div>
        )
    }
    // else if (params?.courseSlug == 'blog') {
    //     //BLOG
    //     return <Outlet />
    // }
    else {
        return (
            // <Markdown content={page} />
            <MarkdownToJsx>{page}</MarkdownToJsx>
        )
    }
}

// const main = (
//   <ul className="grid grid-cols-5 gap-2">
//     {lessonsList &&
//       lessonsList[0]?.lesson?.map((les, i) => (
//         <li key={les.id} className="border rounded-lg ">
//           <Link to={`/${params.courseSlug}/${les?.category?.slug}/${les.slug}`}>
//             <h2>{les.id}</h2>
//             <p className="p-2">{les?.excerpt}</p>
//           </Link>
//         </li>
//       ))}
//   </ul>
// )
//  return <></>

// export function CatchBoundary() {
//   // this returns { data, status, statusText }
//   const caught = useCatch<ThrownResponses>();
//   console.log('caught', caught);
//   switch (caught.status) {
//     case 404:
//       return (
//         <div>
//           <p>Esta página no existe.</p>
//           {/* <p>Contact {caught.data.invoiceOwnerEmail} to get access</p> */}
//         </div>
//       );
//     case 501:
//       return <div>Error</div>;
//   }

//   // You could also `throw new Error("Unknown status in catch boundary")`.
//   // This will be caught by the closest `ErrorBoundary`.
//   return (
//     <div>
//       Something went wrong: {caught.status} {caught.statusText}
//     </div>
//   );
// }
