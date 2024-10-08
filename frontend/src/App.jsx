import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/auth/login/LoginPage";
import SignUpPage from "./pages/auth/signup/SignUpPage";
import Sidebar from "./components/common/Sidebar";
import RightPanel from "./components/common/RightPanel";
import NotificationPage from "./pages/notification/NotificationPage";
import ProfilePage from "./pages/profile/ProfilePage";
import { Toaster } from "react-hot-toast";
import { useAuthUser } from "./hooks/useAuthUser";
import SavedPostPage from "./pages/saved/SavedPostPage";
import SharePostPage from "./pages/share/SharePostPage";
import { AnimatePresence } from "framer-motion";

const App = () => {
  const location = useLocation();

  const { authUser, isLoading } = useAuthUser();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-dots loading-lg" />
      </div>
    );
  }
  return (
    <div className="flex max-w-6xl mx-auto">
      {/* common component not wrapped in router */}
      {authUser && <Sidebar />}
      <AnimatePresence
        mode="wait"
        initial={false}
        onExitComplete={() => window.scrollTo(0, 0)}
      >
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={authUser ? <HomePage /> : <Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={!authUser ? <LoginPage /> : <Navigate to="/" />}
          />
          <Route
            path="/signup"
            element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
          />
          <Route
            path="/notifications"
            element={authUser ? <NotificationPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/profile/:username"
            element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
          />
          <Route
            path="/posts/saved/:userId"
            element={authUser ? <SavedPostPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/posts/shared/:userId"
            element={authUser ? <SharePostPage /> : <Navigate to="/login" />}
          />
        </Routes>
      </AnimatePresence>
      {authUser && <RightPanel />}
      <Toaster />
    </div>
  );
};

export default App;
