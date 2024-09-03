// app/api/songs/route.js
import { NextResponse } from 'next/server';
import clientPromise from '../../lib/mongodb';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page')) || 1;
  const limit = parseInt(searchParams.get('limit')) || 10;
  const title = searchParams.get('title') || '';
  const skip = (page - 1) * limit;

  console.log('title:', title);
  if (title) {
    try {
      const client = await clientPromise;
      const database = client.db('vivpro');
      const collection = database.collection('albums');
      // Use regex for a case-insensitive search to find all matching titles
      const songs = await collection.find({ title: { $regex: title, $options: 'i' } }).skip(skip).limit(limit).toArray();
      if (songs.length === 0) {
        console.error('Failed to fetch songs:');
        return NextResponse.json({ error: 'Failed to fetch songs' }, { status: 500 });
      }
      return NextResponse.json(songs);
    } catch (error) {
      console.error('Failed to fetch songs:', error);
      return NextResponse.json({ error: 'Failed to fetch songs' }, { status: 500 });
    }
  }  
  else{
    try {
      const client = await clientPromise;
      const database = client.db('vivpro');
      const collection = database.collection('albums');
  
      const songs = await collection.find().skip(skip).limit(limit).toArray();
      const total = await collection.countDocuments();
      
      return NextResponse.json({
        page,
        limit,
        total,
        data: songs
      });
    } catch (error) {
      console.error('Failed to fetch songs:', error);
      return NextResponse.json({ error: 'Failed to fetch songs' }, { status: 500 });
    }
  }
}