// pages/index.js
import React from 'react';
import Image from 'next/image';
import Button from '../components/button'; 
import styles from '../styles/Home.module.css';
import buttonStyles from '../styles/Button.module.css';
import Link from 'next/link';
import { useRouter } from 'next/router';



const Home = () => {

  const router = useRouter();

  const handleClickLogin = () => {
    router.push("/login");
  };
  const handleClickRegister = () => {
    router.push("/register");
  };
  return (
    <div className={styles.container}>
      <div className={styles.center}>
        <Image
          src="/images/test56.png"
          alt="Welcome"
          width={300}
          height={300}
          onClick={() => router.push("/")}
        />
      </div>
      <h1 className={styles.title}>
        <span className={styles.firstLetter}>A</span>stral<span className={styles.firstLetter}>A</span>ura.
      </h1>
      <p className={styles.slogan}> <i>Jouw pad naar spiritueel werk begint hier.</i></p>
      <Button  onClick={handleClickLogin}className={buttonStyles.buttonLogin}>LOGIN</Button>
      <Button  onClick={handleClickRegister} className={buttonStyles.buttonRegister}>REGISTREER HIER</Button>
      

    </div>
  );
};

export default Home;

