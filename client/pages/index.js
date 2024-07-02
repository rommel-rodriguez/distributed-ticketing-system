import buildClient from '../api/build-client';

const HomePage = ({ currentUser }) => {
  console.log('I am on the component!!');
  console.log('Current User:');
  console.log(currentUser);

  return (
    <div>
      <h1>Landing Page</h1>
      <p>User is: {currentUser ? currentUser?.email : 'No User'}</p>
    </div>
  );
};

HomePage.getInitialProps = async (context) => {
  const client = buildClient(context);
  const { data } = await client.get('/api/users/currentuser');
  return data;
};

export default HomePage;
