// app/api/songs/[id]/rate/route.js
import { NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';

export async function POST(req, { params }) {
  const { id } = params;
  const { stars } = await req.json(); // Expecting { stars: 5 } in request body
  const { updates } = await req.json(); 
  const { prevStars} = await req.json();
  if (stars < 0 || stars > 5) {
    return NextResponse.json({ error: 'Invalid rating. Must be between 1 and 5.' }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const database = client.db('vivpro');
    const collection = database.collection('albums');

    const result = await collection.updateOne(
      { id: id },
      { $set: { rating: (stars + prevStars)/updates } }
      { $set: { updates: updates + 1} } 
      { $set: { prevStars: prevStars } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Song not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Rating updated successfully' });
  } catch (error) {
    console.error('Failed to rate song:', error);
    return NextResponse.json({ error: 'Failed to rate song' }, { status: 500 });
  }
}
