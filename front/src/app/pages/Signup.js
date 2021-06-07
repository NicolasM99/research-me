import React, { useState, useEffect } from "react";
import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import firebase from "firebase/app";
import {
  Form,
  Input,
  Row,
  Col,
  Checkbox,
  Button,
  Spin,
  Alert,
  Modal,
} from "antd";
import { Link, useHistory, withRouter } from "react-router-dom";
import { PATHS } from "../routes/paths";
import background from "../assets/styles/images/login_background.png";
import { firestore } from "../firebase/Firebase";

const Signup = () => {
  firebase.auth().languageCode = "es";
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [signupError, setSignupError] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [topics, setTopics] = useState([]);
  const history = useHistory();
  useEffect(() => {
    firestore
      .collection("topics")
      .get()
      .then((querySnapshot) => {
        var t = [];
        querySnapshot.forEach((doc) => t.push(doc.data()));
        setTopics(t);
        setLoading(false);
      })
      .catch((err) => setLoading(false));
  }, []);
  const onFinish = (values) => {
    setLoading(true);
    firebase
      .auth()
      .createUserWithEmailAndPassword(values.email, values.password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        const topic_labels = values.topics.map((topic) => topic.name);
        console.log(user);
        user
          .updateProfile({
            displayName: values.username,
          })
          .then(() => {
            firestore
              .collection("users")
              .doc(user.uid)
              .set({
                name: user.displayName,
                id: user.uid,
                topics: values.topics,
                topic_labels: topic_labels,
                projects: [],
                newTopics: [],
                page: 0,
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

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <Row
      className="container-centered p-4 signup"
      style={{ backgroundImage: `url(${background})` }}
    >
      <Col>
        <h3 className="text-center">¡Registrate!</h3>
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
              style={{
                borderRadius: "25px",
                fontSize: "2rem",
              }}
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
              style={{
                borderRadius: "25px",
                fontSize: "2rem",
              }}
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
              style={{
                borderRadius: "25px",
                fontSize: "2rem",
              }}
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
              style={{
                borderRadius: "25px",
                fontSize: "2rem",
              }}
              placeholder="Confirmar contraseña"
              prefix={<LockOutlined className="site-form-item-icon" />}
            />
          </Form.Item>
          <div className="text-center">
            <Button onClick={showModal} disabled={loading} type="primary">
              Escoger temas de interes
            </Button>
          </div>
          <Modal
            title="Temas de interes"
            visible={isModalVisible}
            cancelButtonProps={{ hidden: true }}
            onOk={handleOk}
            onCancel={handleCancel}
            closable={false}
            okText="Cerrar"
            cancelText="a"
          >
            <Form.Item
              rules={[
                {
                  required: true,
                  message: "Selecciona al menos 1",
                },
              ]}
              name="topics"
            >
              <Checkbox.Group>
                <Row>
                  {topics.map((topic, index) => (
                    <Col key={index}>
                      <Checkbox value={topic} style={{ lineHeight: "32px" }}>
                        {topic.name}
                      </Checkbox>
                    </Col>
                  ))}
                </Row>
              </Checkbox.Group>
            </Form.Item>
          </Modal>

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
            <Checkbox
              style={{ color: "black", fontSize: "1rem", fontWeight: "inital" }}
            >
              Acepto los{" "}
              <Link style={{ color: "#2F4F75", fontWeight: "normal" }} to="">
                Términos y Condiciones
              </Link>
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
              ¿Ya tienes cuenta?{" "}
              <Link
                style={{
                  color: "#2F4F75",
                  fontWeight: "normal",
                  paddingLeft: "1rem",
                }}
                to={PATHS.LOGIN}
              >
                Iniciar sesión
              </Link>
            </p>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

export default withRouter(Signup);
