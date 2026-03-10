import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function MyPageRedirect() {

  const navigate = useNavigate();

  useEffect(() => {

    const role = localStorage.getItem("role");

    if (!role) {
      navigate("/auth");
      return;
    }

    const r = role.toLowerCase();

    if (r === "doctor") navigate("/doctor");
    else if (r === "patient") navigate("/patient");
    else if (r === "admin") navigate("/admin");
    else if (r === "pharmacy") navigate("/pharmacy");
    else if (r === "pathology") navigate("/pathology");
    else navigate("/");

  }, [navigate]);

  return null;
}

export default MyPageRedirect;