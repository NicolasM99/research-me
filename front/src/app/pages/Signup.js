import React, { useState, useEffect } from "react";
import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import firebase from "firebase/app";
import { Form, Input, Row, Col, Checkbox, Button, Spin, Alert } from "antd";
import { Link, useHistory, withRouter } from "react-router-dom";
import { PATHS } from "../routes/paths";

const topics = [
  {
    value: "animals",
    label: "Animales",
  },
  {
    value: "music",
    label: "Música",
  },
  {
    value: "science",
    label: "Ciencia",
  },
  {
    value: "history",
    label: "Historia",
  },
  {
    value: "physics",
    label: "Física",
  },
  {
    value: "chemistry",
    label: "Química",
  },
];

const Signup = () => {
  firebase.auth().languageCode = "es";
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [signupError, setSignupError] = useState(null);
  const history = useHistory();
  const onFinish = (values) => {
    setLoading(true);
    firebase
      .auth()
      .createUserWithEmailAndPassword(values.email, values.password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        console.log(user);
        user
          .updateProfile({
            displayName: values.username,
          })
          .then(() => {
            user
              .sendEmailVerification()
              .then(() => {
                setSignupError(null);
                history.push(PATHS.CHECK_EMAIL);
              })
              .catch((error) => {
                setLoading(false);
                console.error("ERROR AL REGISTRARSE", error);

                setSignupError(error.message);
              });
          })
          .catch((error) => {
            setLoading(false);
            console.error("ERROR AL REGISTRARSE", error);

            setSignupError(error.message);
          });
      })
      .catch((error) => {
        setLoading(false);
        console.error("ERROR AL REGISTRARSE", error);
        switch (error.code) {
          case "auth/email-already-in-use":
            setSignupError("Ya existe una cuenta con este correo");
            break;
          default:
            setSignupError(error.message);
            break;
        }
      });
  };

  return (
    <Row className="container-centered p-4">
      <Col style={{ maxWidth: "375px" }}>
        <h3 className="text-center">Registrarse</h3>
        <Form
          form={form}
          name="register"
          onFinish={onFinish}
          scrollToFirstError
        >
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: "Por favor ingresa tu nombre de usuario",
              },
            ]}
          >
            <Input
              onChange={() => setSignupError(null)}
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Nombre de usuario"
            />
          </Form.Item>
          {signupError && <Alert message={signupError} type="error" />}

          <Form.Item
            name="email"
            rules={[
              {
                type: "email",
                message: "El correo no es válido",
              },
              {
                required: true,
                message: "Por favor ingresa tu correo",
              },
            ]}
          >
            <Input
              onChange={() => setSignupError(null)}
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
              {
                min: 8,
                message: "Mínimo 8 caracteres",
              },
            ]}
            hasFeedback
          >
            <Input.Password
              placeholder="Contraseña"
              prefix={<LockOutlined className="site-form-item-icon" />}
            />
          </Form.Item>

          <Form.Item
            name="password2"
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Por favor ingresa de nuevo tu contraseña",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }

                  return Promise.reject(
                    new Error("Las contraseñas deben coincidir")
                  );
                },
              }),
            ]}
          >
            <Input.Password
              placeholder="Confirmar contraseña"
              prefix={<LockOutlined className="site-form-item-icon" />}
            />
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
                message: "Selecciona al menos 1",
              },
            ]}
            name="checkbox-group"
            label="Temas de interés"
          >
            <Checkbox.Group>
              <Row>
                {topics.map((topic, index) => (
                  <Col key={index} span={12}>
                    <Checkbox
                      value={topic.value}
                      style={{ lineHeight: "32px" }}
                    >
                      {topic.label}
                    </Checkbox>
                  </Col>
                ))}
              </Row>
            </Checkbox.Group>
          </Form.Item>
          <Form.Item
            name="agreement"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error(
                          "Debes aceptar los Términos y condiciones para continuar"
                        )
                      ),
              },
            ]}
          >
            <Checkbox>
              Acepto los <Link to="">Términos y Condiciones</Link>
            </Checkbox>
          </Form.Item>
          <Form.Item className="text-center">
            <Button disabled={loading} type="primary" htmlType="submit">
              Continuar
            </Button>

            <br />
            {loading && <Spin />}
            <br />
            <p>
              ¿Ya tienes cuenta? <Link to={PATHS.LOGIN}>Iniciar sesión</Link>
            </p>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

export default withRouter(Signup);
