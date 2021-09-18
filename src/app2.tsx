import { HashRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import { Header } from "./components/header";
import { Page } from "./components/page";
import { Donate } from "./pages/donate";
import { Learn } from "./pages/learn";
import { Play } from "./pages/play";
import { Select } from "./pages/select";

export const App: React.FC = () => {
  return <Router>
    <Header/>
    <Page>
      <Switch>
        <Route exact path="/learn" component={Learn}/>
        <Route exact path="/play" component={Select}/>
        <Route path="/play/:side/vs/:opponentKind" component={Play}/>
        <Route exact path="/donate" component={Donate}/>
        <Route path="*">
          <Redirect to="/play"/>
        </Route>
      </Switch>
    </Page>
  </Router>;
};
