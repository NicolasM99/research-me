import React, { useState, useEffect } from "react";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { Form, Input, Button, Col, Row, Alert, Spin } from "antd";
import { Link, withRouter, useHistory } from "react-router-dom";
import { PATHS } from "../routes/paths";
import firebase from "firebase/app";
import background from "../assets/styles/images/login_background.png";

const Login = (props) => {
  const [loading, setLoading] = useState(false);
  const [signupError, setSignupError] = useState(null);
  firebase.auth().languageCode = "es";
  const history = useHistory();
  const onFinish = (values) => {
    setLoading(true);
    firebase
      .auth()
      .signInWithEmailAndPassword(values.email, values.password)
      .then((userCredential) => {
        const user = userCredential.user;
        if (user.emailVerified) {
          setLoading(false);
          history.push(PATHS.PROFILE);
        } else {
          firebase
            .auth()
            .signOut()
            .then(() => {
              setLoading(false);
              setSignupError(
                "Este correo no se ha verificado, por favor revisa tu bandeja de entrada y verificalo para continuar."
              );
            })
            .catch(() => {
              setSignupError(
                "Ha ocurrido un error en el sistema, por favor intenta de nuevo más tarde."
              );
              setLoading(false);
            });
        }
      })
      .catch((error) => {
        console.error("ERROR AL REGISTRARSE", error);
        switch (error.code) {
          case "auth/invalid-email":
            setSignupError("La dirección de correo es inválida");
            break;
          case "auth/user-not-found":
            setSignupError("Correo o contraseña incorrectos");
            break;
          default:
            setSignupError("La dirección de correo es inválida");
            break;
        }
        setLoading(false);
      });
  };

  return (
    <Row className="container-centered login" style={{ backgroundImage: `url(${background})` }}>
      <Col style={{ maxWidth: "375px" }}>
        <h3 className="text-center">Iniciar sesión</h3>
        <Form name="normal_login" className="login-form" onFinish={onFinish}>
          {signupError && <Alert message={signupError} type="error" />}

          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: "Por favor ingresa tu correo",
              },
            ]}
          >
            <Input
              prefix={<MailOutlined className="site-form-item-icon" />}
              placeholder="Correo"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Por favor ingresa tu contraseña",
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Contraseña"
            />
          </Form.Item>
          <Form.Item className="text-center">
            <Button
              disabled={loading}
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              Continuar
            </Button>
            <br />
            {loading && <Spin />}
            <br />
            <p>
              ¿No tienes cuenta?{" "}
              <Link to={PATHS.SIGNUP}>Registrarse ahora</Link>
            </p>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};
export default withRouter(Login);
