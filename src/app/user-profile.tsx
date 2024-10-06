"use client"
import { useSession, signOut } from "next-auth/react";

const UserProfile = () => {
  const { data: session } = useSession();

  return (
    <div>
      {session ? (
        <>
          <h1>Welcome, {session.user?.name}</h1>
          <button onClick={() => signOut()}>Sign Out</button>
        </>
      ) : (
        <h1>You are not signed in.</h1>
      )}
    </div>
  );
};

export default UserProfile;
