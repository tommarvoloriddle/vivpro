// app/api/songs/[title]/route.js
import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';
import { console } from 'inspector';

export async function GET(req, { params }) {
  const { id } = params;
  const {title} = params;
  try {
    const client = await clientPromise;
    const database = client.db('vivpro');
    const collection = database.collection('albums');
    let song;
    if (id) {
        song = await collection.findOne({ id: id });
    } else if (title) {
        song = await collection.findOne({ title: title });
    }

    if (!song) {
      return NextResponse.json({ error: 'Song not found' }, { status: 404 });
    }

    return NextResponse.json(song);
  } catch (error) {
    console.error('Failed to fetch song:', error);
    return NextResponse.json({ error: 'Failed to fetch song' }, { status: 500 });
  }
}
