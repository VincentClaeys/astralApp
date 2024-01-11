import React from "react";
import Image from "next/image";
import Button from "../components/button";
import { useRouter } from "next/router";
import styles from "../styles/Login.module.css";
import Link from "next/link";
import { useState } from 'react';

const Register = () => {

    const router = useRouter();

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username , setUsername] = useState('');
 
     
    async function registerUser(email, password, fullName, username) {
      const response = await fetch('http://astralaura.ddev.site/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation RegisterUser($email: String!, $password: String!, $username: String!, $fullName: String!) {
              registerUsers(
                email: $email
                password: $password
                username: $username 
                fullName: $fullName
              ) {
                jwt
                user {
                  id
                }
              }
            }
          `,
          variables: {
            email: email,
            password: password,
            username: username,
            fullName: fullName,
          },
        }),
      });
    
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    
      const data = await response.json();
      console.log('data', data);
    
      if (!data.data || !data.data.registerUsers || !data.data.registerUsers.jwt) {
        throw new Error("Registration failed");
      }
    
      localStorage.setItem('jwt', data.data.registerUsers.jwt);
      localStorage.setItem('userId', data.data.registerUsers.user.id);
      router.push('/home');
    }
    
    const handleSubmit = async (event) => {
      event.preventDefault();
      try {
        await registerUser(email, password, fullName, username);
        console.log('user registered');
      } catch (error) {
        console.log('error', error);
      }
    };
    
    
  return (
    <div className={styles.loginContainer}>
      <div className={styles.imageRegister}>
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
      <p className={styles.sloganRegister}>
        {" "}
        <i>Maak een nieuw account!</i>
      </p>
      <p className={styles.textRegister}>
        {" "}
        <span className={styles.firstLetter}>Registreer hier</span>{" "}
        <i>om verder te gaan.</i>
      </p>
      <form className={styles.form}onSubmit={handleSubmit}>
      
      <input
        type="text"
        id="username"
        name="username"
        className={styles.inputUsername}
        onChange={(e) => setUsername(e.target.value)} 
        placeholder="Gebruikersnaam"
      />
      <input
        type="text"
        id="fullName"
        name="fullName"
        className={styles.inputEmail}
        onChange={(e) => setFullName(e.target.value)} 
        placeholder="Volledige naam"
      />
      <input
      type="email"
      id="email"
        name="email"
        className={styles.inputEmail}
        onChange={(e) => setEmail(e.target.value)} 
        placeholder="Email"
      />
      <input
        type="password"
        id="password"
        name="password"
        className={styles.inputPassword}
        onChange={(e) => setPassword(e.target.value)} 
        placeholder="Wachtwoord"
      />
           <p className={styles.textRegisterAsMedium}>
        <i>
Registreren als medium?<Link href="/registermedium"> Dat kan hier!</Link>
        </i>
      </p>

      <Button className={styles.buttonLogin}>REGISTREER</Button>
      </form>
      <p className={styles.textRegisterHere}>
        <i>
          Al een account? <Link href="/login">Login hier!</Link>
        </i>
      </p>
      
    </div>
  );
};

export default Register;
