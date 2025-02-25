"use client";

import { useState } from "react";
import { User, LogOut, Menu, X } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useAuth } from "../../lib/useAuth";
import Link from "next/link";

export default function Navbar() {
  const { user, loading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <nav className="bg-[#282828] text-white p-4">
      <div className="container mx-auto flex justify-between items-center h-full">
        <div className="text-xl font-bold">
          <Link href={"/"}>Autism Insight</Link>
        </div>

        <button
          className="md:hidden p-2 text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div
          className={`md:flex md:items-center md:space-x-4 ${
            isOpen ? "block" : "hidden"
          } w-full md:w-auto absolute md:relative top-16 md:top-0 left-0 md:flex bg-[#282828] md:bg-transparent p-4 md:p-0 shadow-lg md:shadow-none`}
        >
          <Link
            href="./detect"
            className="block text-sm text-gray-300 hover:text-white hover:underline p-2"
          >
            Detect
          </Link>
          <Link
            href="/progress"
            className="block text-sm text-gray-300 hover:text-white hover:underline p-2"
          >
            Progress
          </Link>
          <Link
            href="/centers"
            className="block text-sm text-gray-300 hover:text-white hover:underline p-2"
          >
            Centers
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          {!loading && user ? (
            <div className="flex items-center space-x-2">
              <Link href="/user">
                <User size={32} className="p-1 rounded-full border" />
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-300 hover:text-white flex items-center bg-primary p-2 rounded-md gap-2"
              >
                <span>Logout</span>
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <button className="text-sm text-gray-300 hover:text-white">
              <Link href={"/login"}>Login / Signup</Link>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

// "use client";

// import { User, LogOut } from "lucide-react";
// import { signOut } from "firebase/auth";
// import { auth } from "../../lib/firebase";
// import { useAuth } from "../../lib/useAuth";
// import Link from "next/link";

// export default function Navbar() {
//   const { user, loading } = useAuth();

//   const handleLogout = async () => {
//     try {
//       await signOut(auth);
//     } catch (error) {
//       console.error("Error signing out:", error);
//     }
//   };

//   return (
//     <nav className="bg-[#282828] text-white p-4 ">
//       <div className="container mx-auto flex justify-between items-center h-full">
//         <div className="text-xl font-bold">
//           <Link href={"/"}>Autism Insight</Link>
//         </div>

//         <div className="flex items-center space-x-4">
//           <Link href="./detect">
//             <span className="text-sm text-gray-300 hover:text-white hover:underline">
//               Detect
//             </span>
//           </Link>
//           <Link href="/progress">
//             <span className="text-sm text-gray-300 hover:text-white hover:underline">
//               Progress
//             </span>
//           </Link>
//           <Link href="/centers">
//             <span className="text-sm text-gray-300 hover:text-white hover:underline">
//               Centers
//             </span>
//           </Link>
//         </div>

//         <div className="flex items-center space-x-4">
//           {!loading && user ? (
//             <>
//               {}
//               <div className="flex items-center space-x-2">
//                 <Link href="/user">
//                   <User size={32} className="p-1 rounded-full border" />
//                 </Link>
//                 <button
//                   onClick={handleLogout}
//                   className="text-sm text-gray-300 hover:text-white flex items-center bg-primary p-2 rounded-md gap-2"
//                 >
//                   <span>Logout</span>
//                   <LogOut size={15} />
//                 </button>
//               </div>
//             </>
//           ) : (
//             <div>
//               <button className="text-sm text-gray-300 hover:text-white">
//                 <Link href={"/login"}>Login /Signup</Link>
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// }
