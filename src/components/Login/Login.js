import React, { useState, useEffect, useReducer } from 'react';

import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';

//we're putting it outside the component
//because inside this reducer fn, we don't need
//any data generated inside the component
const emailReducer = (state, action) => {
  //What we'll dispatch as an action is an objection
  //because that's what we set as the parameters of the dispatchEmail
  if (action.type === 'USER_INPUT') {
    return { value: action.val, isValid: action.val.includes('@') };
  }
  if (action.type === 'INPUT_BLUR') {
    return { value: state.value, isValid: state.value.includes('@') };
  }
  return { value: '', isValid: false };
};

const passwordReducer = (state, action) => {
  if (action.type === 'USER_INPUT') {
    return { value: action.val, isValid: action.val.trim().length > 3 };
  }
  if (action.type === 'INPUT_BLUR') {
    return { value: state.value, isValid: state.value.trim().length > 3 };
  }
  return { value: '', isValid: false };
};

const Login = (props) => {
  // const [enteredEmail, setEnteredEmail] = useState('');
  // const [emailIsValid, setEmailIsValid] = useState();
  // const [enteredPassword, setEnteredPassword] = useState('');
  // const [passwordIsValid, setPasswordIsValid] = useState();
  const [formIsValid, setFormIsValid] = useState(false);

  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value: '',
    isValid: null,
  });

  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
    value: '',
    isValid: null,
  });

  //Use object de-structuring
  //we'll use alias assignment
  const { isValid: emailIsValid } = emailState;
  const { isValid: passwordIsValid } = passwordState;

  useEffect(
    () => {
      //this technique is debouncing
      //to ensures that we don't do anything
      //on the input for every keystroke
      const identifier = setTimeout(() => {
        console.log('checking for keystroke');
        //replaced event.target.value with enteredEmail state
        setFormIsValid(emailIsValid && passwordIsValid);
      }, 500);

      //this func will run as a clean up process
      //before useEffect exec this func next time
      return () => {
        console.log('CLEAN UP');
        //clearTimeout is built into the browser
        //this ensures that whenever the cleanup
        //func runs the timer is being cleared
        //now that we have clearTimeout, the func no longer check for all keystrokes
        clearTimeout(identifier);
      };
    },
    //add the function as dependency
    //it tells React that to re-render the component
    //if either enteredEmail or enteredPassword
    [emailIsValid, passwordIsValid]
  );

  const emailChangeHandler = (event) => {
    // setEnteredEmail(event.target.value);

    //the arg for dispatch email is the action
    //it can be a string, a number but often is an object
    dispatchEmail({ type: 'USER_INPUT', val: event.target.value });

    //will be moved to useEffect function
    // setFormIsValid(emailState.isValid && passwordState.isValid);
  };

  const passwordChangeHandler = (event) => {
    dispatchPassword({ type: 'USER_INPUT', val: event.target.value });

    // setFormIsValid(passwordState.isValid && emailState.isValid);
  };

  const validateEmailHandler = () => {
    // setEmailIsValid(emailState.isValid);
    dispatchEmail({ type: 'INPUT_BLUR' });
  };

  const validatePasswordHandler = () => {
    dispatchPassword({ type: 'INPUT_BLUR' });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    props.onLogin(emailState.value, passwordState.value);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <div
          className={`${classes.control} ${
            emailState.isValid === false ? classes.invalid : ''
          }`}
        >
          <label htmlFor="email">E-Mail</label>
          <input
            type="email"
            id="email"
            value={emailState.value}
            onChange={emailChangeHandler}
            onBlur={validateEmailHandler}
          />
        </div>
        <div
          className={`${classes.control} ${
            passwordState.isValid === false ? classes.invalid : ''
          }`}
        >
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={passwordState.value}
            onChange={passwordChangeHandler}
            onBlur={validatePasswordHandler}
          />
        </div>
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn} disabled={!formIsValid}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
