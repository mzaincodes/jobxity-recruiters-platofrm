// "use client";

// import { createContext, useContext, useState, useEffect } from "react";
// import axios from "axios";
// import { useSession, signOut } from "next-auth/react";

// const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//   const { data: session } = useSession();
//   const [userData, setUserData] = useState(null);

//   useEffect(() => {
//     async function fetchUserDetails() {
//       if (session?.user?.email) {
//         try {
//           const response = await axios.get(`/api/user/recruiter`, {
//             params: { email: session.user.email },
//           });

//           if (response.status === 200) {
//             setUserData(response.data);
//           }
//         } catch (error) {
//           console.error("Error fetching user details:", error);
//         }
//       }
//     }

//     fetchUserDetails();
//   }, [session]);

//   // Function to handle logout and clear user data
//   const logoutUser = () => {
//     setUserData(null); // Clear user data
//     document.cookie = "org=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; // Clear cookies
//     sessionStorage.removeItem("user"); // Clear sessionStorage
//     signOut({ callbackUrl: "/" }); // Sign out user and redirect to home
//   };

//   return (
//     <UserContext.Provider value={{ userData, setUserData, logoutUser }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// export const useUser = () => useContext(UserContext);



// "use client";

// import { createContext, useContext, useState, useEffect } from "react";
// import axios from "axios";
// import { useSession, signOut } from "next-auth/react";

// const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//   const { data: session } = useSession();
//   const [userData, setUserData] = useState(null);

//   // Function to fetch user details
//   const fetchUserDetails = async (email) => {
//     try {
//       const response = await axios.get(`/api/user/recruiter`, {
//         params: { email },
//       });

//       if (response.status === 200) {
//         const encodedData = btoa(JSON.stringify(response.data)); // Encode data
//         sessionStorage.setItem("user", encodedData); // Store encoded data
//         setUserData(response.data);
//       }
//     } catch (error) {
//       console.error("Error fetching user details:", error);
//     }
//   };

//   useEffect(() => {
//     if (session?.user?.email) {
//       fetchUserDetails(session.user.email);
//     } else {
//       // Retrieve and decode user data from sessionStorage
//       const storedUser = sessionStorage.getItem("user");
//       if (storedUser) {
//         try {
//           const decodedUser = JSON.parse(atob(storedUser)); // Decode and parse data
//           setUserData(decodedUser);
//         } catch (error) {
//           console.error("Error decoding user data:", error);
//           sessionStorage.removeItem("user"); // Remove corrupted data
//         }
//       }
//     }
//   }, [session]);

//   // Function to manually log in and set user data
//   const manualLogin = async (email) => {
//     await fetchUserDetails(email);
//   };

//   // Function to handle logout
//   const logoutUser = () => {
//     setUserData(null);
//     document.cookie = "org=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
//     sessionStorage.removeItem("user");
//     signOut({ callbackUrl: "/" });
//   };

//   return (
//     <UserContext.Provider value={{ userData, setUserData, manualLogin, logoutUser }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// export const useUser = () => useContext(UserContext);
