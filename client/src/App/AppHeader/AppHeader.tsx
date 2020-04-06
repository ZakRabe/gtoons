import React from "react";
import { Header, Divider } from "semantic-ui-react";
import { AppHeaderProps } from "./types";
import AppMenu from "../AppMenu";

const AppHeader: React.FunctionComponent<AppHeaderProps> = (props) => {
  const goto = (path: string) => {
    return () => {
      const { history } = props;
      history.push(path);
    };
  };
  const renderAppHeader = () => {
    return (
      <header>
        <Header as='h2' onClick={goto("/")} style={{ cursor: "pointer" }}>
          gToons Revived
        </Header>
        <Divider />
        <AppMenu />
      </header>
    );
  };

  return renderAppHeader();
};

export default AppHeader;
