import notionClient from '@/lib/notion-client';
import { NextResponse, NextRequest } from 'next/server';

const DATABASE_ID = '1e91ac3e87a9801b9a3cd6e4fc1024b5';

export async function POST(request: NextRequest) {
  const formValues: {
    name: string;
    location: string;
    wishes?: string;
    numberOfAttendees: string;
  } = await request.json();

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
              content: formValues.wishes ?? '',
            },
          },
        ],
      },
      'Number of attendees': {
        number: Number(formValues.numberOfAttendees),
      },
    },
  });

  return NextResponse.json(response);
}
