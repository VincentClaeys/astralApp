import { data } from "autoprefixer";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import styles from "../styles/History.module.css";
import Image from "next/image";

const Answer = ({ userId }) => {
  const [questions, setQuestions] = useState([]);
  const [expandedQuestionId, setExpandedQuestionId] = useState(null);
  const [questionMediumId, setQuestionMediumId] = useState(null);
  const [location, setLocation] = useState("");

  const [answerPrice, setAnswerPrice] = useState("");
  const [answerRegion, setAnswerRegion] = useState("");
  const [answersDescription, setAnswersDescription] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    const userId = localStorage.getItem("userId");
    let headersList = {
      Accept: "*/*",
      "Content-Type": "application/json",
      Authorization: `JWT ${token}`,
    };
    let gqlBody = {
      query: `query MyQuery2 {
        questionsEntries {
          ... on questions_questions_Entry {
            id
            questionTask
            questionStatus
            questionRegion
            questionId
            questionDescription
            questionDate
            questionClient
            questionCategorie {
              id
            }
            questionMediums {
              id
            }
          }
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
        setQuestions(data.data.questionsEntries);
      });
  }, []);
  useEffect(() => {
    if (expandedQuestionId !== null) {
      console.log("expandedQuestionId : ", expandedQuestionId);
      // Doe hier wat je wilt met de nieuwe waarde van expandedQuestionId
    }
  }, [expandedQuestionId]);
  let test = [];
  const handleClick = async (questionId) => {
    console.log("questionId", questionId);

    const token = localStorage.getItem("jwt");

    setExpandedQuestionId(questionId);

    let headersList = {
      Accept: "*/*",
      "Content-Type": "application/json",
      Authorization: `JWT ${token}`,
    };

    let gqlBodyIds = {
      query: `query MyQuery2 {
            questionsEntries(id: "${questionId}") {
              ... on questions_questions_Entry {
                id
                questionDescription
                questionMediums {
                  id
                }
                questionRegion
              }
            }
          }`,
      variables: {},
    };

    let bodyContentIds = JSON.stringify(gqlBodyIds);

    let responseIds = await fetch("http://astralaura.ddev.site/api", {
      method: "POST",
      body: bodyContentIds,
      headers: headersList,
    });

    let dataIds = await responseIds.json();
    console.log(dataIds);

    for (let medium of dataIds.data.questionsEntries[0].questionMediums) {
      console.log(medium.id);
      test = [...test, parseInt(medium.id)];
      console.log("test", test);
    }
  };

  let test2 = [];

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("jwt");
    const userId = localStorage.getItem("userId");
    const user = localStorage.getItem("user");
    const email = localStorage.getItem("userEmail");

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



    console.log(tomorrow)
    const answerPriceValue = answerPrice ? parseFloat(answerPrice) : null;
    if (answerPrice && isNaN(answerPriceValue)) {
      console.error("Invalid answerPrice value:", answerPrice);
      return; // Exit de functie als answerPrice geen geldige float is
    }

    const gqlBody = {
      query: `mutation MyMutation2($answerPrice: Number, $answerRegion: String, $answersDescription: String, $authorId: ID!,$answerQuestion: [Int] = ${expandedQuestionId}) {
          save_answers_Answers_Entry(
            answerPrice: $answerPrice
            answerRegion: $answerRegion
            answersDescription: $answersDescription
            authorId: $authorId
            answerStatus: "afgekeurd"
            answerMediumName : "${user}"
            answerQuestion: $answerQuestion
            answerEmail : "${email}"
  
            
          ) {
            id
            
          }
        }`,
      variables: {
        answerPrice: answerPriceValue,
        answerRegion: location,
        answersDescription: answersDescription,
        authorId: userId,
        // answerQuestion: expandedQuestionId,
      },
    };

    let bodyContent = JSON.stringify(gqlBody);

    let response = await fetch("http://astralaura.ddev.site/api", {
      method: "POST",
      body: bodyContent,
      headers: headersListQuestion,
    });

    let responseData = await response.json();
    let questionId; // Declare a variable to store the questionId

    if (
      responseData &&
      responseData.data &&
      responseData.data.save_answers_Answers_Entry
    ) {
      questionId = parseInt(responseData.data.save_answers_Answers_Entry.id); // Convert to integer
      if (isNaN(questionId)) {
        console.error(
          "Received non-integer questionId:",
          responseData.data.save_answers_Answers_Entry.id
        );
        return; // Exit the function if the questionId is not a valid integer
      }
      // rest van de code...
      console.log("questionId : ", questionId);
      let updatedQuestionMediumId = [...test, questionId];
      test2 = updatedQuestionMediumId;
      console.log("test2", test2);
      // console.log("questionMediumId", questionMediumId);
      // rest van de code...
    } else {
      console.log("Unexpected response structure:", responseData);
      return; // Exit the function if the questionId is not obtained
    }

    // tweede fetch

    if (!expandedQuestionId) {
      console.error("Geen vraag geselecteerd om bij te werken");
      return;
    }

    let headersListAnswer = {
      Accept: "*/*",
      "Content-Type": "application/json",
      Authorization: `JWT ${token}`,
    };
    let today2 = new Date();
    console.log(today);

    let day2 = new Date();
    let tomorrow2 = new Date(day2);
    tomorrow2.setDate(day2.getDate() + 1);

    console.log(tomorrow);
    let gqlBody2 = {
      query: `mutation MyMutation($id: ID!, $questionMediums: [Int]!) {
          save_questions_questions_Entry(
            questionMediums: $questionMediums
            id: $id 
          ) {
            id
          }
        }`,
      variables: {
        id: expandedQuestionId,
        questionMediums: test2,
      },
    };

    let bodyContent2 = JSON.stringify(gqlBody2);

    let response2 = await fetch("http://astralaura.ddev.site/api", {
      method: "POST",
      body: bodyContent2,
      headers: headersListAnswer,
    });

    let data2 = await response2.text();
    console.log(data2);
  };

  const router = useRouter();
  const backHome = () => {
    router.push("/home");
  };

  return (
    <div>
     <div className={styles.homeHeadingAnswer}>
       <div className={styles.headingWelcome}>
         <h1 className={styles.titleAnswer}>
           <span className={styles.firstLetter}>A</span>NTWOORD!
         </h1>
         <p className={styles.sloganQuestion}>
           {" "}
           <i>bekijk hier je gestelde vragen.</i>
         </p>
       </div>
       <button className={styles.buttonGrid} onClick={backHome}>
         <Image src="/images/back.png" alt="Logout" width={25} height={25} />
       </button>
     </div>
     <div>
     <div className={styles.allMediumsContainer}>


       {questions.map((question) => (
         <div  className={styles.mediumBlock} key={question.id} onClick={() => handleClick(question.id)}>
             <div className={styles.mediumInfo}>

         
           <h2 className={styles.mediumTask}>{question.questionTask}</h2>
           <h1 className={styles.mediumQuestionClient}>naam : {question.questionClient}</h1>
           <p className={styles.mediumAnswerStatus}>Regio: {question.questionRegion}</p>
           </div>

           {expandedQuestionId === question.id && (
             <div className={styles.modal}>
               <div className={styles.modalContent}>
                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    value={answerPrice}
                    onChange={(e) => setAnswerPrice(e.target.value)}
                    placeholder="Prijs"
                  />

                  <textarea
                    value={answersDescription}
                    onChange={(e) => setAnswersDescription(e.target.value)}
                    placeholder="Beschrijving"
                  />
                  <select
                    value={location}
                    className={styles.location}
                    onChange={(e) => setLocation(e.target.value)}
                  >
                    <option value="Oost-vlaanderen">Oost-Vlaanderen</option>
                    <option value="West-vlaanderen">West-Vlaanderen</option>
                    <option value="Antwerpen">Antwerpen</option>
                    <option value="Brussel">Brussel</option>
                  </select>
                  <button type="submit">Verstuur</button>
                </form>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedQuestionId(null);
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
       {questions.length === 0 && <p>Geen vragen gevonden</p>}
     </div>
   </div>
  );
};

export default Answer;
