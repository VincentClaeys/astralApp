import React from 'react'
import Link from 'next/link'
import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import styles from "../styles/Account.module.css";

export default function Account() {
  const router = useRouter();

    const [name, setName] = useState("");
  

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        const user = localStorage.getItem("user");
    console.log("user", user);
        const token = localStorage.getItem("jwt");
        console.log("token", token)
      
        let headersList = {
          Accept: "*/*",
          "Content-Type": "application/json",
          Authorization: `JWT ${token}`,
        };
      
        let gqlBody = {
          query: `mutation MyMutation {
            updateViewer(username: "${name}") {
              id
              ... on User {
                id
                email
                username
              }
            }
          }`,
          variables: {},
        };
      
        let bodyContent = JSON.stringify(gqlBody);
      
        let response = await fetch("http://astralaura.ddev.site/api", {
          method: "POST",
          body: bodyContent,
          headers: headersList,
        });
      
        let data = await response.text();
        console.log(data);
      };
      
      const backHome = () => {
        router.push("/home");
      };
      
  return (
    <div className={styles.accountContainer}>
          <div className={styles.homeHeading}>
        <div className={styles.headingWelcome}>
          {/* <h1>Welkom,</h1>
  <h1>{user ? `${user.name}` : 'home'}</h1> */}
          <h1 className={styles.title}>
            <span className={styles.firstLetter}>A</span>CCOUNT!
          </h1>
          <p className={styles.sloganQuestion}>
            {" "}
            <i>Bekijk en wijzig je gegevens</i>
          </p>
        </div>
        
        <button className={styles.buttonGrid} onClick={backHome}>
          <Image src="/images/back.png" alt="Logout" width={25} height={25} />
        </button>
        {/* <button className={styles.buttonGrid} onClick={handleLogout}>Uitloggen</button> */}
      </div>
   <div className={styles.updateProfileContainer}>
   <h2 className={styles.startFormTitleAccount}>Accountgegevens</h2>

   <h2 className={styles.accountnameTitle}><i>naam</i></h2>
   <input  className={styles.accountnameChangeTitle} type="text"  placeholder="verander je naam"
          value={name}
          onChange={(e) => setName(e.target.value)} />

    <button className={styles.accountButton} onClick={handleUpdateUser}>Update Accountgegevens</button>
   </div>
   

    </div>
  )
}
