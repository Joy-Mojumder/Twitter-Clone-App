import { FcMindMap } from "react-icons/fc";
import { TfiEmail } from "react-icons/tfi";
import { FaUser } from "react-icons/fa";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { MdPassword } from "react-icons/md";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
const SignUp = () => {
  //^ gsap animation section
  const container = useRef();
  useGSAP(() => {
    const tl = gsap.timeline({ duration: 0.4 });
    tl.from(".icon", {
      opacity: 0,
      x: -600,
      duration: 1.5,
      ease: "bounce.out",
    });
    tl.from(".lab", {
      opacity: 0,
      x: 600,
      duration: 0.5,
      ease: "power4.out",
      stagger: 0.1,
    });
    tl.fromTo(
      ".button",
      { opacity: 0 },
      {
        opacity: 1,
      }
    );
    gsap.to(".icon", { rotate: 360, repeat: -1, duration: 50 });
  });

  //^ form data here
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    fullName: "",
    password: "",
  });
  const [Err, setErr] = useState(false);

  const queryClient = useQueryClient();

  const { mutate, isError, isPending, error } = useMutation({
    mutationFn: async ({ email, username, fullName, password }) => {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, username, fullName, password }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      return data;
    },
    onSuccess: () => {
      toast.success("Account created successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    setErr(true);
    setTimeout(() => {
      setErr(false);
    }, 4000);
    mutate(formData);
  };
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  return (
    <section
      className="w-full h-screen p-5  grid grid-flow-row lg:grid-cols-2 place-items-center overflow-x-hidden"
      ref={container}
    >
      {/* logo section */}
      <section>
        <FcMindMap className="icon size-40 md:size-60 lg:size-80" />
      </section>
      {/* form section */}
      <section className="self-start lg:self-center">
        <form
          className="w-80 md:w-96 lg:w-80 h-auto flex flex-col gap-4"
          onSubmit={handleSubmit}
        >
          <h1 className="text-3xl sm:text-4xl lg:text-3xl lg:text-left font-extrabold text-center lab">
            Join TWitt
          </h1>
          <label className="input input-bordered flex items-center gap-2 rounded-md lab">
            <TfiEmail size={15} />
            <input
              type="text"
              className="grow"
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </label>
          <label className="input input-bordered flex items-center gap-2 rounded-md lab">
            <FaUser size={15} />
            <input
              type="text"
              className="grow"
              placeholder="Username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
            />
          </label>
          <label className="input input-bordered flex items-center gap-2 rounded-md lab">
            <MdDriveFileRenameOutline size={15} />
            <input
              type="text"
              className="grow"
              placeholder="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
            />
          </label>
          <label className="input input-bordered flex items-center gap-2 rounded-md lab">
            <MdPassword size={15} />
            <input
              type="password"
              className="grow"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
            />
          </label>
          <button
            className="btn btn-primary rounded-full hover:bg-cyan-600 border-none button"
            type="submit"
            disabled={isPending}
          >
            {isPending ? (
              <span className="loading loading-dots loading-md"></span>
            ) : (
              "Sign Up"
            )}
          </button>
          {isError && Err ? (
            <p className="text-red-500">{error.message}</p>
          ) : (
            ""
          )}
          <h2 className="text-center lab sm:text-xl lg:text-left lg:text-sm">
            Already have an account?
          </h2>
          <Link to="/login">
            <button className="btn btn-outline btn-info rounded-full button w-full">
              Sign In
            </button>
          </Link>
        </form>
      </section>
    </section>
  );
};

export default SignUp;
