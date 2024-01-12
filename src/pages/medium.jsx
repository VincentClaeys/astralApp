import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../styles/Mediums.module.css';
import { useRouter } from "next/router";
import { useState } from "react";
import { useEffect } from "react";


export default function Medium() {
  const [mediums, setMediums] = useState([]);
  const [selectedMedium, setSelectedMedium] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    let headersList = {
      Accept: "*/*",
      "Content-Type": "application/json",
      Authorization: `JWT ${token}`,
    }

    let gqlBody = {
      query: `query MyQuery {
      users(mediumsStatus: "goedgekeurd") {
        id
        fullName
        email
      }
    }
    `,
      variables: {}
    }

    let bodyContent = JSON.stringify(gqlBody);

    fetch("https://astralaura.ddev.site/api", { 
      method: "POST",
      body: bodyContent,
      headers: headersList
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      setMediums(data.data.users);
     })
     
 }, []);

 const handleMediumClick = (medium) => {
     setSelectedMedium(medium);
 };

  const router = useRouter();
  const backHome = () => {
    router.push("/home");
  };
  
  return (
    <>
     <div className={styles.homeHeading}>
        <div className={styles.headingWelcome}>
          {/* <h1>Welkom,</h1>
  <h1>{user ? `${user.name}` : 'home'}</h1> */}
          <h1 className={styles.title}>
            <span className={styles.firstLetter}>M</span>EDIUMS.
          </h1>
          <p className={styles.sloganQuestion}>
            {" "}
            <i>Bekijk hier alle mediums</i>
          </p>
        </div>
        <button className={styles.buttonGrid} onClick={backHome}>
          <Image src="/images/back.png" alt="Logout" width={25} height={25} />
        </button>
        {/* <button className={styles.buttonGrid} onClick={handleLogout}>Uitloggen</button> */}
      </div>
      <div>
        <div className={styles.allMediumsContainer}>


      {mediums && mediums.map((medium) => (
        <div key={medium.id} className={styles.medium} onClick={() => handleMediumClick(medium)}>
          
          <Image src="/images/test56.png" alt="Logout" width={50} height={50} />
          <div className={styles.mediumInfo}>
   <h2 className={styles.mediumFullname}>{medium.fullName}</h2>
   <p className={styles.mediumsEmail}>{medium.email}</p>
 </div>
        </div>
      ))}
      
      {selectedMedium && <MediumDetails medium={selectedMedium} />}
    </div>
    </div>
    </>
  )
};
const MediumDetails = ({ medium }) => {
  return (
      <div>
          <h2>{medium.fullName}</h2>
          <h1>{medium.id}</h1>
      </div>
  );
};
