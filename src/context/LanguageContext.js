// // src/context/LanguageContext.js
// import React, { createContext, useState } from 'react';

// export const LanguageContext = createContext();

// export const LanguageProvider = ({ children }) => {
//   const [language, setLanguage] = useState('en');

//   const translations = {
//     en: {
//       // Navbar translations
//       services: "Services",
//       products: "Products",
//       about: "About",
//       contact: "Contact",
//       myDashboard: "My Dashboard",
//       adminDashboard: "Admin Dashboard",
//       cart: "Cart",
//       logout: "Logout",
//       login: "Login",
//       register: "Register",
//       profile: "Profile",
//       bookings: "My Bookings",
//       trackOrder: "Track Order",
//       previousOrder: "My Previous Order",
      
//       // HomePage translations
//       welcome: "Welcome to AgriHub",
//       empowering: "Empowering farmers with smart solutions.",
//       features: "Our Features",
//       cropManagement: "Crop Management",
//       cropDesc: "Plan, track, and optimize your crops with precision.",
//       weather: "Weather Updates",
//       weatherDesc: "Real-time forecasts for better planning.",
//       market: "Market Insights",
//       marketDesc: "Stay ahead with market trends.",
//       explore: "Explore",
//       servicesTitle: "Our Services",
//       consultation: "Consultation",
//       consultDesc: "Expert farming guidance.",
//       disease: "Disease Detection",
//       diseaseDesc: "AI-driven crop health monitoring.",
//       equipment: "Equipment",
//       equipDesc: "Modern farming tools.",
//       testimonials: "What Farmers Say",
//       slogan1: "--- BUILD THE AGRIHUB ------",
//       slogan2: "ONE STOP - FARMING - SOLUTION"
//     },
//     gu: {
//       // Navbar translations
//       services: "સેવાઓ",
//       products: "ઉત્પાદનો",
//       about: "અમારા વિશે",
//       contact: "સંપર્ક",
//       myDashboard: "મારું ડેશબોર્ડ",
//       adminDashboard: "એડમિન ડેશબોર્ડ",
//       cart: "કાર્ટ",
//       logout: "લોગઆઉટ",
//       login: "લોગિન",
//       register: "નોંધણી",
//       profile: "પ્રોફાઇલ",
//       bookings: "મારા બુકિંગ્સ",
//       trackOrder: "ઓર્ડર ટ્રેક",
//       previousOrder: "મારો પાછલો ઓર્ડર",
      
//       // HomePage translations
//       welcome: "એગ્રીહબમાં આપનું સ્વાગત છે",
//       empowering: "ખેડૂતોને સ્માર્ટ સોલ્યુશન્સ સાથે સશક્તિકરણ.",
//       features: "અમારી વિશેષતાઓ",
//       cropManagement: "પાક વ્યવસ્થાપન",
//       cropDesc: "તમારા પાકને ચોકસાઈ સાથે આયોજન, ટ્રેક અને ઑપ્ટિમાઇઝ કરો.",
//       weather: "હવામાન અપડેટ્સ",
//       weatherDesc: "વધુ સારી આયોજન માટે રીઅલ-ટાઇમ આગાહીઓ.",
//       market: "બજાર આંતરદૃષ્ટિ",
//       marketDesc: "બજારના ટ્રેન્ડ્સ સાથે આગળ રહો.",
//       explore: "અન્વેષણ કરો",
//       servicesTitle: "અમારી સેવાઓ",
//       consultation: "પરામર્શ",
//       consultDesc: "નિષ્ણાત ખેતી માર્ગદર્શન.",
//       disease: "રોગ શોધ",
//       diseaseDesc: "AI-સંચાલિત પાક આરોગ્ય નિરીક્ષણ.",
//       equipment: "સાધનો",
//       equipDesc: "આધુનિક ખેતી સાધનો.",
//       testimonials: "ખેડૂતો શું કહે છે",
//       slogan1: "--- એગ્રીહબ બનાવો ------",
//       slogan2: "વન સ્ટોપ - ખેતી - સોલ્યુશન"
//     }
//   };

//   const value = {
//     language,
//     setLanguage,
//     t: (key) => translations[language][key] || key
//   };

//   return (
//     <LanguageContext.Provider value={value}>
//       {children}
//     </LanguageContext.Provider>
//   );
// };