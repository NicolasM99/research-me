import { Button, Col, Row, Spin } from "antd";
import React, { useEffect, useState } from "react";
import firebase from "firebase/app";
import { PATHS } from "../../routes/paths";
import { useHistory, withRouter } from "react-router";
import { Link } from "react-router-dom";

const Recommendations = () => {
  const [user, setUser] = useState("initial");
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    setUser(firebase.auth().currentUser);
  }, []);
  useEffect(() => {
    if (user) {
      setLoading(false);
    } else if (user !== "initial") {
      history.push(PATHS.LOGIN);
    }
  }, [user]);
  return (
    <>
      {loading ? (
        <Spin />
      ) : (
        <Row className="container-centered text-center">
          <Col>
            <h1>{user.displayName}, esto es lo que te recomendamos</h1>
            <p>Recomendaciones.</p>
            <Button type="primary">
              <Link to={PATHS.PROFILE}>Perfil</Link>
            </Button>
          </Col>
        </Row>
      )}
    </>
  );
};

export default withRouter(Recommendations);
