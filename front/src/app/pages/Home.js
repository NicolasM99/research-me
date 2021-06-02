import { Button, Col, Row, Spin } from "antd";
import React, { useEffect, useState } from "react";
import background from "../assets/styles/images/home_background.png";
import { Link } from "react-router-dom";
import { PATHS } from "../routes/paths";

const Home = () => {
  return (
    <Row
      className="m-0 p-0 container-centered home"
      style={{ backgroundImage: `url(${background})` }}
    >
      <Col className="p-0 m-0">
        <h1>
          RESEARCH
          <br />
          ME
        </h1>
        <p>
          ¡Encontrar proyectos de interés
          <br />
          nunca fue tan fácil!
        </p>
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
