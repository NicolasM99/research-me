import { Col, Row } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import { PATHS } from "../routes/paths";

const NotFound = () => {
  return (
    <Row className="container-centered text-center">
      <Col>
        <h1>Error 404, página no encontrada</h1>
        <p>
          Esta dirección no existe.{" "}
          <Link to={PATHS.HOME}>Volver al inicio</Link>
        </p>
      </Col>
    </Row>
  );
};

export default NotFound;
