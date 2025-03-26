// import React, { useState } from "react";
// import "./styles/Profile.css";
// import NavigationBar from "../components/Navbar";
// // import UserImg from '../img/sign.avif';
// const Profile = () => {
//   const [isEditing, setIsEditing] = useState(false);
//   const [isAddingEmail, setIsAddingEmail] = useState(false);
//   const [formData, setFormData] = useState({
//     fullName: "Abc Patel",
//     nickName: "Patel",
//     gender: "Female",
//     country: "USA",
//     language: "English",
//     timeZone: "GMT",
//     email: "abc@gmail.com",
//     additionalEmails: [], // New field to store additional email addresses
//   });
//   const [newEmail, setNewEmail] = useState("");

//   const handleEditClick = () => {
//     setIsEditing(!isEditing);
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleSave = () => {
//     // Add logic to save changes, e.g., make API call
//     setIsEditing(false);
//   };

//   const handleAddEmailClick = () => {
//     setIsAddingEmail(!isAddingEmail);
//   };

//   const handleAddEmail = () => {
//     if (newEmail) {
//       setFormData((prevData) => ({
//         ...prevData,
//         additionalEmails: [...prevData.additionalEmails, newEmail],
//       }));
//       setNewEmail(""); // Reset the new email input field
//       setIsAddingEmail(false); // Close the input field
//     }
//   };

//   return (
//     <div className="flex min-h-screen"><NavigationBar />
//       <aside className="w-16 bg-white shadow-md">
//         <div className="flex flex-col items-center py-4">
//           <div className="mb-4">
//             <i className="fas fa-th text-xl text-blue-500"></i>
//           </div>
//           <div className="mb-4">
//             <i className="fas fa-user text-xl text-gray-400"></i>
//           </div>
//           <div className="mb-4">
//             <i className="fas fa-cog text-xl text-gray-400"></i>
//           </div>
//         </div>
//       </aside>
//       <main className="flex-1 p-6">
//         <header className="flex justify-between items-center mb-6">
//           <div>
//             <h1 className="text-2xl font-semibold">Welcome</h1>
//             <p className="text-gray-500">Tue, 07 June 2022</p>
//           </div>
//           <div className="flex items-center">
//             <div className="relative">
//               <input
//                 type="text"
//                 placeholder="Search"
//                 className="pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//               <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
//             </div>
//             <img
//               src={require("../img/sign.avif")}
//               alt="User profile"
//               className="ml-4 w-10 h-10 rounded-full"
//             />
//           </div>
//         </header>
//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <div className="flex items-center mb-6">
//             <img 
//             src={require("../img/sign.jpg")}
//               alt="Profile picture of Alexa Rawles"
//               className="w-20 h-20 rounded-full mr-4"
//             />
//             <div>
//               <h2 className="text-xl font-semibold">{formData.fullName}</h2>
//               <p className="text-gray-500">{formData.email}</p>
//             </div>
//             <button
//               onClick={handleEditClick}
//               className="ml-auto bg-blue-500 text-white px-4 py-2 rounded-lg"
//             >
//               {isEditing ? "Cancel" : "Edit"}
//             </button>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <label className="block text-gray-700">Full Name</label>
//               <input
//                 type="text"
//                 name="fullName"
//                 value={formData.fullName}
//                 onChange={handleChange}
//                 disabled={!isEditing}
//                 className="w-full mt-2 p-2 border border-gray-300 rounded-lg"
//               />
//             </div>
//             <div>
//               <label className="block text-gray-700">Nick Name</label>
//               <input
//                 type="text"
//                 name="nickName"
//                 value={formData.nickName}
//                 onChange={handleChange}
//                 disabled={!isEditing}
//                 className="w-full mt-2 p-2 border border-gray-300 rounded-lg"
//               />
//             </div>
//             <div>
//               <label className="block text-gray-700">Gender</label>
//               <input
//                 type="text"
//                 name="gender"
//                 value={formData.gender}
//                 onChange={handleChange}
//                 disabled={!isEditing}
//                 className="w-full mt-2 p-2 border border-gray-300 rounded-lg"
//               />
//             </div>
//             <div>
//               <label className="block text-gray-700">Country</label>
//               <input
//                 type="text"
//                 name="country"
//                 value={formData.country}
//                 onChange={handleChange}
//                 disabled={!isEditing}
//                 className="w-full mt-2 p-2 border border-gray-300 rounded-lg"
//               />
//             </div>
//             <div>
//               <label className="block text-gray-700">Language</label>
//               <input
//                 type="text"
//                 name="language"
//                 value={formData.language}
//                 onChange={handleChange}
//                 disabled={!isEditing}
//                 className="w-full mt-2 p-2 border border-gray-300 rounded-lg"
//               />
//             </div>
//             <div>
//               <label className="block text-gray-700">Time Zone</label>
//               <input
//                 type="text"
//                 name="timeZone"
//                 value={formData.timeZone}
//                 onChange={handleChange}
//                 disabled={!isEditing}
//                 className="w-full mt-2 p-2 border border-gray-300 rounded-lg"
//               />
//             </div>
//           </div>
//           <div className="mt-6">
//             <h3 className="text-lg font-semibold">My email Address</h3>
//             <div className="flex items-center mt-2">
//               <i className="fas fa-envelope text-blue-500 mr-2"></i>
//               <div>
//                 <p className="text-gray-700">{formData.email}</p>
//                 <p className="text-gray-500 text-sm">1 month ago</p>
//               </div>
//             </div>
//             <button
//               onClick={handleAddEmailClick}
//               className="mt-4 bg-blue-100 text-blue-500 px-4 py-2 rounded-lg"
//             >
//               +Add Email Address
//             </button>
//             {isAddingEmail && (
//               <div className="mt-4">
//                 <input
//                   type="email"
//                   value={newEmail}
//                   onChange={(e) => setNewEmail(e.target.value)}
//                   className="w-full p-2 border border-gray-300 rounded-lg"
//                   placeholder="Enter new email address"
//                 />
//                 <button
//                   onClick={handleAddEmail}
//                   className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg"
//                 >
//                   Add Email
//                 </button>
//               </div>
//             )}
//             {formData.additionalEmails.length > 0 && (
//               <div className="mt-6">
//                 <h4 className="text-lg font-semibold">Additional Email Addresses</h4>
//                 <ul>
//                   {formData.additionalEmails.map((email, index) => (
//                     <li key={index} className="text-gray-700">
//                       {email}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//           </div>
//           {isEditing && (
//             <div className="mt-6 flex justify-end">
//               <button
//                 onClick={handleSave}
//                 className="bg-blue-500 text-white px-4 py-2 rounded-lg"
//               >
//                 Save Changes
//               </button>
//             </div>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default Profile;
