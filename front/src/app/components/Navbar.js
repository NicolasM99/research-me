import React, { Component } from "react";
import { Menu } from "antd";
import { HomeOutlined, LoginOutlined, FormOutlined } from "@ant-design/icons";
import { Link, withRouter } from "react-router-dom";
import { PATHS } from "../routes/paths";

const { SubMenu } = Menu;

class Navbar extends Component {
  state = {
    current: this.props.location.pathname.substring(
      1,
      this.props.location.pathname.length
    ),
  };
  handleClick = (e) => {
    console.log(this.props.location.search);
    this.setState({ current: e.key });
  };

  render() {
    const { current } = this.state;
    return (
      <Menu
        className="fixed-top"
        onClick={this.handleClick}
        selectedKeys={[current]}
        mode="horizontal"
      >
        <Menu.Item key="home" icon={<HomeOutlined />}>
          <Link to={PATHS.HOME}>Inicio</Link>
        </Menu.Item>
        <Menu.Item key="login" icon={<LoginOutlined />}>
          <Link to={PATHS.LOGIN}>Iniciar sesion</Link>
        </Menu.Item>
        <Menu.Item key="signup" icon={<FormOutlined />}>
          <Link to={PATHS.SIGNUP}>Registrarse</Link>
        </Menu.Item>
      </Menu>
    );
  }
}

export default withRouter(Navbar);
