import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/logo.svg";
import api from "../../services/api";
import { notifyError } from "../../utils/notifications";
import { getItem, setItem } from "../../utils/storage";
import "./styles.css";

function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const token = getItem("token");
    if (token) navigate("/main");
  }, [navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password)
      return notifyError("Todos os campos são obrigatórios.");

    try {
      const response = await api.post("/login", { email, senha: password });
      const { usuarioLogado, token } = response.data;

      setItem("token", token);
      setItem("userId", usuarioLogado.id);
      setItem("userName", usuarioLogado.nome);
      navigate("/main");
    } catch (error) {
      notifyError(
        error.response?.data?.mensagem || "Ocorreu um erro ao fazer login."
      );
    }
  }

  return (
    <div className="container-sign-in">
      <img src={Logo} alt="Logo" className="logo" />

      <div className="content-sign-in">
        <div className="left">
          <h1>
            Controle suas <span>finanças</span>, sem planilha chata.
          </h1>
          <h3>
            Organizar as suas finanças nunca foi tão fácil, com o DINDIN, você
            tem tudo num único lugar e em um clique de distância.
          </h3>
          <button
            className="btn-purple btn-big"
            onClick={() => navigate("/sign-up")}
          >
            Cadastre-se
          </button>
        </div>
        <div className="right">
          <form onSubmit={handleSubmit}>
            <h2>Login</h2>
            <div className="container-inputs">
              <label htmlFor="email">E-mail</label>
              <input
                type="text"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="container-inputs">
              <label htmlFor="password">Senha</label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button className="btn-purple btn-big">Entrar</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
