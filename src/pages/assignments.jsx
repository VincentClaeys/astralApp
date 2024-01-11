import React from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "../styles/Mediums.module.css";
import { useRouter } from "next/router";
import { useState } from "react";
import { useEffect } from "react";

export default function Assignments() {
  const [answers, setAnswers] = useState([]);
  const [selectedMedium, setSelectedMedium] = useState(null);

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
            answersEntries(authorId: "${userId}") {
              ... on answers_Answers_Entry {
                id
                answersDescription
                answerStatus
                answerPrice
                answerMediumName
                answerRegion
                answerQuestion {
                  id
                  ... on questions_questions_Entry {
                    id
                    questionTask
                    questionStatus
                    questionRegion
                    questionId
                    questionDescription
                    questionDate
                    questionClient
                 
                  }
                }
                answerPrice
                answerMediumName
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
        setAnswers(data.data.answersEntries);
      });
  }, []);

  const handleMediumClick = (answer) => {
    // Check if answerQuestion is an array and has at least one element
    if (
      Array.isArray(answer.answerQuestion) &&
      answer.answerQuestion.length > 0
    ) {
      setSelectedMedium({
        answer: answer,
        question: answer.answerQuestion[0],
      });
    } else {
      // Handle the case where answerQuestion is not as expected
      console.error("answerQuestion is not an array or is empty", answer);
    }
  };

  const router = useRouter();
  const backHome = () => {
    router.push("/home");
  };

  return (
    <>
      <div className={styles.homeHeading}>
        <div className={styles.headingWelcome}>
          <h1 className={styles.titleAssignments}>
            <span className={styles.firstLetter}>O</span>PDRACHTEN.
          </h1>
          <p className={styles.sloganQuestion}>
            {" "}
            <i>Bekijk hier je actieve en verlopen opdrachten. </i>
          </p>
        </div>
        <button className={styles.buttonGrid} onClick={backHome}>
          <Image src="/images/back.png" alt="Logout" width={25} height={25} />
        </button>
      </div>
      <div>
        <div className={styles.allMediumsContainer}>
          {answers.map((answer) => (
            <div
              key={answer.id}
              className={styles.mediumBlock}
              onClick={() => handleMediumClick(answer)}
            >
              <div className={styles.mediumInfo}>
                <h2 className={styles.mediumTask}>
                  {answer.answerQuestion?.[0]?.questionTask}
                </h2>
                {/* <p className={styles.mediumEmail}>€{answer.answerPrice}</p> */}

                <p className={styles.mediumQuestionClient}>
                  <span className={styles.mediumQuestionClientText}>
                    vraag gesteld door :{" "}
                  </span>
                  {answer.answerQuestion?.[0]?.questionClient}
                </p>
                <p className={styles.mediumAnswerStatus}>
                status : u vraag is (nog)
          <span
            className={`${styles.statusIndicator} ${
              answer.answerStatus === "goedgekeurd"
                ? styles.statusApproved
                : answer.answerStatus === "afgekeurd"
                ? styles.statusRejected
                : ""
            }`}
          ></span>
          <span
            className={`${styles.statusText} ${
              answer.answerStatus === "goedgekeurd"
                ? styles.statusApproved
                : answer.answerStatus === "afgekeurd"
                ? styles.statusRejected
                : ""
            }`}
          >
        {answer.answerStatus}
          </span>
        </p>
              </div>
            </div>
          ))}

          {selectedMedium && (
            <MediumDetails
              medium={selectedMedium.answer}
              question={selectedMedium.question}
              onClose={() => setSelectedMedium(null)}
            />
          )}
        </div>
      </div>
    </>
  );
}
const MediumDetails = ({ medium, question, onClose }) => {
    return (
     <div className={styles.modal}>
       <div className={styles.modalContent}>
         <span className={styles.closeButton} onClick={onClose}>&times;</span>
         <h2 className={styles.modalTitle}>{question.questionTask}</h2>
         <p className={styles.modalAnswer}>extra omschrijving bij de vraag</p>
         <p className={styles.modalQuestion}>{question.questionDescription}</p>
         <p className={styles.modalAnswer}>Omschrijving antwoord</p>
         <h2 className={styles.modalQuestion}>{medium.answersDescription}</h2>

         <p className={styles.modalAnswer}>Vastgestelde prijs</p>
         <p className={styles.modalQuestion}>€{medium.answerPrice}</p>
         {/* ... (rest van de antwoorddetails) */}
       </div>
     </div>
    );
   };
