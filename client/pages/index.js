import axios from 'axios';

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

HomePage.getInitialProps = async ({ req }) => {
  let currentuser_url = '/api/users/currentuser';
  if (typeof window === 'undefined') {
    currentuser_url =
      'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser';
  }

  const response = await axios
    .get(currentuser_url, { headers: { Host: 'ticketing.local' } })
    .catch((err) => {
      console.log(
        `Auth Server (${currentuser_url}) Fails with:\n\t${err.message}`
      );
      console.log('Error Payload');
      console.log(err.response?.data);
    });
  console.log(`Response we are getting from auth-svc using SSR:`);
  console.log(response);
  return { currentUser: response?.data?.currentUser };
};

export default HomePage;
