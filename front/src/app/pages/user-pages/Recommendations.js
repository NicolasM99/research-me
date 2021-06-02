import { Button, Col, Row, Spin } from "antd";
import React, { useEffect, useState } from "react";
import firebase from "firebase/app";
import { PATHS } from "../../routes/paths";
import { useHistory, withRouter } from "react-router";
import { Link } from "react-router-dom";

const Recommendations = () => {
  const [user, setUser] = useState("initial");
  const [loadingUser, setLoadingUser] = useState(true);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const [error, setError] = useState(false);
  const [recommendations, setRecommendations] = useState(null);

  useEffect(() => {
    setUser(firebase.auth().currentUser);
  }, []);
  useEffect(() => {
    if (user) {
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
            {error && <h1>Ha ocurrido un error en el sistema</h1>}
            <h1>{user.displayName}, esto es lo que te recomendamos</h1>
            <Button
              disabled={loading}
              type="primary"
              onClick={() => handleRecommendations()}
            >
              Generar recomendaciones
            </Button>

            {loading && (
              <>
                <br />
                <br />
                <Spin />
              </>
            )}
            <br />
            <br />
            <Button>
              <Link to={PATHS.PROFILE}>Perfil</Link>
            </Button>
          </Col>
        </Row>
      )}
    </>
  );
};

export default withRouter(Recommendations);
