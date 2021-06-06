import { Button, Col, Row, Spin, Tag } from "antd";
import React, { useEffect, useState } from "react";
import firebase from "firebase/app";
import { PATHS } from "../../routes/paths";
import { useHistory, withRouter } from "react-router";
import { Link } from "react-router-dom";
import { firestore } from "../../firebase/Firebase";

const Profile = () => {
  const [user, setUser] = useState("initial");
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  useEffect(() => {
    setUser(firebase.auth().currentUser);
  }, []);

  useEffect(() => {
    if (user && user !== "initial") {
      firestore
        .collection("users")
        .doc(user.uid)
        .get()
        .then((res) => {
          const data = res.data();
          setLoading(false);
          setTopics(data.topics);
        })
        .catch((error) => console.log(error));
    } else if (user !== "initial" && !user) {
      history.push(PATHS.LOGIN);
    }
  }, [user]);
  useEffect(() => {
    console.log(topics);
  }, [topics]);
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
      {loading || user === "initial" || topics.length === 0 ? (
        <Row className="container-centered text-center">
          <Col>
            <Spin />
          </Col>
        </Row>
      ) : (
        user && (
          <Row className="container-centered text-center">
            <Col>
              <h1>Hola de nuevo {user.displayName}...</h1>
              <p>Estas son las etiquetas que te interesan</p>
              {topics.map((topic) => (
                <Tag color="white">{topic.name}</Tag>
              ))}
              <br />
              <br />
              <Button type="primary">
                <Link to={PATHS.RECOMMENDATIONS}>Recomendaciones</Link>
              </Button>
              <br />
              <br />
              <Button onClick={() => handleSignOut()}>Cerrar sesión</Button>
            </Col>
          </Row>
        )
      )}
    </>
  );
};

export default withRouter(Profile);
