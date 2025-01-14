import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import ClientsContext from '../context';

const ClientsProvider = ({ children }) => {

  return (
    <ClientsContext.Provider
      value={{
      }}
    >
      {children}
    </ClientsContext.Provider>
  );
};

export default ClientsProvider;
