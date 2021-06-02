import { Button, Col, Row, Spin } from "antd";
import React, { useEffect, useState } from "react";
import background from "../assets/styles/images/home_background.png"
import { Link } from "react-router-dom";
import { PATHS } from "../routes/paths";

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const fetchRecommendations = () => {
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
          pageSize: 100,
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
    <Row className="m-0 p-0 container-centered home" style={{backgroundImage:`url(${background})`}}>
      <Col className="p-0 m-0">
        {error && <h1>Ha ocurrido un error en el sistema</h1>}
        <h1>RESEARCH<br/>ME</h1>
        <p>¡Encontrar proyectos de interés<br/>nunca fue tan fácil!</p>
        <Button type="primary mb-3">
          <Link to={PATHS.SIGNUP}>Comenzar ahora</Link>
        </Button>
        <Button>
          <Link to={PATHS.LOGIN}>Iniciar sesión</Link>
        </Button>
      </Col>
    </Row>
  );
};

export default Home;
