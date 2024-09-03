'use client'
import Image from "next/image";

import { useEffect, useState } from "react";
const endpoint = '/api/songs'
// fetech songs from the api


export default function Home() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(endpoint)
      .then((res) => res.json())
      .then((data) => {
        setSongs(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </main>
    );
  } else if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p>Error: {error.message}</p>
      </main>
    );
  } else {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
          {songs.map((song) => (
            <div key={song.id} className="flex items-center justify-between p-4">
              <div className="flex items-center justify-between">
                <Image
                  src={song.album.cover}
                  alt={song.album.title}
                  width={64}
                  height={64}
                />
                <div className="ml-4">
                  <h2 className="font-bold">{song.title}</h2>
                  <p>{song.artist.name}</p>
                </div>
              </div>
              <p>{song.duration}</p>
            </div>
          ))}
        </div>
      </main>
    );
  }
}
