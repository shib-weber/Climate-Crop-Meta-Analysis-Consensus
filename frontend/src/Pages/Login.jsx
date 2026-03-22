function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">

      <div className="bg-gray-900 p-8 rounded-2xl shadow-lg w-[350px]">
        
        <h2 className="text-2xl font-bold mb-6 text-center">
          Welcome Back 👋
        </h2>

        {/* Email Input */}
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-green-500"
        />

        {/* Password Input */}
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-green-500"
        />

        {/* Login Button */}
        <button className="w-full bg-green-500 py-2 rounded-lg hover:bg-green-600 mb-4">
          Login
        </button>

        {/* Divider */}
        <div className="flex items-center gap-2 mb-4">
          <hr className="flex-1 border-gray-700" />
          <span className="text-gray-400 text-sm">OR</span>
          <hr className="flex-1 border-gray-700" />
        </div>

        {/* Google Login */}
        <button className="w-full flex items-center justify-center gap-2 bg-white text-black py-2 rounded-lg hover:bg-gray-200">
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="google"
            className="w-5 h-5"
          />
          Continue with Google
        </button>

        {/* Signup Redirect */}
        <p className="text-sm text-gray-400 mt-4 text-center">
          Don’t have an account?{" "}
          <a href="/signup" className="text-green-400 hover:underline">
            Sign Up
          </a>
        </p>

      </div>

    </div>
  );
}

export default Login;