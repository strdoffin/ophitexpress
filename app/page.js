'use client';
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [fetchdata, getfetchdata] = useState([]);
  const [categoryId, setCategoryId] = useState(5);

  useEffect(() => {
    fetch(`http://localhost:8000/fetch-game/${categoryId}`)
      .then((res) => res.json())
      .then((data) => {
        getfetchdata(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [categoryId]);

  const handleCategoryClick = (id) => {
    setCategoryId(id); 
  };

  return (
    <>
      <section className="w-full p-5 flex justify-between ">
        <h1 className="text-4xl">ทบ.สองลูกโนวา SHOP</h1>
        <ul className="flex gap-10 items-center">
          <li>
            <Link className="p-2 bg-cyan-600 rounded-xl text-white" href="/postgame">Post Game</Link>
          </li>
        </ul>
      </section>
      
      <section className="w-full px-5 py-24 flex flex-col gap-10 bg-cyan-600 text-white">
        <div>
          <h1 className="text-7xl">ทบ.สองลูกโนวา SHOP</h1>
          <p>
            Lorem Ipsum is simply dummy text of the printing and <br />{" "}
            typesetting industry. Lorem Ipsum has been the industry's standard{" "}
          </p>
        </div>
      </section>
      
      
      <section className="w-full px-5 flex flex-col mt-10 ">
        <h2>Categories</h2>
        <ul className="flex gap-4">
        <li>
            <button
              onClick={() => handleCategoryClick(5)}
              className="text-sm py-2 px-4 border rounded hover:bg-gray-200"
            >
              All
            </button>
          </li>
          <li>
            <button
              onClick={() => handleCategoryClick(1)}
              className="text-sm py-2 px-4 border rounded hover:bg-gray-200"
            >
              Action
            </button>
          </li>
          <li>
            <button
              onClick={() => handleCategoryClick(2)}
              className="text-sm py-2 px-4 border rounded hover:bg-gray-200"
            >
              RPG
            </button>
          </li>
          <li>
            <button
              onClick={() => handleCategoryClick(3)}
              className="text-sm py-2 px-4 border rounded hover:bg-gray-200"
            >
              Strategy
            </button>
          </li>
          <li>
            <button
              onClick={() => handleCategoryClick(4)}
              className="text-sm py-2 px-4 border rounded hover:bg-gray-200"
            >
              Sports
            </button>
          </li>

        </ul>
      </section>

      <section className="w-full px-5 py-10">
        <h2>Games List</h2>
        <div className="flex flex-wrap flex gap-10">
          {fetchdata && fetchdata.length > 0 ? (
            fetchdata.map((game) => (
              <div key={game.id} className="border-2 p-5 w-60 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl">{game.title}</h3>
                  <img src={game.image} alt={game.title} className="w-full"/>
                </div>
                <Link className="rounded-xl p-2 w-fit text-white bg-green-500 mt-5" href={`/bidding/${game.id}`}>Bidding now</Link>
              </div>
            ))
          ) : (
            <p>No games found for this category.</p>
          )}
        </div>
      </section>
      <section className="text-center">
          <span>@made by <a href="https://github.com/strdoffin">strdoffin</a> <a href="https://github.com/waroonragwongsiri">waroonragwongsiri</a></span> 
      </section>
    </>
  );
}
