import React from 'react';

   const Contact = () => {
     return (
       <section className="px-4 sm:px-6 md:px-10 lg:px-16 py-10 max-w-4xl mx-auto">
         <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
           Contact Us 📬
         </h1>
         <div className="bg-white p-6 rounded-md shadow-sm border border-gray-200">
           <p className="text-gray-700 mb-4">
             Got a question, suggestion, or just wanna chat about AI? We’re all ears... or rather, all pixels! 😎
           </p>
           <p className="text-gray-700 mb-4">
             Drop us a line at{' '}
             <a href="mailto:support@aitoolshub.com" className="text-blue-600 hover:underline">
               support@aitoolshub.com
             </a>{' '}
             and we’ll get back to you faster than an AI can generate a meme! 🚀
           </p>
           <p className="text-gray-700">
             Follow us on social media for the latest AI shenanigans:
             <ul className="list-disc pl-6 mt-2">
               <li>
                 <a href="#" className="text-blue-600 hover:underline">
                   Twitter: @AIToolsHub 😜
                 </a>
               </li>
               <li>
                 <a href="#" className="text-blue-600 hover:underline">
                   GitHub: AIToolsHub 🐱
                 </a>
               </li>
             </ul>
           </p>
         </div>
       </section>
     );
   };

   export default Contact;