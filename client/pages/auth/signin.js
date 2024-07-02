import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

const signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const [errors, setErrors] = useState([]);
  const { doRequest, errors } = useRequest({
    url: '/api/users/signin',
    method: 'post',
    body: {
      email,
      password,
    },
    onSuccess: () => {
      Router.push('/');
    },
  });
  const onSubmit = async (event) => {
    event.preventDefault();
    await doRequest();
    // console.log(nothing);
    // console.log(errors);
    // if (!errors) Router.push('/');
  };
  return (
    <form onSubmit={onSubmit}>
      <h1> Sign In!</h1>
      <div className='form-group'>
        <label> Email Address</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='form-control'
        />
      </div>
      <div className='form-group'>
        <label> Password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type='password'
          className='form-control'
        />
      </div>
      {errors}
      <button className='btn btn-primary col md-col-12'>Sign Up</button>
    </form>
  );
};

export default signin;
