import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkSignup } from "../../redux/session";
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastname] = useState('')
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setErrors({
        confirmPassword:
          "Confirm Password field must be the same as the Password field",
      });
    }

    const serverResponse = await dispatch(
      thunkSignup({
        first_name: firstName,
        last_name: lastName,
        image_url: 'https://example.com/images/darkphantom92.jpg',
        email,
        username,
        password,
      })
    );

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      closeModal();
    }
  };

  return (
    <div className="sign-up">
      <h1>Sign Up</h1>
      {errors.server && <p>{errors.server}</p>}
      <form style={{}} onSubmit={handleSubmit}>
        <div className="field-together">
          <section className="signup-field glow-on-hover-signup">
              <label>
                First Name
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </label>
              {errors.firstName && <p>{errors.firstName}</p>}
            </section>
            <section className="signup-field glow-on-hover-signup">
              <label>
                Last Name
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastname(e.target.value)}
                  required
                />
              </label>
              {errors.lastName && <p>{errors.lastName}</p>}
            </section>
          </div>
        <section className="signup-field glow-on-hover-signup">
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
        <section className="signup-field glow-on-hover-signup">
          <label>
            Username
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>
          {errors.username && <p>{errors.username}</p>}
        </section>
        <div className="field-together">
          <section className="signup-field glow-on-hover-signup">
            <label>
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
          <section className="signup-field glow-on-hover-signup">
            <label>
              Confirm Password
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                />
            </label>
            {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
            </section>
          </div>
        <button style={{width:'100%', border: 'solid 1px rgba(255, 255, 255, 0.118)'}} className="glow-on-hover" type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default SignupFormModal;
