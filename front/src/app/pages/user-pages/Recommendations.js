import { Button, Card, Col, Row, Spin, Tag } from "antd";
import React, { useEffect, useState } from "react";
import firebase from "firebase/app";
import { PATHS } from "../../routes/paths";
import { useHistory, withRouter } from "react-router";
import { Link } from "react-router-dom";
import { firestore } from "../../firebase/Firebase";

const Recommendations = () => {
  const [user, setUser] = useState("initial");
  const [userData, setUserData] = useState("initial");
  const [newTopics, setNewTopics] = useState([]);
  const [selected, setSelected] = useState(-1);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const [error, setError] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const { Meta } = Card;
  useEffect(() => {
    setUser(firebase.auth().currentUser);
  }, []);
  useEffect(() => {
    if (user && user !== "initial") {
      firestore
        .collection("users")
        .doc(user.uid)
        .get()
        .then((res) => {
          const data = res.data();
          setUserData(data);
          handleRecommendations(data);
          setLoadingUser(false);
        })
        .catch((error) => console.log(error));
    } else if (user !== "initial" && !user) {
      history.push(PATHS.LOGIN);
    }
  }, [user]);
  const handleRecommendations = (userData) => {
    console.log(userData);
    setLoading(true);
    if (userData.projects.length > 0 && userData.newTopics.length === 0) {
      setRecommendations(userData.projects);
      setLoading(false);
    } else {
      // const newTopicsReq = userData.newTopics.concat(userData.topics);
      fetch("http://localhost:5000/recommend", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify([
          {
            topics: userData.newTopics,
          },
        ]),
      })
        .then((response) => {
          console.log("RESPEUSTA", response);
          response
            .json()
            .then((res) => {
              console.log("RESULTADO", res.result);
              setRecommendations(res.result);
              const newProjects = res.result.concat(userData.projects);
              firestore
                .collection("users")
                .doc(user.uid)
                .update({
                  projects: newProjects,
                  newTopics: [],
                })
                .then(() => {
                  setLoading(false);
                });
            })
            .catch((error) => {
              console.log("ERROR DE RESULTADO", error);
              setError(true);
              setLoading(false);
            })
            .then(() => setLoading(false));
        })
        .catch((err) => {
          setError(true);
          setLoading(false);
          console.error("ERROR DE RESPUESTA", err);
        });
    }
  };
  const updateTopic = () => {
    console.log("NEW TOPICS", newTopics);
    firestore
      .collection("users")
      .doc(user.uid)
      .update({
        newTopics: newTopics,
      })
      .then(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    if (newTopics.length > 0) {
      updateTopic();
    }
  }, [newTopics]);
  return (
    <>
      {loadingUser || loading || recommendations.length === 0 ? (
        <Row className="container-centered text-center">
          <Col>
            <h3>Estamos generando nuevo contenido para ti...</h3>
            <Spin />
          </Col>
        </Row>
      ) : (
        <Row className="container-centered text-center">
          <Col>
            <br />
            <br />
            <Button>
              <Link to={PATHS.PROFILE}>Perfil</Link>
            </Button>
            <br />
            <br />
            {error && <h1>Ha ocurrido un error en el sistema</h1>}
            <h1>{user.displayName}, esto es lo que te recomendamos</h1>
            <Row className="p-5">
              {recommendations.map((item, index) => (
                <Col key={index} className="mb-4 p-1">
                  <Card
                    onClick={() => {
                      if (selected === index) {
                        setSelected(-1);
                      } else {
                        setSelected(index);
                      }
                    }}
                    hoverable
                    title={
                      <>
                        <p>{item.title}</p>
                        {item.related_topics.map((topic, index) => (
                          <Tag key={index} color="white">
                            {topic}
                          </Tag>
                        ))}
                      </>
                    }
                    extra={
                      <a
                        onClick={() => {
                          var auxTopics = newTopics;
                          item.related_topics.forEach((topic) => {
                            const newTopicAux = {
                              id: item.topic_id,
                              related_topics: [topic],
                            };
                            auxTopics.push(newTopicAux);
                            // if (!userData.topics.includes(newTopicAux)) {
                            //   if (auxTopics.length > 0) {
                            //     if (!newTopics.includes(newTopicAux)) {
                            //       auxTopics.push({
                            //         id: topic,
                            //         related_topics: [topic],
                            //       });
                            //     }
                            //   } else {
                            //     auxTopics.push({
                            //       id: topic,
                            //       related_topics: [topic],
                            //     });
                            //   }
                            // }
                          });
                          console.log("AUX TOPICS", auxTopics);
                          if (auxTopics.length > 0) {
                            setNewTopics(auxTopics);
                          }
                        }}
                        href={item.fulltextUrls[0]}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Ver más
                      </a>
                    }
                    style={{ textAlign: "left" }}
                  >
                    <p
                      className={selected === index ? "expanded" : "contracted"}
                    >
                      {item.description}
                    </p>
                    <Meta
                      description={`${item.authors.map(
                        (author) => ` ${author}`
                      )}`}
                    />
                  </Card>
                </Col>
              ))}
            </Row>
            {loading && (
              <>
                <br />
                <br />
                <Spin />
              </>
            )}
          </Col>
        </Row>
      )}
    </>
  );
};

export default withRouter(Recommendations);
