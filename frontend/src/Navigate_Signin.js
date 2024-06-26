import React from 'react';
import { useHistory } from 'react-router-dom';

const NavigateToSignIn = () => {
  const history = useHistory();
  React.useEffect(() => {
    history.push('/Signin');
  }, [history]); // Make sure to include history as a dependency in useEffect

  return null;
};

export default NavigateToSignIn;
