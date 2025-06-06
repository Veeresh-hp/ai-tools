import React, { useState, useEffect } from 'react';
   import { Link } from 'react-router-dom';

   const Navbar = () => {
     const [isDropdownOpen, setIsDropdownOpen] = useState(false);
     const [isLoggedIn, setIsLoggedIn] = useState(false);

     useEffect(() => {
       setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
     }, []);

     const handleLogout = () => {
       localStorage.removeItem('isLoggedIn');
       localStorage.removeItem('token');
       localStorage.removeItem('userEmail');
       setIsLoggedIn(false);
       window.location.reload();
     };

     const categories = [
       { name: 'Faceless AI Video', id: 'faceless-video' },
       { name: 'AI Video Generators', id: 'video-generators' },
       { name: 'AI Writing Tools', id: 'writing-tools' },
       { name: 'AI Presentation Tools', id: 'presentation-tools' },
       { name: 'AI Short Clippers', id: 'short-clippers' },
       { name: 'AI Marketing Tools', id: 'marketing-tools' },
       { name: 'AI Voice/Audio Tools', id: 'voice-tools' },
       { name: 'AI Website Builders', id: 'website-builders' },
       { name: 'AI Image Generators', id: 'image-generators' },
       { name: 'ChatGPT Alternatives', id: 'chatbots' },
       { name: 'Other AI Tools', id: 'other-tools' },
       { name: 'Utility Tools', id: 'utility-tools' },
     ];

     return (
       <nav className="flex items-center justify-between px-4 sm:px-6 md:px-10 lg:px-16 h-14 border-b border-gray-200">
         <div className="flex items-center space-x-2">
           <span className="font-black text-xl select-none">AI</span>
           <img
             src="https://storage.googleapis.com/a1aa/image/6e4a16ca-aaf6-4f15-2db2-41cb5b581a52.jpg"
             alt="Red brain icon representing AI"
             className="w-5 h-5"
           />
           <span className="font-black text-xl select-none">TOOLS</span>
         </div>
         <ul className="hidden sm:flex space-x-6 text-xs font-semibold">
           <li>
             <Link to="/#chatbots" className="hover:underline flex items-center">
               <i className="fas fa-robot mr-1"></i> CHATBOTS
             </Link>
           </li>
           <li>
             <Link to="/#image-generators" className="hover:underline flex items-center">
               <i className="fas fa-image mr-1"></i> IMAGE GENERATORS
             </Link>
           </li>
           <li>
             <Link to="/#writing-tools" className="hover:underline flex items-center">
               <i className="fas fa-pen mr-1"></i> TEXT TOOLS
             </Link>
           </li>
           <li>
             <Link to="/#video-tools" className="hover:underline flex items-center">
               <i className="fas fa-video mr-1"></i> VIDEO TOOLS
             </Link>
           </li>
           <li>
             <Link to="/about" className="hover:underline flex items-center">
               <i className="fas fa-info-circle mr-1"></i> ABOUT
             </Link>
           </li>
           <li>
             <Link to="/contact" className="hover:underline flex items-center">
               <i className="fas fa-envelope mr-1"></i> CONTACT
             </Link>
           </li>
           <li className="relative group cursor-pointer">
             <button className="flex items-center gap-1 hover:underline">
               <i className="fas fa-tools mr-1"></i> ALL TOOLS
               <i className="fas fa-caret-down text-[10px]"></i>
             </button>
             <ul className="absolute hidden group-hover:block bg-white shadow-lg rounded-md mt-2 py-2 text-xs">
               {categories.map((category) => (
                 <li key={category.id}>
                   <Link to={`/#${category.id}`} className="block px-4 py-2 hover:bg-gray-100">
                     {category.name}
                   </Link>
                 </li>
               ))}
             </ul>
           </li>
         </ul>
         <div className="flex items-center space-x-4 text-xs font-normal">
           {!isLoggedIn && (
             <>
               <Link to="/login" className="hover:underline flex items-center">
                 <i className="fas fa-sign-in-alt mr-1"></i> Login
               </Link>
               <Link
                 to="/signup"
                 className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-3 py-1 rounded-md flex items-center"
               >
                 <i className="fas fa-user-plus mr-1"></i> Sign up
               </Link>
             </>
           )}
           <div className="relative">
             <button
               aria-label="More options"
               className="p-1 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
               onClick={() => setIsDropdownOpen(!isDropdownOpen)}
             >
               <i className="fas fa-th fa-xs text-gray-700"></i>
             </button>
             {isDropdownOpen && (
               <ul className="absolute right-0 bg-white shadow-lg rounded-md mt-2 py-2 text-xs z-50">
                 {!isLoggedIn ? (
                   <>
                     <li>
                       <Link to="/login" className="block px-4 py-2 hover:bg-gray-100 flex items-center">
                         <i className="fas fa-sign-in-alt mr-1"></i> Login
                       </Link>
                     </li>
                     <li>
                       <Link to="/signup" className="block px-4 py-2 hover:bg-gray-100 flex items-center">
                         <i className="fas fa-user-plus mr-1"></i> Sign Up
                       </Link>
                     </li>
                   </>
                 ) : (
                   <li>
                     <button
                       onClick={handleLogout}
                       className="block px-4 py-2 hover:bg-gray-100 w-full text-left flex items-center"
                     >
                       <i className="fas fa-sign-out-alt mr-1"></i> Logout
                     </button>
                   </li>
                 )}
                 <li>
                   <Link to="/about" className="block px-4 py-2 hover:bg-gray-100 flex items-center">
                     <i className="fas fa-info-circle mr-1"></i> About
                   </Link>
                 </li>
                 <li>
                   <Link to="/contact" className="block px-4 py-2 hover:bg-gray-100 flex items-center">
                     <i className="fas fa-envelope mr-1"></i> Contact
                   </Link>
                 </li>
               </ul>
             )}
           </div>
         </div>
       </nav>
     );
   };

   export default Navbar;