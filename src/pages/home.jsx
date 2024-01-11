import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import Image from "next/image";
export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [userOrMedium, setUserOrMedium] = useState(null);

  useEffect(() => {
    // Controleer of de gebruiker is ingelogd
    const token = localStorage.getItem("jwt");
    const userId = localStorage.getItem("userId");
    console.log("user", userId);
    if (!token) {
      router.push("/login");
    } else {
      // Haal de gebruikersgegevens op
      let headersList = {
        Accept: "*/*",
        "Content-Type": "application/json",
        Authorization: `JWT ${token}`,
      };

      let gqlBody = {
        query: `query {
 user(id: "${userId}") {
   id
   name
   email
   ...on User {
     mediumsStatus
   }
 }
}
`,
        variables: {},
      };

      let bodyContent = JSON.stringify(gqlBody);

      fetch("http://astralaura.ddev.site/api", {
        method: "POST",
        body: bodyContent,
        headers: headersList,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setUserOrMedium(data.data.user.mediumsStatus);
          setUser(data.data.user);
          localStorage.setItem("user", data.data.user.name);
        });
    }
  }, []);

  const handleLogout = () => {
    // Verwijder de JWT van de lokale opslag
    localStorage.removeItem("jwt");
    localStorage.removeItem("userId");
    localStorage.removeItem("user");
    localStorage.removeItem("userEmail");


    // Redirect de gebruiker naar de inlogpagina
    router.push("/login");
  };

  return (
    <div className={styles.homeContainer}>
      <div className={styles.homeHeading}>
        <div className={styles.headingWelcome}>
          {/* <h1>Welkom,</h1>
  <h1>{user ? `${user.name}` : 'home'}</h1> */}
          <h1 className={styles.title}>
            <span className={styles.firstLetter}>H</span>allo,
          </h1>
          <p className={styles.sloganLogin}>
            {" "}
            <i>{user ? `${user.name}` : "home"}</i>
          </p>
        </div>
        <button className={styles.buttonGrid} onClick={handleLogout}>
          <Image src="/images/logout.png" alt="Logout" width={25} height={25} />
        </button>
        {/* <button className={styles.buttonGrid} onClick={handleLogout}>Uitloggen</button> */}
      </div>

      <div className={styles.gridContainer}>
        {userOrMedium === null ? (
          <div className={styles.gridItemWide}>
            <Image
              src="/images/form.png"
              alt="Logout"
              width={110}
              height={110}
            />
            <div className={styles.questionTitle}>
              <Link href="/question">VRAAG!</Link>
              <div className={styles.questionText}>
                <Link href="/question">stel hier je vraag.</Link>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.gridItemWide}>
            <Image
              src="/images/form.png"
              alt="Logout"
              width={110}
              height={110}
            />
            <div className={styles.answerTitle}>
              <Link href="/answer">ANTWOORD</Link>
              <div className={styles.questionText}>
                <Link href="/answer">Zoek en help klanten.</Link>
              </div>
            </div>
          </div>
        )}

        <div className={styles.gridItem}>
          <Image src="/images/medium.png" alt="Logout" width={55} height={55} />
          <div className={styles.mediumsTitle}>
            <Link href="/medium">MEDIUMS.</Link>
          </div>
          <div className={styles.mediumsText}>
            <Link href="/medium">bekijk alle mediums.</Link>
          </div>
        </div>
        <div className={styles.gridItem}>
          <Image
            src="/images/account.png"
            alt="Logout"
            width={45}
            height={45}
          />
          <div className={styles.mediumsTitle}>
            <Link href="/account">ACCOUNT.</Link>
          </div>
          <div className={styles.mediumsText}>
            <Link href="/account">bekijk en wijzig je gegevens.</Link>
          </div>
        </div>
        {userOrMedium === null ? (
    <div className={styles.gridItemFull}>
    <div className={styles.historieTitle}>
      <Link href="/history">HISTORIE!</Link>
      <div className={styles.questionText}>
        <Link href="/history">stel hier je vraag.</Link>
      </div>
    </div>
    <Image
      src="/images/history.png"
      alt="Logout"
      width={70}
      height={70}
    />
  </div>
) : (
  <div className={styles.gridItemFullAssignments}>
  <div className={styles.assignmentsTitle}>
    <Link href="/assignments">OPDRACHTEN!</Link>
    <div className={styles.assignmentsText}>
      <Link href="/assignments">bekijk hier je actieve en verlopen opdrachten.</Link>
    </div>
  </div>
  <Image
    src="/images/history.png"
    alt="Logout"
    width={70}
    height={70}
  />
</div>
)}
    
      </div>
    </div>
  );
}
