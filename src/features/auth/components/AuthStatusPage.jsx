import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  Mail,
  RefreshCw,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import "../../../auth.css";
const states = {
  verify: {
    eyebrow: "ONE LAST STEP",
    title: "Check your inbox.",
    icon: Mail,
    copy: "We sent a verification link to your email address. Open it to finish creating your EventSphere account.",
    button: "Resend verification email",
    action:
      "Your verification email is ready to be sent when email service is connected.",
  },
  verified: {
    eyebrow: "YOU’RE ALL SET",
    title: "Email verified.",
    icon: Check,
    copy: "Your email address has been confirmed. You can now sign in and find your place in the event.",
    button: "Go to sign in",
  },
  expired: {
    eyebrow: "LINK EXPIRED",
    title: "Let’s send a fresh one.",
    icon: RefreshCw,
    copy: "This verification link is no longer active. Request another link and try again.",
    button: "Send a new link",
    action:
      "A new verification link will be sent when email service is connected.",
  },
  invalid: {
    eyebrow: "LINK NOT FOUND",
    title: "That link didn’t work.",
    icon: XCircle,
    copy: "The verification link is missing or invalid. Start again with a fresh email.",
    button: "Request a new link",
  },
  sent: {
    eyebrow: "A FRESH START",
    title: "Check your inbox.",
    icon: Mail,
    copy: "If an account exists for that email, we’ll send a password reset link shortly.",
    button: "Back to sign in",
  },
  resetSuccess: {
    eyebrow: "PASSWORD UPDATED",
    title: "You’re back in.",
    icon: ShieldCheck,
    copy: "Your password has been changed successfully. Sign in with your new password.",
    button: "Go to sign in",
  },
  resetInvalid: {
    eyebrow: "LINK NOT FOUND",
    title: "This reset link is not active.",
    icon: XCircle,
    copy: "The password reset link is missing, invalid, or expired. Request a fresh one to continue.",
    button: "Request a new link",
  },
};
export default function AuthStatusPage({ type }) {
  const [params] = useSearchParams();
  const state = states[type];
  const Icon = state.icon;
  const isLinkState = ["verified", "resetSuccess"].includes(type);
  const nextPath = isLinkState
    ? "/login"
    : type.startsWith("reset") || type === "sent"
      ? "/forgot-password"
      : "/verify-email";
  const hasToken = params.get("token");
  return (
    <main className="auth-page auth-status-page">
      <div className="auth-form-side">
        <header className="auth-header">
          <Link className="brand" to="/" aria-label="EventSphere home">
            <span className="brand-mark" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            EventSphere
          </Link>
          <Link className="auth-back" to="/">
            <ArrowLeft size={14} /> Back to home
          </Link>
        </header>
        <motion.div
          className="auth-form-content status-content"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <span className="eyebrow">
            <span className="status-dot" />
            {state.eyebrow}
          </span>
          <div className={`status-icon ${isLinkState ? "success" : "soft"}`}>
            <Icon size={28} />
          </div>
          <h1>{state.title}</h1>
          <p className="auth-description">{state.copy}</p>
          {type === "verify" && (
            <div className="email-preview">
              <span>PREVIEW EMAIL</span>
              <strong>you@company.com</strong>
            </div>
          )}
          {state.action && (
            <div className="auth-notice" role="status">
              <Mail size={17} />
              <p>{state.action}</p>
            </div>
          )}
          <Link
            className="button button-orange auth-submit status-button"
            to={
              type === "verify" || type === "expired"
                ? "/verify-email"
                : nextPath
            }
          >
            {state.button}
            <ArrowUpRight size={18} />
          </Link>
          {!hasToken && type === "resetInvalid" && (
            <p className="field-hint status-hint">
              This is a frontend preview, so tokens are not verified yet.
            </p>
          )}
          <p className="auth-switch">
            <Link to="/login">Back to sign in</Link>
          </p>
          <p className="auth-preview-note">
            Frontend preview · Email service is not connected yet.
          </p>
        </motion.div>
        <footer className="auth-footer">
          <span>© {new Date().getFullYear()} EventSphere</span>
          <span>Bring people together.</span>
        </footer>
      </div>
      <aside className="auth-story">
        <div className="auth-story-image">
          <img
            src="/assets/expo-hall.png"
            alt="People coming together at a trade show"
          />
        </div>
        <div className="auth-story-content">
          <span className="eyebrow">GOOD PEOPLE. GREAT CONNECTIONS.</span>
          <h2>
            Keep your place
            <br />
            in the story.
          </h2>
          <p>
            Your account helps you stay connected to every important event
            detail.
          </p>
          <div className="auth-story-rule" />
          <div className="auth-story-roles">
            <span>For the planners.</span>
            <span>For the brands.</span>
            <span>For the curious.</span>
          </div>
        </div>
      </aside>
    </main>
  );
}
