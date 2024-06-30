import { FcMindMap } from "react-icons/fc";
import { TfiEmail } from "react-icons/tfi";
import { FaUser } from "react-icons/fa";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { MdPassword } from "react-icons/md";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
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
  const email = useRef();
  const username = useRef();
  const fullName = useRef();
  const password = useRef();

  const [formData, setFormData] = useState({});
  const [error, setError] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    setFormData({
      email: email.current.value,
      username: username.current.value,
      fullName: fullName.current.value,
      password: password.current.value,
    });
    email.current.value = "";
    username.current.value = "";
    fullName.current.value = "";
    password.current.value = "";
    if (
      email.current.value === "" &&
      username.current.value === "" &&
      fullName.current.value === "" &&
      password.current.value === ""
    ) {
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 4000);
    }
  };

  console.log(formData);
  return (
    <section
      className="w-full h-screen p-5 lg:px-20 xl:px-28 lg:py-10 grid grid-flow-row lg:grid-cols-2 place-items-center overflow-x-hidden"
      ref={container}
    >
      {/* logo section */}
      <section className="w-1/2 sm:w-1/3 lg:w-72 xl:w-80 aspect-square">
        <FcMindMap size={{ base: 60 }} className="icon" />
      </section>
      {/* form section */}
      <section>
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
              ref={email}
            />
          </label>
          <label className="input input-bordered flex items-center gap-2 rounded-md lab">
            <FaUser size={15} />
            <input
              type="text"
              className="grow"
              placeholder="Username"
              ref={username}
            />
          </label>
          <label className="input input-bordered flex items-center gap-2 rounded-md lab">
            <MdDriveFileRenameOutline size={15} />
            <input
              type="text"
              className="grow"
              placeholder="Full Name"
              ref={fullName}
            />
          </label>
          <label className="input input-bordered flex items-center gap-2 rounded-md lab">
            <MdPassword size={15} />
            <input
              type="password"
              className="grow"
              placeholder="Password"
              ref={password}
            />
          </label>
          <button
            className="btn btn-primary rounded-full hover:bg-cyan-600 border-none button"
            type="submit"
          >
            Sign Up
          </button>
          {error && (
            <p className="text-red-500 text-center sm:text-xl lg:text-sm lg:text-left">
              Something went wrong
            </p>
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
