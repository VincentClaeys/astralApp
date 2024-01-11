import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { checkIfLoggedIn } from '../utils/Validate';
import '../styles/root.css';

function MyApp({ Component, pageProps }) {
 const router = useRouter();

 useEffect(() => {
 checkIfLoggedIn(router);
 }, []);

 return <Component {...pageProps} />;
}

export default MyApp;
