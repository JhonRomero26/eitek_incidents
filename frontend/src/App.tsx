import { Route, Switch } from "wouter";

// Paginas
import LoginPage from "@/app/pages/login";
import RegisterPage from "@/app/pages/register";

export function App() {
  return (
    <Switch>
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={RegisterPage} />
    </Switch>
  );
}

export default App;
