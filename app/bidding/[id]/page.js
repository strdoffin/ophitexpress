"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation"; // Import useRouter here
import Countdown from "react-countdown";

export default function Page() {
  const { id } = useParams(); // Extract id from the URL
  const router = useRouter(); // Initialize the router for redirection
  const [fetchdata, getfetchdata] = useState([]);
  const [bidData, setBidData] = useState({
    post_id: id,
    name: "",
    bid_price: "",
    timestamp: new Date(),
    is_winner: false,
  });
  const [bitFetchData, getBitFetchData] = useState([]);
  const [bidHistory, setBidHistory] = useState([]);

  // Fetch game details
  useEffect(() => {
    fetch(`http://localhost:8000/post-game/${id}`)
      .then((res) => res.json())
      .then((data) => {
        getfetchdata(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [id]);

  // Fetch bid history initially
  useEffect(() => {
    const fetchBidHistory = async () => {
      try {
        const response = await fetch(`http://localhost:8000/bidding-game/${id}`);
        const data = await response.json();
        setBidHistory(data); // Set initial bid history
      } catch (error) {
        console.error("Error fetching bid history:", error);
      }
    };

    fetchBidHistory(); // Call initially

    // Polling to refresh bid history every 5 seconds
    const interval = setInterval(() => {
      fetchBidHistory();
    }, 5000); // Adjust the interval as needed

    // Cleanup on component unmount
    return () => clearInterval(interval);
  }, [id]);

  const handleBidChange = (e) => {
    const { name, value } = e.target;
    setBidData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleBidSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:8000/bidding-game/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bidData),
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message);
        setBidData({
          bid_price: "",
          name: "",
        });
        
        // Fetch the latest bid history after placing a bid
        const updatedBidHistory = await fetch(`http://localhost:8000/bidding-game/${id}`);
        const updatedData = await updatedBidHistory.json();
        setBidHistory(updatedData); // Update bid history immediately
      } else {
        alert(result.error || "Error submitting the bid");
      }
    } catch (error) {
      console.error("Error submitting bid:", error);
      alert("An unexpected error occurred");
    }
  };

  // Renderer function for Countdown to show when time ends
  const countdownRenderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      // Redirect to another path when the countdown completes
      router.push(`/bidding/${id}/contact`); // Replace with your desired path
      return <span>Time Limit Reached. Redirecting...</span>;
    } else {
      return (
        <span>
          {days} days {hours} hours {minutes} minutes {seconds} seconds
        </span>
      );
    }
  };

  return (
    <>
      <section className="w-full px-5 py-10">
        <div className="flex flex-wrap gap-10 w-full justify-center ">
          {fetchdata && fetchdata.length > 0 ? (
            fetchdata.map((game) => (
              <div key={game.id} className="p-5 h-fit flex flex-col gap-5 ">
                <div>
                  <h3 className="text-3xl">{game.title}</h3>
                </div>
                <img src={game.image} alt={game.title} className="w-[600px]" />
                <div>
                  <h2 className="text-2xl font-bold">Game Description:</h2>
                  <p>{game.description}</p>
                  <h2 className="text-2xl font-bold">CurrentPrice:</h2>
                  <p>{game.starting_price}฿</p>
                  <h2 className="text-2xl font-bold">Time Remaining:</h2>
                  <p>
                    <Countdown
                      date={new Date(game.end_time).getTime()}
                      renderer={countdownRenderer}
                    />
                  </p>
                </div>

                {/* Display bid history */}
                <div>
                  <h2 className="text-2xl font-bold">Bid History:</h2>
                  <ul>
                    {bidHistory && bidHistory.length > 0 ? (
                      bidHistory.map((bid, index) => (
                        <li key={index} className="border-b py-2">
                          <strong>{bid.name}</strong> placed a bid of{" "}
                          {bid.bid_price}฿ at {new Date(bid.timestamp).toLocaleString()}
                        </li>
                      ))
                    ) : (
                      <p>No bids placed yet.</p>
                    )}
                  </ul>
                </div>

                <form onSubmit={handleBidSubmit} className="flex flex-col gap-4">
                  <input
                    type="number"
                    name="bid_price"
                    placeholder="Enter Bid Price"
                    value={bidData.bid_price}
                    onChange={handleBidChange}
                    required
                    className="border-2 rounded-xl p-2"
                  />
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={bidData.name}
                    onChange={handleBidChange}
                    required
                    className="border-2 rounded-xl p-2"
                  />
                  <button
                    type="submit"
                    className="bg-blue-500 text-white p-2 rounded"
                  >
                    Place Bid
                  </button>
                </form>
              </div>
            ))
          ) : (
            <p>No games found for this category.</p>
          )}
        </div>
      </section>
    </>
  );
}
