import { data } from "autoprefixer";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import styles from "../styles/History.module.css";
import Image from "next/image";

const History = ({ userId }) => {
  const [questions, setQuestions] = useState([]);
  const [expandedAnswerId, setExpandedAnswerId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    const userId = localStorage.getItem("userId");

    let headersList = {
      Accept: "*/*",
      "Content-Type": "application/json",
      Authorization: `JWT ${token}`,
    };
    let gqlBody = {
      query: `query MyQuery {
    questionsEntries(authorId: "${userId}") {
      ... on questions_questions_Entry {
        id
        questionTask
        authorId
        
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
        Promise.all(
          data.data.questionsEntries.map(async (question) => {
            let headersList = {
              Accept: "*/*",
              "Content-Type": "application/json",
              Authorization: `JWT ${token}`,
            };

            let gqlBody = {
              query: `query MyQuery2 {
                questionsEntries(id: "${question.id}") {
                 ... on questions_questions_Entry {
                   id
                   questionClient
                   questionDescription
                   questionDate
                   questionId
                   questionRegion
                   questionMediums {
                     ... on answers_Answers_Entry {
                       id
                       answersDescription
                       answerStatus
                       answerRegion
                       answerMediumName
                       answerPrice
                       answerEmail
                     }
                   }
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

            let data = await response.json();
            console.log(data);

            // Add the loaded answers to the question
            question.questionMediums =
              data.data.questionsEntries[0].questionMediums;

            return question;
          })
        ).then((loadedQuestions) => {
          setQuestions(loadedQuestions);
        });
      });
  }, []);

  const handleAnswerClick = (answerId) => {
    setExpandedAnswerId(answerId);
  };

  const handleAcceptMedium = async (answerId) => {
    console.log(answerId);

    const user = localStorage.getItem("user");

    const token = localStorage.getItem("jwt");

    let headersList = {
      Accept: "*/*",
      "Content-Type": "application/json",
      Authorization: `JWT ${token}`,
    };

    let gqlBody = {
      query: `mutation MyMutation {
    save_answers_Answers_Entry(id: ${answerId}, answerStatus: "goedgekeurd") {
      id
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
    window.location.reload();
  };

  const handleRefuseMedium = async (answerId) => {
    console.log(answerId);
    console.log(answerId);

    const user = localStorage.getItem("user");

    const token = localStorage.getItem("jwt");

    let headersList = {
      Accept: "*/*",
      "Content-Type": "application/json",
      Authorization: `JWT ${token}`,
    };

    let gqlBody = {
      query: `mutation MyMutation {
    save_answers_Answers_Entry(id: ${answerId}, answerStatus: "afgekeurd") {
      id
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
    window.location.reload();
  };

  const router = useRouter();
  const backHome = () => {
    router.push("/home");
  };

  return (
    <div className={styles.accountContainer}>
      <div className={styles.homeHeading}>
        <div className={styles.headingWelcome}>
          <h1 className={styles.title}>
            <span className={styles.firstLetter}>H</span>ISTORIE!
          </h1>
          <p className={styles.sloganQuestion}>
            {" "}
            <i>bekijk hier je gestelde vragen.</i>
          </p>
        </div>
        <button className={styles.buttonGrid} onClick={backHome}>
          <Image src="/images/back.png" alt="Logout" width={25} height={25} />
        </button>
        {/* <button className={styles.buttonGrid} onClick={handleLogout}>Uitloggen</button> */}
      </div>
      <div>
        {questions.map((question) => (
          <div key={question.id}>
            <h2>{question.questionTask}</h2>

            {question.questionMediums &&
              question.questionMediums.map((medium, index) => (
                <div key={index}>
                  <p>Medium Name: {medium.answerMediumName}</p>
                  <p>Description: {medium.answersDescription}</p>
                  <button onClick={() => handleAnswerClick(medium.id)}>
                    zie meer
                  </button>
                  {expandedAnswerId === medium.id && (
                    <div className={styles.modal}>
                      <div className={styles.modalContent}>
                        <p>ID: {medium.id}</p>
                        <p>Status: {medium.answerStatus}</p>
                        <p>Description: {medium.answersDescription}</p>
                        <p>Price: €{medium.answerPrice}</p>

                        {medium.answerStatus === "goedgekeurd" && (
                          <>
                            <h1>Contactgegevens</h1>
                            <p>Email: {medium.answerEmail}</p>
                            <p>Region: {medium.answerRegion}</p>
                          </>
                        )}
                        <button onClick={() => handleAcceptMedium(medium.id)}>
                          ACCEPTEER
                        </button>
                        <button onClick={() => handleRefuseMedium(medium.id)}>
                          VERWIJDER
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedAnswerId(null);
                          }}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
        ))}

        {questions.length === 0 && <p>Geen vragen gevonden</p>}
      </div>
    </div>
  );
};

export default History;
