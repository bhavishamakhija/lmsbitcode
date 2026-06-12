import React, { useState } from 'react';
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./firebase";
import "./App.css";

function App() {
  const [formType, setFormType] = useState('login');

  // Login states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotPassword, setForgotPassword] = useState(false);
const [forgotStep, setForgotStep] = useState(1);
const [showSuccessCard, setShowSuccessCard] = useState(false);
const [forgotPhone, setForgotPhone] = useState("");
const [otp, setOtp] = useState("");
const [newPassword, setNewPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [passwordError, setPasswordError] = useState("");
  // ========== STUDENT DETAILS (from UI) ==========
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [course, setCourse] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");

  // ========== ACADEMIC QUALIFICATIONS (from UI) ==========
  const [collegeName, setCollegeName] = useState("");
  const [degree, setDegree] = useState("");
  const [passingYear, setPassingYear] = useState("");

  // ========== PARENT/GUARDIAN DETAILS (from UI) ==========
  const [pFirstName, setPFirstName] = useState("");
  const [pMiddleName, setPMiddleName] = useState("");
  const [pLastName, setPLastName] = useState("");
  const [pEmail, setPEmail] = useState("");
  const [pPhone, setPPhone] = useState("");
  const [pOccupation, setPOccupation] = useState("");

  // Login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      alert("Login Successful!");
      console.log(userCredential.user);
    } catch (error) {
      alert(error.message);
      console.error(error);
    }
  };

  // Generate Student ID
  const generateStudentId = () => {
    return `BCL${Date.now().toString().slice(-6)}`;
  };

  // Generate random password
  const generatePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#";
    let password = "";
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  // Helper validation function for names
  const isValidNameLength = (name, fieldLabel, isOptional = false) => {
    const trimmed = name.trim();
    if (isOptional && trimmed.length === 0) return true; 
    return trimmed.length >= 2 && trimmed.length <= 20;
  };

  // Registration handler - saves ALL UI fields
  const handleRegister = async (e) => {
    e.preventDefault();

    // 1. Validation for required basic fields
    if (!firstName || !lastName || !regEmail || !phone || !course || !gender || !dob || !address || !pFirstName || !pLastName || !collegeName || !degree || !passingYear || !pOccupation) {
      alert("Please fill all required fields!");
      return;
    }

    // 2. Name Length Validations (Min 2, Max 20 characters)
    if (!isValidNameLength(firstName, "Student First Name")) {
      alert("⚠️ Student First Name must be between 2 and 20 characters.");
      return;
    }
    if (!isValidNameLength(middleName, "Student Middle Name", true)) {
      alert("⚠️ Student Middle Name must be between 2 and 20 characters if provided.");
      return;
    }
    if (!isValidNameLength(lastName, "Student Last Name")) {
      alert("⚠️ Student Last Name must be between 2 and 20 characters.");
      return;
    }
    if (!isValidNameLength(pFirstName, "Parent First Name")) {
      alert("⚠️ Parent First Name must be between 2 and 20 characters.");
      return;
    }
    if (!isValidNameLength(pMiddleName, "Parent Middle Name", true)) {
      alert("⚠️ Parent Middle Name must be between 2 and 20 characters if provided.");
      return;
    }
    if (!isValidNameLength(pLastName, "Parent Last Name")) {
      alert("⚠️ Parent Last Name must be between 2 and 20 characters.");
      return;
    }

    // 3. Strict Passing Year Validation (Must be exactly a 4-digit number)
    if (passingYear.length !== 4) {
      alert("⚠️ Passing Year must be a valid 4-digit year (e.g., 2025).");
      return;
    }

    // 4. Parent Occupation Length Validation (Min 2, Max 30 characters)
    const trimmedOccupation = pOccupation.trim();
    if (trimmedOccupation.length < 2 || trimmedOccupation.length > 30) {
      alert("⚠️ Parent Occupation must be between 2 and 30 characters.");
      return;
    }

    try {
     const studentId = generateStudentId();

const admissionDate = new Date();

      // Save EVERYTHING to pending_registrations
      await addDoc(collection(db, "pending_registrations"), {
        // ===== STUDENT DETAILS =====
        s_id: studentId,
        F_name: firstName.trim(),        
        M_name: middleName.trim(),
        L_name: lastName.trim(),
        email: regEmail,
        phone: phone,
        course: course,
        gender: gender,
        dob: dob,
        address: address,
        
        // ===== ACADEMIC QUALIFICATIONS =====
        college_name: collegeName.trim(),
        degree_pursued: degree.trim(),
        passing_year: passingYear,
        
        // ===== PARENT/GUARDIAN DETAILS =====
        parent_f_name: pFirstName.trim(),
        parent_m_name: pMiddleName.trim(),
        parent_l_name: pLastName.trim(),
        parent_email: pEmail,
        parent_phone: pPhone,
        parent_occupation: trimmedOccupation,
        
        // ===== SYSTEM FIELDS =====
        
        role: "student",
        admission_date: admissionDate,
        status: "pending",
        submittedAt: serverTimestamp()
      });

    setShowSuccessCard(true);

      // Clear ALL form fields
      setFirstName("");
      setMiddleName("");
      setLastName("");
      setRegEmail("");
      setPhone("");
      setCourse("");
      setGender("");
      setDob("");
      setAddress("");
      setCollegeName("");
      setDegree("");
      setPassingYear("");
      setPFirstName("");
      setPMiddleName("");
      setPLastName("");
      setPEmail("");
      setPPhone("");
      setPOccupation("");

    } catch (error) {
      console.error("Registration error:", error);
      alert("❌ Error: " + error.message);
    }
  };

  return (
    <div className="page">

      {/* Left Sidebar */}
      <div className="sidebar-partition">
        <div className="bg-shape shape-1"></div>
        <div className="bg-shape shape-2"></div>
        <div className="bg-shape shape-3"></div>

        <div className="sidebar-branding-wrap">
          <div className="logo-massive">
            <img src="/logo.png" alt="BitCodeLabs Logo" />
          </div>
          <h1 className="brand-title-royal">BitCodeLabs</h1>
        </div>

        <div className="tab-switcher-container">
          <button
            className={`tab-toggle-btn ${formType === "login" ? "active-tab" : ""}`}
            onClick={() => setFormType("login")}
          >
            LOGIN
          </button>
          <button
            className={`tab-toggle-btn ${formType === "register" ? "active-tab" : ""}`}
            onClick={() => setFormType("register")}
          >
            SIGN IN
          </button>
        </div>
      </div>

      {/* Right Content */}
      <div className="main-form-content">

        {/* LOGIN PANEL */}
        <div className={`form-view-panel ${formType === "login" ? "active" : "inactive"}`}>

  {!forgotPassword ? (

    <>
      <div className="card-header">
        <h1 className="form-view-title">LOGIN</h1>
        <p className="subtitle">
          Welcome back! Please enter credentials to access your account.
        </p>
      </div>

      <form onSubmit={handleLogin} className="minimalist-form-layout">

        <div className="form-group-line">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group-line">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="action-footer-row">
          <p
            className="forgot"
            style={{ cursor: "pointer" }}
            onClick={() => {
              setForgotPassword(true);
              setForgotStep(1);
            }}
          >
            Forgot Password?
          </p>

          <button type="submit" className="form-submit-btn">
            LOGIN
          </button>
        </div>
      </form>
    </>

  ) : (

    <div className="minimalist-form-layout">

      {forgotStep === 1 && (
        <>
          <h2>Forgot Password</h2>

          <input
            type="tel"
            placeholder="Registered Mobile Number"
            value={forgotPhone}
            maxLength={10}
            onChange={(e) =>
              setForgotPhone(e.target.value.replace(/\D/g, ""))
            }
          />

          <button
            type="button"
            className="form-submit-btn"
            onClick={() => {
              if (forgotPhone.length !== 10) {
                alert("Enter valid 10 digit phone number");
                return;
              }
              setForgotStep(2);
            }}
          >
            Send OTP
          </button>
        </>
      )}

      {forgotStep === 2 && (
        <>
          <h2>Verify OTP</h2>

          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            maxLength={6}
            onChange={(e) =>
              setOtp(e.target.value.replace(/\D/g, ""))
            }
          />

          <button
            type="button"
            className="form-submit-btn"
            onClick={() => {
              if (otp.length !== 6) {
                alert("OTP must be 6 digits");
                return;
              }

              setForgotStep(3);
            }}
          >
            Verify OTP
          </button>
        </>
      )}

      {forgotStep === 3 && (
        <>
          <h2>Create New Password</h2>

          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
            {passwordError && (
  <p className="error-message">
    {passwordError}
  </p>
)}
          <button
            type="button"
            className="form-submit-btn"
            onClick={() => {
             const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

if (!passwordRegex.test(newPassword)) {
  setPasswordError(
  "Password must be 8-20 characters and contain: 1 uppercase, 1 lowercase, 1 number and 1 special character."
);
return;
  return;
}

if (newPassword !== confirmPassword) {
 setPasswordError("Passwords do not match");
  return;
}

setForgotStep(4);

              setForgotStep(4);
            }}
          >
            Reset Password
          </button>
        </>
      )}

      {forgotStep === 4 && (
        <>
          <h2>Password Changed Successfully</h2>

          <button
            type="button"
            className="form-submit-btn"
            onClick={() => {
              setForgotPassword(false);
              setForgotStep(1);
            }}
          >
            Return To Login
          </button>
        </>
      )}

    </div>

  )}

</div>

        {/* REGISTER PANEL - WITH ALL UI FIELDS */}
        <div className={`form-view-panel register-panel-view ${formType === "register" ? "active" : "inactive"}`}>
          <div className="card-header">
            <h1 className="form-view-title">REGISTER</h1>
            <p className="subtitle">Please provide your academic and guardian details.</p>
          </div>
          {showSuccessCard && (
  <div className="success-envelope">
    <div className="envelope-icon">✉️</div>
    <h3>Registration Submitted</h3>
    <p>
      Your registration has been submitted successfully.
      <br />
      Credentials will be sent after admin approval.
    </p>
  </div>
)}
          <form onSubmit={handleRegister} className="scrolling-registration-panel minimalist-form-layout">
            
            {/* ===== STUDENT DETAILS SECTION ===== */}
            <h3 className="group-label">Student Details</h3>
            
            <div className="grid-three-col">
              <div className="form-group-line">
                <input 
                  type="text" 
                  placeholder="First Name" 
                  value={firstName} 
                  maxLength={20}
                  onChange={(e) => setFirstName(e.target.value.replace(/[^a-zA-Z\s]/g, ""))} 
                  required 
                />
              </div>
              <div className="form-group-line">
                <input 
                  type="text" 
                  placeholder="Middle Name" 
                  value={middleName} 
                  maxLength={20}
                  onChange={(e) => setMiddleName(e.target.value.replace(/[^a-zA-Z\s]/g, ""))} 
                />
              </div>
              <div className="form-group-line">
                <input 
                  type="text" 
                  placeholder="Last Name" 
                  value={lastName} 
                  maxLength={20}
                  onChange={(e) => setLastName(e.target.value.replace(/[^a-zA-Z\s]/g, ""))} 
                  required 
                />
              </div>
            </div>

            <div className="grid-two-col">
              <div className="form-group-line">
                <input type="email" placeholder="Email Address" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} required />
              </div>
              <div className="form-group-line">
                <input 
                  type="tel"
                  placeholder="Phone Number"
                  value={phone}
                  maxLength={10}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  required
                />
              </div>
            </div>

            <div className="grid-two-col">
              <div className="form-group-line select-box-style">
                <select value={course} onChange={(e) => setCourse(e.target.value)} required>
                  <option value="" disabled>Select Course</option>
                  <option value="fs-web">Full Stack Web Development</option>
                  <option value="ds-ai">Data Science & AI Masterclass</option>
                  <option value="ui-ux">UI/UX Creative Design</option>
                  <option value="cyber">Cybersecurity Fundamentals</option>
                </select>
              </div>
              <div className="form-group-line select-box-style">
                <select value={gender} onChange={(e) => setGender(e.target.value)} required>
                  <option value="" disabled>Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-group-line dob-row-layout">
              <label>Date of Birth</label>
              <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} required />
            </div>

            <div className="form-group-line">
              <input type="text" placeholder="Permanent Address" value={address} onChange={(e) => setAddress(e.target.value)} required />
            </div>

            {/* ===== ACADEMIC QUALIFICATIONS SECTION ===== */}
            <h3 className="group-label">Academic Qualifications</h3>
            
            <div className="form-group-line">
              <input type="text" placeholder="College / University Name" value={collegeName} onChange={(e) => setCollegeName(e.target.value)} required />
            </div>

            <div className="grid-two-col">
              <div className="form-group-line">
                <input type="text" placeholder="Degree / Course Pursued" value={degree} onChange={(e) => setDegree(e.target.value)} required />
              </div>
              <div className="form-group-line">
                <input 
                  type="text" 
                  placeholder="Passing Year (YYYY)" 
                  value={passingYear} 
                  maxLength={4}
                  onChange={(e) => setPassingYear(e.target.value.replace(/\D/g, ""))} 
                  required 
                />
              </div>
            </div>

            {/* ===== PARENT / GUARDIAN DETAILS SECTION ===== */}
            <h3 className="group-label">Parent / Guardian Details</h3>
            
            <div className="grid-three-col">
              <div className="form-group-line">
                <input 
                  type="text" 
                  placeholder="Parent First Name" 
                  value={pFirstName} 
                  maxLength={20}
                  onChange={(e) => setPFirstName(e.target.value.replace(/[^a-zA-Z\s]/g, ""))} 
                  required 
                />
              </div>
              <div className="form-group-line">
                <input 
                  type="text" 
                  placeholder="Middle Name" 
                  value={pMiddleName} 
                  maxLength={20}
                  onChange={(e) => setPMiddleName(e.target.value.replace(/[^a-zA-Z\s]/g, ""))} 
                />
              </div>
              <div className="form-group-line">
                <input 
                  type="text" 
                  placeholder="Last Name" 
                  value={pLastName} 
                  maxLength={20}
                  onChange={(e) => setPLastName(e.target.value.replace(/[^a-zA-Z\s]/g, ""))} 
                  required 
                />
              </div>
            </div>

            <div className="grid-two-col">
              <div className="form-group-line">
                <input type="email" placeholder="Parent's Email ID" value={pEmail} onChange={(e) => setPEmail(e.target.value)} required />
              </div>
              <div className="form-group-line">
                <input 
                  type="tel"
                  placeholder="Parent's Phone No"
                  value={pPhone}
                  maxLength={10}
                  onChange={(e) => setPPhone(e.target.value.replace(/\D/g, ""))}
                  required 
                />
              </div>
            </div>

            <div className="form-group-line">
              <input 
                type="text" 
                placeholder="Occupation" 
                value={pOccupation} 
                maxLength={30}
                onChange={(e) => setPOccupation(e.target.value.replace(/[^a-zA-Z\s]/g, ""))} 
                required 
              />
            </div>
            
            <div className="action-footer-row registration-footer">
              <button type="submit" className="form-submit-btn">REGISTER</button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}

export default App;