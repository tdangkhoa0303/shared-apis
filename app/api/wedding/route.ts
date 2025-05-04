import notionClient from '@/lib/notion-client';
import { NextResponse, NextRequest } from 'next/server';

const DATABASE_ID = '1e91ac3e87a9801b9a3cd6e4fc1024b5';

export async function POST(request: NextRequest) {
  const formValues = await request.json();

  const response = await notionClient.pages.create({
    parent: { database_id: DATABASE_ID },
    properties: {
      Name: {
        title: [
          {
            text: { content: formValues.name },
          },
        ],
      },
      Location: {
        rich_text: [
          {
            text: {
              content: formValues.location,
            },
          },
        ],
      },
      Wishes: {
        rich_text: [
          {
            text: {
              content: formValues.wishes,
            },
          },
        ],
      },
      '+1': {
        checkbox: !!formValues.plusOne,
      },
    },
  });

  return NextResponse.json(response);
}
