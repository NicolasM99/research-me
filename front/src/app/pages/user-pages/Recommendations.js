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
  const [reloadUser, setReloadUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const [error, setError] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const { Meta } = Card;
  useEffect(() => {
    setUser(firebase.auth().currentUser);
  }, []);
  useEffect(() => {
    if (
      (user && user !== "initial" && recommendations.length === 0) ||
      reloadUser
    ) {
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
  }, [user, reloadUser]);
  const handleRecommendations = (userData) => {
    console.log(userData);
    setLoading(true);
    if (userData.projects.length > 0 && userData.newTopics.length === 0) {
      fetch(
        "https://core.ac.uk:443/api-v2/articles/get?apiKey=lM7wbmhGjeWX6zJ09poHxd2tusCLVvRn&fulltext=false&urls=true",
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(userData.projects),
        }
      )
        .then((response) => {
          response
            .json()
            .then((res) => {
              // console.log(res);
              const newProjectsPetition = res.map((i) => i.data);
              setRecommendations(newProjectsPetition);
              setLoading(false);
            })
            .catch((error) => {
              console.log("ERROR DE RESULTADO", error);
              setError(true);
              setLoading(false);
            });
        })
        .catch((error) => {
          console.log("ERROR DE RESULTADO", error);
          setError(true);
          setLoading(false);
        });
    } else if (userData.projects.length > 0 && userData.newTopics.length > 0) {
      console.log(userData.newTopics);
      const newRecommendationsReq = userData.newTopics.map((i, index) => ({
        query: i,
        page: 1,
        pageSize: 10,
      }));
      console.log(newRecommendationsReq);
      fetch(
        "https://core.ac.uk:443/api-v2/search?apiKey=lM7wbmhGjeWX6zJ09poHxd2tusCLVvRn&fulltext=false&urls=true",
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(newRecommendationsReq),
        }
      )
        .then((response) => {
          response
            .json()
            .then((res) => {
              console.log(res);
              const newProjectsPetitionIDS = res
                .map((i) => i.data.map((d) => d._id))[0]
                .concat(userData.projects);
              console.log(newProjectsPetitionIDS);
              // const newProjectsPetitionIDS = res
              //   .map((i) => i.data[0]._id)
              //   .concat(userData.projects);
              firestore
                .collection("users")
                .doc(user.uid)
                .update({
                  newTopics: [],
                  projects: newProjectsPetitionIDS,
                })
                .then(() => {
                  setReloadUser(true);
                  setRecommendations([]);
                });
            })
            .catch((error) => {
              console.log("ERROR DE RESULTADO", error);
              setError(true);
              setLoading(false);
            });
        })
        .catch((error) => {
          console.log("ERROR DE RESULTADO", error);
          setError(true);
          setLoading(false);
        });
    } else {
      const topicsReq = userData.topics;
      firestore
        .collection("users")
        .doc(user.uid)
        .update({
          newTopics: [],
          // page: userData.page,
        })
        .then(() => {
          fetch("http://localhost:5000/recommend", {
            method: "POST",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify([
              {
                topics: topicsReq,
                page: userData.page + 1,
              },
            ]),
          })
            .then((response) => {
              // console.log("RESPEUSTA", response);
              response
                .json()
                .then((res) => {
                  console.log("RESULTADO", res.result);
                  console.log("IDS", res.projects_id);
                  const newProjects = res.projects_id.concat(userData.projects);
                  firestore
                    .collection("users")
                    .doc(user.uid)
                    .update({
                      projects: newProjects,
                    })
                    .then(() => {
                      setRecommendations(res.result);
                      setLoading(false);
                    });
                  // fetch(
                  //   "https://core.ac.uk:443/api-v2/articles/get?apiKey=lM7wbmhGjeWX6zJ09poHxd2tusCLVvRn&fulltext=false&urls=true",
                  //   {
                  //     method: "POST",
                  //     headers: {
                  //       "Content-type": "application/json",
                  //     },
                  //     body: JSON.stringify(newProjects),
                  //   }
                  // ).then((response) => {
                  //   response.json().then((res) => {
                  //     console.log(res);
                  //     const newProjectsPetition = res.map((i) => i.data);
                  //     console.log("NEW PROJECTS PETITION", newProjectsPetition);
                  //     firestore
                  //       .collection("users")
                  //       .doc(user.uid)
                  //       .update({
                  //         projects: newProjects,
                  //       })
                  //       .then(() => {
                  //         setLoading(false);
                  //       });
                  //   });
                  // });
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
        topic_labels: newTopics.concat(userData.topic_labels),
      })
      .then(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    console.log("ENTRÓ A USE EFFECT DE NEW TOPICS", newTopics);
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
              {recommendations.map(
                (item, index) =>
                  item.topics &&
                  item.topics.length > 0 &&
                  item.title &&
                  item.fulltextUrls &&
                  item.description && (
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
                            {item.topics.map((topic, index) => (
                              <Tag key={index} color="white">
                                {topic}
                              </Tag>
                            ))}
                          </>
                        }
                        extra={
                          item.fulltextUrls && (
                            <a
                              onClick={() => {
                                setNewTopics(item.topics);
                              }}
                              href={item.fulltextUrls[0]}
                              target="_blank"
                              rel="noreferrer"
                            >
                              Ver más
                            </a>
                          )
                        }
                        style={{ textAlign: "left" }}
                      >
                        <p
                          className={
                            selected === index ? "expanded" : "contracted"
                          }
                        >
                          {item.description}
                        </p>
                        <Meta
                          description={`${item.authors?.map(
                            (author) => ` ${author}`
                          )}`}
                        />
                      </Card>
                    </Col>
                  )
              )}
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
