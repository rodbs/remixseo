import React from 'react'
import {
    useLoaderData,
    Form,
    useSubmit,
    Outlet,
    Link,
    useFetcher,
    useMatches,
    useRouteError,
    isRouteErrorResponse,
    useSearchParams,
} from '@remix-run/react'

import type {
    ActionFunction,
    LoaderFunction,
    V2_MetaFunction,
    LoaderArgs,
    SerializeFrom,
    AppLoadContext,
    LoaderFunctionArgs,
    MetaFunction,
} from '@remix-run/cloudflare'
import { json, redirect } from '@remix-run/cloudflare'

import {
    $convertFromMarkdownString,
    $convertToMarkdownString,
    TRANSFORMERS,
    TEXT_FORMAT_TRANSFORMERS,
} from '@lexical/markdown'
import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import { ListNode, ListItemNode } from '@lexical/list'
import { CodeHighlightNode, CodeNode } from '@lexical/code'
import { AutoLinkNode, LinkNode } from '@lexical/link'
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table'

// import { parseMarkdown } from '#app/utils/markdown.server'
// import { Markdown } from '#app/components/var/markdown'

// import { NotionBlock } from '~/components/var/notion-block'

import { getEnvVars } from '~/lib/getEnvVars.server'
// import { PhButtonsAPI } from './app_.ph_settings'
import { PhButtonsPro } from '~/components/igls/PhButtonsPro'
// import { useLessonDone } from '~/routes/app_.user_lesson_done';
import { jsonHash } from 'remix-utils/json-hash'
// import { useAuth, useSession } from '@clerk/remix'

import { useOptionalUser } from '~/helpers/use-user.hook'
// import { getClerkUser } from '@turbolang/services'
// import { getAuth } from '@clerk/remix/ssr.server'

// import { trpc } from '~/lib/trpc'
import { i18n } from '#app/utils/i18n.server'
import { createHeadlessEditor } from '@lexical/headless'
import { BannerNode } from '#app/components/var/BannerPlugin'
import { getUserId } from '#app/utils/auth.server'
import { useLocaleSwitch } from '#app/helpers/use-locale-switch'
import { type SEOHandle } from '#app/utils/remix-seo/src'
import { MarkdownToJsx } from '#app/components/var/markdowntojsx'
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode'
import { set } from 'date-fns'
import clsx from 'clsx'
import { useAudioContext } from '#app/helpers/audio-context'
import { TableRead } from '#app/components/igls/TableRead'

const EDITOR_NODES = [
    CodeNode,
    HeadingNode,
    LinkNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    BannerNode,
    TableCellNode,
    TableNode,
    TableRowNode,
    HorizontalRuleNode,
]

 
export const handle: SEOHandle = {
    getSitemapEntries: async ({ request, context }) => {
        const { courses } =
            await context.readservices.org_course.getOrgsCourses({})
        //  console.log('courses', courses)
        for (let course of courses) {
            const lessonsList =
                await context.readservices.lesson.listLessonGridPerCourseSlug({
                    slug: course.slug,
                })
            // console.log('lessons', lessonsList)
            // const blogs = await db.blog.findMany()
            return lessonsList.map((lesson) => {
                return {
                    route: `/${course.slug}/${lesson.topicGroups.slug}/${lesson.slug}`,
                    priority: 0.7,
                }
            })
        }
    },
}

export async function loader({ params, request, context }: LoaderFunctionArgs) {
    // console.log('params 2 in loader  ', params)

    // let user = await context.services.auth.authenticator.isAuthenticated(
    //     request
    // )
    const uid = await getUserId(request, context)
    const { locales, site } = await getEnvVars(context)
    const locale = await i18n.getLocale(request)

    // const { userId } = await getAuth({ params, request, context })

    const lessonData = await context.readservices.lesson.getLessonBySlug({
        slug: params.lessonSlug,
        locale,
        locales,
    })

    // console.log('lessonData content', lessonData)
    const textContent = await new Promise<string>((resolve, reject) => {
        const editor = createHeadlessEditor({
            nodes: EDITOR_NODES,
            onError: reject,
            theme: { banner: 'bg-red-500' },
        })

        editor.setEditorState(editor.parseEditorState(lessonData?.content))

        editor.update(() => {
            // const rootNode = $getRoot()
            // const text = $getRoot().getTextContent()
            const markdown = $convertToMarkdownString(TRANSFORMERS)
            resolve(markdown)
        })
    })
    //console.log('user id', userId)
    //console.log('textContent', textContent)
    const userDoneList = uid
        ? await context.userservices.user.getUserDoneList({
              uid,
              courseId: lessonData?.courseId,
              tblLnDone: 'DONE_TBL',
          })
        : {}

    const doneTables = uid
        ? await context.userservices.user.getLessonAllUserDoneTable({
              uid,
              userListId: userDoneList?.id,
              courseId: lessonData?.courseId,
              lessonId: lessonData?.id,
          })
        : []

    // const content = parseMarkdown({
    //     markdown: textContent,
    //     userData: { uid, doneTables, userListId: userDoneList?.id },
    //     lessonUsedId: lessonData?.id,
    //     data: lessonData?.tables,
    // })
    // console.log('content server', content?.children)
    return jsonHash({
        lessonData: { ...lessonData, content: textContent },
        userData: { uid, doneTables, userListId: userDoneList?.id },
        lessonUsedId: lessonData?.id,
        courseId: lessonData?.courseId,

        // lessonData: { ...lessonData, content },
        // doneTables: context.services.user.getLessonAllUserDoneTable({
        //     uid: dbUser.id,
        //     site,
        //     course_id: lessonData?.course_id,
        //     lesson_id: lessonData?.id,
        // }),

        //  context.services.table.performGetUserDoneTableList({
        //     site: 'igls',
        //     lesson_id,
        //     course_id,
        //     // slug: params.lessonSlug,
        //     uid: user?.id,
        //     // id_done: user?.done_lists
        // }),
        params,
        site,
    })

    // tableData = formatTables(cachedTable);
}

// export const shouldRevalidate = ({
//     currentUrl,
//     currentParams,
//     nextParams,
//     formMethod,
//     defaultShouldRevalidate,
//     formAction,
// }) => {
//     //return false;
//     //console.log('formAction', formAction);

//     //don't revalidate if any of this route changes
//     if (
//         // formAction == '/app/ph_settings' ||
//         // formAction == '/app/user_list' ||
//         // formAction == '/app/user_table_done' ||
//         // formAction == '/app/user_table_rows' ||
//         // formAction == '/app/user_row' ||
//         // formAction == '/app/user_lesson_done' ||
//         // formAction == '/app/user_lesson_school'
//         formAction?.includes('/app/')
//     ) {
//         return false
//     }
//     return defaultShouldRevalidate
// }

export default function Lesson() {
    let { lessonData, userData, lessonUsedId, courseId } =
        useLoaderData<typeof loader>()
    const user = useOptionalUser()
    const { courses, site, phSettings } = useLocaleSwitch()
    const [partIndex, setPartIndex] = React.useState(0)
    //console.log('courses ', courses)
    const course = courses?.find((el) => el.id == courseId)

    // const matches = useMatches()
    // console.log('matches',matches)
    // const { course } = matches?.find((el) => el.id == 'root')?.data || {}
    // const queryDoneTables = trpc.getLessonAllUserDoneTable.useQuery(
    //     {
    //         uid: user?.id,
    //         site,
    //         courseId: lessonData?.courseId,
    //         lessonId: lessonData?.id,
    //     },
    //     {
    //         refetchOnWindowFocus: false,
    //         refetchOnMount: false,
    //         refetchOnReconnect: false,
    //         enabled: !!user?.id,
    //     }
    // )

    // const doneTables = queryDoneTables?.data // allDoneTables && allDoneTables[0]

    //console.log('lessonData', lessonData)
    // console.log('doneTables', doneTables)
    //  const { userId, sessionId } = useAuth()

    // console.log('useUser  ', user2, isSignedIn)
    //const { isLoaded, session, isSignedIn } = useSession()
    //console.log('useSession  ', isLoaded, session, isSignedIn)
    // const user = { id: user2?.id, isSession: isSignedIn } ?? {}
    // console.log('user lesson', user)
    // console.log('doneTables', doneTables);
    // const matches = useMatches();
    // const {
    //   user: { phSettings }
    // } =
    //   matches.find(
    //     (el) => el.id == 'routes/_layout.$courseSlug_.$categorySlug.$lessonSlug'
    //   )?.data || {};
    // console.log('les phSett', phSettings);
    console.log('les user', user)

    const [searchParams] = useSearchParams()
    const levelPre = searchParams.getAll('level')
    const level = levelPre.length == 0 ? ['ALL'] : levelPre
    //console.log('level cat', level)

    const tableData = lessonData?.tables
    console.log('tableData', tableData)
    //?.lessonTables?.map(lstbl =>)
    // console.log('content', lessonData?.content)

    //  const headings = collectHeadings(lessonData?.content)
    // console.log('headings', headings)
    // const items = headings?.filter((item) => [2, 3].includes(item?.level))
    // console.log('items', items)

    const isPaginated = course.isPaginated
    console.log('isPaginated', isPaginated)
    //   console.log('lessonData', lessonData?.content.match(/^## .*/gm))
    const partTitles = lessonData?.content
        ?.match(/^## .*/gm)
        ?.map((ln) => ln?.replace('##', '').trim())

    // .split(/\r?\n|\r|\n/g)
    // .filter((ln) => ln?.includes('##'))
    console.log('partTitle', partTitles)
    const parts = lessonData?.content.split(/(?=## )/) ?? [lessonData?.content]
    // .split(/\n## /)
    // .map((section, index) => (index !== 0 ? `## ${section}` : section))
    //   console.log('parts', lessonData?.content.split(/(?=### )/)?? [ lessonData?.content] )
    // const { instantAudioPlayer, fullAudioPlayerRefs } = useAudioPlayers()
    //console.log('fullAudioPlayerRefs in lessons', fullAudioPlayerRefs)
    const isPaginatedReadMode = isPaginated && partIndex === -1
    console.log('XXX', isPaginated, partIndex, isPaginatedReadMode)

    return (
        <div className="flex flex-row justify-center space-x-12">
            {/* side menu */}
            {/* {
                <aside className="  w-1/6 flex-auto ">
                    <nav className="fixed mt-8   ">
                        <ul>
                            {items?.map((item) => (
                                <li key={item?.title}>
                                    <a href={`#${item?.id}`}>{item?.title}</a>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </aside>
            } */}

            <aside className="min-w-52 ">
                <nav className="w-1/6  fixed mt-20   ">
                    <ul>
                        {isPaginated && (
                            <li
                                className={clsx(
                                    'cursor-pointer p-1',
                                    partIndex == -1 ? 'font-semibold  ' : ''
                                )}
                                onClick={() => setPartIndex(-1)}
                            >
                                ALL
                            </li>
                        )}
                        {partTitles?.length > 0 &&
                            partTitles?.map((item, index) => (
                                <li
                                    key={item}
                                    className={clsx(
                                        'cursor-pointer p-1',
                                        index == partIndex
                                            ? 'font-semibold  '
                                            : ''
                                    )}
                                    onClick={() => setPartIndex(index)}
                                >
                                    <a href={`#${item}`}>
                                        <MarkdownToJsx>{item}</MarkdownToJsx>
                                    </a>
                                </li>
                            ))}
                    </ul>
                </nav>
            </aside>

            <main className="flex-grow ">
                {/* className="mx-auto  w-2/4" */}

                {/* {isPaginated && (
                    <MarkdownToJsx
                        //isPaginated={isPaginated}
                        tableData={lessonData?.tables}
                        userData={userData}
                        lessonUsedId={lessonUsedId}
                        // fullAudioPlayerRefs={fullAudioPlayerRefs}
                    >
                        {parts[0]}
                    </MarkdownToJsx>
                )} */}
                {isPaginatedReadMode ? (
                    <TableRead tableData={lessonData?.tables} />
                ) : (
                    <MarkdownToJsx
                        //isPaginated={isPaginated}
                        tableData={lessonData?.tables}
                        userData={userData}
                        lessonUsedId={lessonUsedId}
                        partIndex={partIndex}
                        // fullAudioPlayerRefs={fullAudioPlayerRefs}
                    >
                        {isPaginated && parts?.length > 0
                            ? parts[partIndex + 1]
                            : !isPaginated
                              ? lessonData?.content
                              : ''}
                    </MarkdownToJsx>
                )}
                {/* <Markdown content={lessonData?.content} /> */}
            </main>

            <aside className="w-1/6 ">
                <div className="  fixed  mt-20 ">
                    {user?.id && (
                        <PhButtonsPro
                            options={{ border: true }}
                            user={user}
                            userPreference={phSettings}
                            isAlph={isPaginatedReadMode ? false : true}
                            isRow={isPaginatedReadMode ? false : true}
                            // isFSize={isPaginatedReadMode ? true : false}
                        />
                    )}
                </div>
            </aside>
        </div>
    )
}
