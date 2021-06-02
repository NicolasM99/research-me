import { Button, Col, Row, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PATHS } from "../routes/paths";

const Home = () => {
  return (
    <Row className="text-center container-centered">
      <Col>
        <h1>Research me</h1>
        <p>Encontrar proyectos de interés nunca fue tan fácil</p>
        <Button type="primary mb-3">
          <Link to={PATHS.SIGNUP}>Comenzar ahora</Link>
        </Button>
        <br />
        <Button>
          <Link to={PATHS.LOGIN}>Iniciar sesión</Link>
        </Button>
      </Col>
    </Row>
  );
};

export default Home;
