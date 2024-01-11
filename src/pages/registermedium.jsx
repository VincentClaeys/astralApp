import React from "react";
import Image from "next/image";
import Button from "../components/Button";
import { useRouter } from "next/router";
import styles from "../styles/Login.module.css";
import Link from "next/link";
import { useState } from "react";

const RegisterMediums = () => {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [fileData, setFileData] = useState("");
  const [fileDataId , setFileDataId] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");


  async function registerUser(email, password, fullName, username) {
    const response = await fetch("http://astralaura.ddev.site/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: `
            mutation RegisterUser($email: String!, $password: String!, $username: String!, $fullName: String!) {
              registerMediums(
                email: $email
                password: $password
                username: $username 
                fullName: $fullName
                mediumsStatus: "afgekeurd"
                photoMedium: ${fileDataId}
              ) {
                jwt
                user {
                  id
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
          username: username,
          fullName: fullName,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("data", data);

    if (
      !data.data ||
      !data.data.registerMediums ||
      !data.data.registerMediums.jwt
    ) {
      throw new Error("Registration failed");
    }
    if (data.data.registerMediums.user.mediumsStatus === "afgekeurd") {
      alert("Je bent nog niet goedgekeurd door de admin, probeer het later nog eens");
     } else if (data.data.registerMediums.user.mediumsStatus === "goedgekeurd") {
      localStorage.setItem('jwt', data.data.registerMediums.jwt);
      localStorage.setItem('userId', data.data.registerMediums.user.id);
    
      router.push('/home');
     }else {
      localStorage.setItem('jwt', data.data.registerMediums.jwt);
      localStorage.setItem('userId', data.data.registerMediums.user.id);
    
      router.push('/home');
     }
    
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
   
    reader.onloadend = function() {
      console.log('Bestandsinhoud: ', reader.result);
      setFileData(reader.result);
      
     console.log(fileData);
    }
   
    reader.readAsDataURL(file);
   };
   React.useEffect(() => {
    console.log(fileData);
   }, [fileData]);
   
   
  const handleSubmitCertificate = async (event) => {

 

    let headersList = {
      Accept: "*/*",
      "Content-Type": "application/json",
    };

    let gqlBody = {
      query: `mutation MyMutation($filename: String = "", $title: String = "", $fileData: String = "") {
        save_localImages_Asset(
          _file: {filename: $filename, fileData: $fileData}
          title: $title
        ) {
          id
          title
        }
      }`,
      variables: {
        "filename":"certficaat.png",
        "fileData":fileData,
        "title":"certificaat"
      },
    };

    
    

    let bodyContentIds = JSON.stringify(gqlBody);

    let responseIds = await fetch("http://astralaura.ddev.site/api", {
      method: "POST",
      body: bodyContentIds,
      headers: headersList,
    });

    let dataIds = await responseIds.json();
    setFileDataId(dataIds.data.save_localImages_Asset.id);
    setUploadStatus("Succesvol geüpload");

  }
  React.useEffect(() => {
    console.log(fileDataId);
   }, [fileDataId]);
   
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await registerUser(email, password, fullName, username);
      console.log("user registered");
    } catch (error) {
      console.log("error", error);
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
        <i>Maak een nieuw account als medium!</i>
      </p>
      <p className={styles.textRegisterMediums}>Magische krachten? </p>
      <p className={styles.textRegister}>
        <i>Registreer je hier om als</i>
        <span className={styles.firstLetter}> medium</span>{" "}
        <i>om verder te gaan.</i>
      </p>
      <p className={styles.textRegisterCertificate}>
        <i>LET OP:</i>
        <span className={styles.firstLetter}> OFFICIEEL MEDIUMCERTIFICAAT</span>{" "}
        <i> nodig te registreren.</i>
      </p>
      <div className={styles.certificateContainer}>

      <input className={styles.inputCertificate} type="file" onChange={handleFileChange} />
      <button className={styles.buttonUpload} type="submit" onClick={handleSubmitCertificate}>UPLOAD CERTIFICAAT</button>
      {uploadStatus && <p  className={styles.textSuccess}>{uploadStatus}</p>}
      </div>
      <p className={styles.textRegisterCertificate}>
        <i>Vul nu verder jouw </i>
        <span className={styles.firstLetter}> gegevens</span>{" "}
        <i> aan.</i>
      </p>
      <form className={styles.form} onSubmit={handleSubmit}>
     
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

export default RegisterMediums;
