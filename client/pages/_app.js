import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';

const AppComponent = ({ Component, pageProps }) => {
  return (
    <div>
      <h1>Header!</h1>
      <Component {...pageProps} />
    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  // For the AppComponent, the structure of the object passed
  // as argument, differs slightly.
  console.log(appContext);
  const client = buildClient(appContext.ctx);
  const { data } = await client.get('/api/users/currentuser');
  const pageProps = await appContext.Component.getInitialProps(appContext.ctx);

  return data;
};

export default AppComponent;
