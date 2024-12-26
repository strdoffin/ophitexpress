"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category_id: "",
    item_condition: "",
    starting_price: "",
    end_time: "",
    image: "",
    email: "",
  });

  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Get the current time
    const now = new Date();

    // Convert form end_time to Date object
    const endTime = new Date(formData.end_time);

    // Calculate the difference in milliseconds
    const deltaTime = endTime - now;

    // Check if the delta time is at least 60 minutes (60 * 60 * 1000 ms)
    if (deltaTime <= 60 * 60 * 1000) {
      alert("The end time must be at least 60 minutes from now.");
      return; // Prevent form submission
    }

    try {
      const response = await fetch(`http://localhost:8000/post-game`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      console.log("response:", response);

      const result = await response.json();

      if (response.ok) {
        alert(result.message);
        setFormData({
          title: "",
          description: "",
          category_id: "",
          item_condition: "",
          starting_price: "",
          end_time: "",
          image: "",
          email: "",
        });
        router.push("/");
      } else {
        alert(result.error || "Error submitting the form");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An unexpected error occurred");
    }
  };

  return (
    <div className="w-full h-full flex flex-col  justify-center items-center">
      <h1 className="text-4xl font-extrabold dark:text-white my-10">
        Post Game
      </h1>
      <form
        onSubmit={handleSubmit}
        className="border-4 p-4 flex flex-col gap-4 w-96 rounded-lg"
      >
        <input
          className="border-2 p-2 rounded-lg"
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <input
          className="border-2 p-2 rounded-lg"
          type="text"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <input
          className="border-2 p-2 rounded-lg"
          type="text"
          name="category_id"
          placeholder="Category ID"
          value={formData.category_id}
          onChange={handleChange}
          required
        />
        <input
          className="border-2 p-2 rounded-lg"
          type="text"
          name="item_condition"
          placeholder="Item Condition"
          value={formData.item_condition}
          onChange={handleChange}
          required
        />
        <input
          className="border-2 p-2 rounded-lg"
          type="number"
          name="starting_price"
          placeholder="Starting Price"
          value={formData.starting_price}
          onChange={handleChange}
          required
        />
        <input
          className="border-2 p-2 rounded-lg"
          type="datetime-local"
          name="end_time"
          placeholder="End Time"
          value={formData.end_time}
          onChange={handleChange}
          required
        />
        <input
          className="border-2 p-2 rounded-lg"
          type="text"
          name="image"
          placeholder="Image URL"
          value={formData.image}
          onChange={handleChange}
          required
        />
        <input
          className="border-2 p-2 rounded-lg"
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Submit</button>
      </form>
    </div>
  );
}
