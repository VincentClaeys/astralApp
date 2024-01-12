import React from "react";
import Image from "next/image";
import Button from "../components/Button";
import { useRouter } from "next/router";
import styles from "../styles/Login.module.css";
import Link from "next/link";
import { useState } from 'react';
import {checkIfLoggedIn} from '../utils/Validate';
import { useEffect } from 'react';

const Login = () => {

    const router = useRouter();



    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    async function loginUser(email, password) {
      const response = await fetch('https://astralaura.ddev.site/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation Authenticate($email: String!, $password: String!) {
              authenticate(email: $email, password: $password) {
                jwt
                jwtExpiresAt
                refreshToken
                refreshTokenExpiresAt
                user {
                  id
                  fullName
                  email
                  ... on User {
                    mediumsStatus
                  }
                }
              }
            }
          `,
          variables: {
            email: email,
            password: password,
          },
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
       }
       
    
       const data = await response.json();
       console.log('data', data);
       console.log("data.data.authenticate.user.mediumsStatus", data.data.authenticate.user.mediumsStatus);
       if (!data.data || !data.data.authenticate || !data.data.authenticate.jwt) {
        throw new Error("Authentication failed");
        
       }
  

            if (data.data.authenticate.user.mediumsStatus === "afgekeurd") {
      alert("Je bent nog niet goedgekeurd door de admin, probeer het later nog eens");
     } else if (data.data.authenticate.user.mediumsStatus === "goedgekeurd") {
      localStorage.setItem('jwt', data.data.authenticate.jwt);
      localStorage.setItem('userId', data.data.authenticate.user.id);
      localStorage.setItem('userEmail', data.data.authenticate.user.email);
    
      router.push('/home');
     }else {
      localStorage.setItem('jwt', data.data.authenticate.jwt);
      localStorage.setItem('userId', data.data.authenticate.user.id);
      localStorage.setItem('userEmail', data.data.authenticate.user.email);
    
      router.push('/home');
     }
    
     }


   
    const handleSubmit = async (event) => {
      event.preventDefault();
      try {
        await loginUser(email, password);
     console.log('logged in');
      } catch (error) {
    console.log('error', error)
      }
    };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.image}>
        {" "}
        <Image
          src="/images/test56.png"
          alt="Welcome"
          width={100}
          height={100}
          onClick={() => router.push("/")}
        />
      </div>

      <h1 className={styles.title}>
        <span className={styles.firstLetter}>H</span>allo,
      </h1>
      <p className={styles.sloganLogin}>
        {" "}
        <i>Welkom terug!</i>
      </p>
      <p className={styles.textLogin}>
        {" "}
        <span className={styles.firstLetter}>Login</span>{" "}
        <i>om verder te gaan.</i>
      </p>
      <form className={styles.form}onSubmit={handleSubmit}>

      <input
        type="email"
        value={email}
        id="username"
        name="username"
        className={styles.inputUsername}
        placeholder="Username"
        onChange={(e) => setEmail(e.target.value)} 
        required
      />
      <input
        type="password"
        value={password}
        id="password"
        name="password"
        className={styles.inputPassword}
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)} 
        required
      />

      <Button type="submit" className={styles.buttonLogin}>LOGIN</Button>
      </form>
      <p className={styles.textRegisterHere}>
        <i>
          Nog geen account? <Link href="/register">Registreer hier!</Link>
        </i>
      </p>
    </div>
  );
};

export default Login;
