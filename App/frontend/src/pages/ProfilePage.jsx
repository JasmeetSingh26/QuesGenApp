import React from "react";
import { useContext, useState } from "react";
import { UserContext } from "../UserContext";
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";


function ProfilePage() {
  const [redirect, setRedirect] = useState(null);
  const { ready, user, setUser } = useContext(UserContext);
  let { subpage } = useParams();
  if (subpage === undefined) {
    subpage = "profile";
  }

  async function logout() {
    await axios.post("http://localhost:4000/logout");
    setRedirect("/");
    setUser(null);
  }

  if (!ready) return <div>Loading...</div>;

  if (ready && !user && !redirect) return <Navigate to={"/login"} />;

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <div>

      {subpage === "profile" && (
        <div className="max-w-lg px-4 md:px-0 mx-auto text-center">
          <span>
            Logged in as {user.name} ({user.email})
          </span>
          <button onClick={logout} className="secondary max-w-sm mt-3">
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;
