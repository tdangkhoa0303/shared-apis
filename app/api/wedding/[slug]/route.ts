import notionClient from '@/lib/notion-client';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const extractTitle = (page: PageObjectResponse, fieldName: string) => {
  const fieldProperty = page.properties[fieldName];
  if (!fieldProperty || fieldProperty.type !== 'title') {
    return null;
  }

  return fieldProperty.title[0].plain_text;
};

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;

  if (!slug) {
    return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
  }

  const response = await notionClient.pages.retrieve({
    page_id: slug,
  });

  if (!('properties' in response)) {
    return NextResponse.json({ error: 'Page not found' }, { status: 404 });
  }

  return NextResponse.json({
    name: extractTitle(response, 'Name'),
  });
}

// const DATABASE_ID = '1f21ac3e87a981a2be73df618b38de6d';

// export async function GET() {
//   let hasMore = true;
//   let startCursor = undefined;

//   while (hasMore) {
//     const response = await notionClient.databases.query({
//       database_id: DATABASE_ID,
//       start_cursor: startCursor,
//       filter: {
//         property: 'ID',
//         rich_text: {
//           is_empty: true,
//         },
//       },
//     });

//     for (const page of response.results) {
//       const pageId = page.id;

//       // Update the page with its ID in the "Page ID" column
//       await notionClient.pages.update({
//         page_id: pageId,
//         properties: {
//           ID: {
//             rich_text: [
//               {
//                 text: {
//                   content: pageId,
//                 },
//               },
//             ],
//           },
//         },
//       });

//       console.log(`Updated page ${pageId}`);
//     }

//     hasMore = response.has_more;
//     startCursor = response.next_cursor ?? undefined;
//   }

//   console.log('✅ All page IDs updated.');
// }
