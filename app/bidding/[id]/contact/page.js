"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

export default function Page() {
  const [formContactData, setFormContactData] = useState({
    first_name: "",
    last_name: "",
    mobile: "",
    email: "",
  });

  const { id } = useParams();
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormContactData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:8000/post-game/${id}/contact`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formContactData),
        }
      );
      console.log("response:", response);

      const result = await response.json();

      if (response.ok) {
        alert(result.message);
        setFormContactData({
          first_name: "",
          last_name: "",
          mobile: "",
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
    <div className="w-full h-full flex flex-col justify-center items-center">
      <h1 className="text-4xl font-extrabold dark:text-white my-10">
        Contact Information
      </h1>
      <form
        onSubmit={handleSubmit}
        className="border-4 p-4 flex flex-col gap-4 w-96 rounded-lg"
      >
        <input
          className="border-2 p-2 rounded-lg"
          type="text"
          name="first_name"
          placeholder="First Name"
          value={formContactData.first_name}
          onChange={handleChange}
          required
        />
        <input
          className="border-2 p-2 rounded-lg"
          type="text"
          name="last_name"
          placeholder="Last Name"
          value={formContactData.last_name}
          onChange={handleChange}
          required
        />
        <input
          className="border-2 p-2 rounded-lg"
          type="text"
          name="mobile"
          placeholder="Mobile Number"
          value={formContactData.mobile}
          onChange={handleChange}
          required
        />
        <input
          className="border-2 p-2 rounded-lg"
          type="email"
          name="email"
          placeholder="Email"
          value={formContactData.email}
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded mt-4"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
