import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
import Header from '../components/header';

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <Component {...pageProps} />
    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  // For the AppComponent, the structure of the object passed
  // as argument, differs slightly.
  console.log(appContext);
  const client = buildClient(appContext.ctx);
  const { data } = (await client.get('/api/users/currentuser').catch((err) => {
    console.error(err.message);
    console.error('Error Data:');
    console.log(err.response?.data);
  })) || { data: { currentUser: null } };
  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }
  console.log(pageProps);
  return { pageProps, ...data };
};

export default AppComponent;
