import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Home from './pages/home/home';
import CodeRoom from "./pages/codeRoom/codeRoom";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/:id" component={CodeRoom} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;