import { useState } from "react";
import { thunkLogin } from "../../redux/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const serverResponse = await dispatch(
      thunkLogin({
        email,
        password,
      })
    );

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      closeModal();
    }
  };

  const handleDemo = async (e) => {
    e.preventDefault();

    const serverResponse = await dispatch(
      thunkLogin({ email: "demo@aa.io", password: "password" }))

      if (serverResponse) {
        setErrors(serverResponse);
      } else {
        closeModal()
      }
      closeModal()
    }

  return (
    <div className="log-in">
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        <section className="login-field glow-on-hover-login">
        <label>
          Email
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        {errors.email && <p>{errors.email}</p>}
      </section>
      <section className="login-field glow-on-hover-login">
        <label >
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.password && <p>{errors.password}</p>}
        </section>
        <button style={{width:'100%', border: 'solid 1px rgba(255, 255, 255, 0.118)'}} className="glow-on-hover" type="submit">Log In</button>
        <p style={{textAlign: 'center' ,margin: '0, auto', color: 'rgba(255, 255, 255, 0.451'}}>or</p>
      <button style={{width:'90%', marginLeft: '17px', border: 'solid 1px rgba(255, 255, 255, 0.118)'}} className="glow-on-hover" onClick={handleDemo}>Demo Login</button>
      </form>
    </div>
  );
}

export default LoginFormModal;
