import React, { createContext, useContext, useState } from "react";

export const CaptainDataContext = createContext();

// export const useCaptain = () => {

//   const context = useContext(CaptainDataContext);

//   if (!context) {
//     throw new Error(
//       "useCaptain must be used within a CaptainContext"
//     );
//   }

//   return context;

// };

const CaptainContext = ({ children }) => {

  const [captain, setCaptain] = useState(null);

  const [error, setError] = useState(null);

  const [isLoading, setIsLoading] = useState(false);


  const updateCaptain = (captainData) => {

    setCaptain(captainData);

  };


  const value = {

    captain,
    setCaptain,

    error,
    setError,

    isLoading,
    setIsLoading,

    updateCaptain

  };


  return (

    <CaptainDataContext.Provider value={value}>

      {children}

    </CaptainDataContext.Provider>

  );

};

export default CaptainContext;
