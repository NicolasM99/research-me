import { Button, Col, Row, Spin } from "antd";
import React, { useEffect, useState } from "react";
import firebase from "firebase/app";
import { PATHS } from "../../routes/paths";
import { useHistory, withRouter } from "react-router";
import { Link } from "react-router-dom";

const Profile = () => {
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
  const handleSignOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        history.push(PATHS.HOME);
      })
      .catch((error) => console.log(error));
  };
  return (
    <>
      {loading ? (
        <Spin />
      ) : (
        <Row className="container-centered text-center">
          <Col>
            <h1>Hola de nuevo {user.displayName}</h1>
            <p>Estas son las etiquetas que te interesan.</p>
            <p>PRUEBA</p>
            <Button type="primary">
              <Link to={PATHS.RECOMMENDATIONS}>Recomendaciones</Link>
            </Button>
            <br />
            <br />
            <Button onClick={() => handleSignOut()}>Cerrar sesión</Button>
          </Col>
        </Row>
      )}
    </>
  );
};

export default withRouter(Profile);
