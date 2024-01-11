import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import styles from "../styles/Question.module.css";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [question, setQuestion] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    const userId = localStorage.getItem("userId");
    console.log("user", userId);

    if (!token) {
      router.push("/login");
    } else {
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
       }
     }`,
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
          console.log(data.data.user.id);
          setUser(data.data.user);
          let today = new Date();


        });
    }
  }, []);

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("jwt");
    const userId = localStorage.getItem("userId");
    const user = localStorage.getItem("user");

    let headersListQuestion = {
      Accept: "*/*",
      "Content-Type": "application/json",
      Authorization: `JWT ${token}`,
    };
    let today = new Date();
    console.log(today);

    let day = new Date();
let tomorrow = new Date(day);
tomorrow.setDate(day.getDate() + 1);

console.log(tomorrow);



  
    let gqlBody = {
      query: `mutation MyMutation($questionTask: String!,$questionDate: DateTime!,$expiryDate: DateTime!, $questionStatus: String!, $questionRegion: String!, $questionDescription: String!, $questionClient: String!, $authorId: ID!) {
        save_questions_questions_Entry(
          questionTask: $questionTask
          questionStatus: $questionStatus
          questionRegion: $questionRegion
          questionDescription: $questionDescription
          questionClient: $questionClient
          authorId: $authorId
          questionDate: $questionDate
          expiryDate: $expiryDate

        ) {
          id
        }
      }
      `,
      variables: {
        questionTask: question,
        questionStatus: "draft",
        questionRegion: location ,
        questionDescription: description,
        questionClient: user,
        authorId: userId,
        questionDate: today,
        expiryDate: tomorrow,
      },
     };
     

    let bodyContent = JSON.stringify(gqlBody);

    let response = await fetch("http://astralaura.ddev.site/api", {
      method: "POST",
      body: bodyContent,
      headers: headersListQuestion,
    });

    let data = await response.text();
    console.log(data);
  };

  const backHome = () => {
    router.push("/home");
  };
  return (
    <div>
      <div className={styles.homeHeading}>
        <div className={styles.headingWelcome}>
          <h1 className={styles.title}>
            <span className={styles.firstLetter}>V</span>RAAG!
          </h1>
          <p className={styles.sloganQuestion}>
            {" "}
            <i>en krijg eindelijk een antwoord.</i>
          </p>
        </div>
        <button className={styles.buttonGrid} onClick={backHome}>
          <Image src="/images/back.png" alt="Logout" width={25} height={25} />
        </button>
        {/* <button className={styles.buttonGrid} onClick={handleLogout}>Uitloggen</button> */}
      </div>
      <div className={styles.formContainer}>
        <h2 className={styles.startFormTitle}>Nieuwe vraag</h2>
        <div className={styles.inputContainer}>
          <form onSubmit={handleSubmit}>
            <h2 className={styles.questionTitle}>Stel je vraag</h2>
            <textarea
              className={styles.textareaQuestion}
              placeholder="stel hier je vraag"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            ></textarea>
            <h2 className={styles.descriptionTitle}>Geef extra informatie</h2>
            <textarea
              className={styles.textareaDescription}
              placeholder="geef extra informatie"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
            <h2 className={styles.locationTitle}>
              In welke regio bevindt u zich?{" "}
            </h2>
            <select
              value={location}
              className={styles.location}
              onChange={(e) => setLocation(e.target.value)}
            >
              <option value="Oost-vlaanderen">Oost-Vlaanderen</option>
              <option value="West-vlaanderen">West-vlaanderen</option>
              <option value="Antwerpen">Antwerpen</option>
              <option value="Brussel">Brussel</option>
            </select>

            <button className={styles.formButton} type="submit">
              Submit
            </button>
          </form>
        </div>
      </div>
      {/* <h2>Bestaande vragen</h2>
      {questions.map((questionObj, index) => {
        return (
          <div key={index}>
            {questionObj.questions &&
              questionObj.questions.map((q) => <p key={q.id}>{q.task}</p>)}
          </div>
        );
      })} */}
    </div>
  );
}
