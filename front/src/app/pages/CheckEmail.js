import { Button, Col, Row } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import { PATHS } from "../routes/paths";

const CheckEmail = () => {
  return (
    <Row className="container-centered text-center">
      <Col>
        <h1>Verifica tu correo electrónico</h1>
        <p>Por favor, revisa tu bandeja de entrada para continuar.</p>
        <Button type="primary">
          <Link to={PATHS.LOGIN}>Iniciar sesión</Link>
        </Button>
      </Col>
    </Row>
  );
};

export default CheckEmail;
