import { Button, Card, Col, Row, Spin } from "antd";
import React, { useEffect, useState } from "react";
import firebase from "firebase/app";
import { PATHS } from "../../routes/paths";
import { useHistory, withRouter } from "react-router";
import { Link } from "react-router-dom";

const project = {
  title: "Title test",
  authors: ["Autor 1", "Autor 2"],
  topics: ["Tema 1, Tema 2, Tema 3"],
  downloadUrl: "#",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
};
const test = [
  project,
  project,
  project,
  project,
  project,
  project,
  project,
  project,
  project,
  project,
  project,
  project,
  project,
  project,
  project,
  project,
  project,
  project,
  project,
  project,
  project,
  project,
  project,
  project,
  project,
  project,
  project,
  project,
  project,
  project,
  project,
  project,
  project,
  project,
  project,
  project,
  project,
  project,
  project,
  project,
];

const Recommendations = () => {
  const [user, setUser] = useState("initial");
  const [loadingUser, setLoadingUser] = useState(true);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const [error, setError] = useState(false);
  const [recommendations, setRecommendations] = useState(null);
  const { Meta } = Card;
  useEffect(() => {
    setUser(firebase.auth().currentUser);
  }, []);
  useEffect(() => {
    if (user && user !== "initial") {
      setLoadingUser(false);
    } else if (user !== "initial" && !user) {
      history.push(PATHS.LOGIN);
    }
  }, [user]);
  const handleRecommendations = () => {
    setLoading(true);
    fetch("http://localhost:5000/recommend", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify([
        {
          query: "history",
          page: 1,
          pageSize: 50,
          terms: ["dog"],
        },
      ]),
    })
      .then((response) => {
        console.log("RESPEUSTA", response);
        response
          .json()
          .then((result) => {
            console.log("RESULTADO", result);
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
  };
  return (
    <>
      {loadingUser ? (
        <Spin />
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
              {test.map((item, index) => (
                <Col span={6} className="mb-4">
                  <Card
                    title={item.title}
                    extra={<a href={item.downloadUrl}>Descargar</a>}
                    style={{ width: 300, textAlign: "left" }}
                  >
                    <p>{item.description}</p>
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
