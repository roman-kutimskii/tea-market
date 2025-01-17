import "./App.css";
import Alert from "@mui/material/Alert";
import Container from "@mui/material/Container";

function App() {
  return (
    <Container fixed>
      <Alert severity="warning">Это учебный проект. Пожалуйста, не совершайте на нём никаких действий.</Alert>
    </Container>
  );
}

export default App;
