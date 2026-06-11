import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import supabase from "../supabase-client";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return alert(error.message);

    await supabase.from("login").insert([{ email }]);
    navigate("/todo");
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">

      {/* 🌄 BACKGROUND IMAGE */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d')",
        }}
      />
      <div className="absolute inset-0 bg-black/70"></div>

      {/* MAIN CARD */}
      <div className="relative z-10 w-full max-w-5xl h-[600px] flex rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(236,72,153,0.25)] border border-pink-500/20">

        {/* LEFT SIDE */}
        <div className="w-1/2 relative hidden md:block">
          <img
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d"
            className="w-full h-full object-cover"
            alt="login"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-pink-900/20"></div>

          <div className="absolute bottom-8 left-8 text-white">
            <h2 className="text-pink-400 text-xs tracking-[0.3em]">
              RYSONIX TECHNOLOGIES
            </h2>
            <p className="text-xl font-semibold mt-2">
              Welcome back 👋
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full md:w-1/2 bg-black/60 backdrop-blur-xl p-10 flex flex-col justify-center">

          <h2 className="text-pink-400 text-lg tracking-[0.3em] text-center">
            LOGIN
          </h2>

          <h1 className="text-3xl font-bold text-white text-center mt-2 mb-8">
            Sign in to your account
          </h1>

          <div className="space-y-4">
            <input
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-black/50 border border-pink-500/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />

            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-black/50 border border-pink-500/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <button
            onClick={handleLogin}
            className="w-full mt-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:scale-[1.03] transition"
          >
            Login
          </button>

          <p className="text-center mt-6 text-sm text-gray-400">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-pink-400 hover:text-purple-400">
              Sign Up
            </Link>
          </p>

        
        </div>
      </div>
    </div>
  );
}

export default Login;