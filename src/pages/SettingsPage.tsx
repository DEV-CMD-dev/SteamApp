import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { userHelperService } from "../services/userHelperService";
import styles from "../css/settingsPage.module.css";
import toast from "react-hot-toast";

type Step = "idle" | "password" | "code";

export default function SettingsPage() {
  const { username } = useContext(AuthContext);

  const [pushEnabled, setPushEnabled] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [statusLoading, setStatusLoading] = useState(true);

  const [step, setStep] = useState<Step>("idle");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const loadStatus = async () => {
      try {
        const enabled = await userHelperService.isTwoFactorAuthEnabled();
        setTwoFactorEnabled(!!enabled);
      } catch {
        
      } finally {
        setStatusLoading(false);
      }
    };

    loadStatus();
  }, []);

  const openTwoFactorFlow = () => {
    if (statusLoading) return;
    setStep("password");
    setPassword("");
    setCode(["", "", "", "", "", ""]);
    setError(null);
  };

  const closeFlow = () => {
    setStep("idle");
    setPassword("");
    setCode(["", "", "", "", "", ""]);
    setError(null);
    setIsLoading(false);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const promise = userHelperService.requestSetTwoFactorAuth({
        password,
      });

      toast.promise(promise, {
        loading: "Verifying credentials",
        success: "Code sent",
        error: "Invalid credentials",
      });

      await promise;
      setStep("code");
      setTimeout(() => inputRefs.current[0]?.focus(), 50);
    } catch (err: any) {
      setError(err.message || "Invalid password");
    } finally {
      setIsLoading(false);
    }
  };

  const submitCode = async (verificationCode: string) => {
    if (verificationCode.length !== 6 || isLoading) return;

    setIsLoading(true);
    setError(null);

    const enabling = !twoFactorEnabled;

    try {
      const promise = userHelperService.setTwoFactorAuth({
        code: verificationCode,
      });

      toast.promise(promise, {
        loading: enabling ? "Enabling 2FA" : "Disabling 2FA",
        success: enabling
          ? "Two-factor authentication enabled"
          : "Two-factor authentication disabled",
        error: "Failed to update 2FA",
      });

      await promise;
      setTwoFactorEnabled(enabling);
      closeFlow();
    } catch (err: any) {
      setError(err.message || "Invalid verification code");
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const newCode = [...code];
    newCode[index] = digit;
    setCode(newCode);
    setError(null);

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (digit && index === 5) {
      const full = newCode.join("");
      if (full.length === 6) submitCode(full);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;

    const newCode = ["", "", "", "", "", ""];
    pasted.split("").forEach((d, i) => (newCode[i] = d));
    setCode(newCode);

    if (pasted.length === 6) {
      submitCode(pasted);
    } else {
      inputRefs.current[pasted.length]?.focus();
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.panel}>
        <h1 className={styles.title}>Settings</h1>

        <div className={styles.list}>
          <div className={styles.row}>
            <div className={styles.info}>
              <span className={styles.label}>Change password</span>
              <small>Update the password for your account</small>
            </div>
            <button type="button" className={styles.btn}>
              Change password
            </button>
          </div>

          <div className={styles.row}>
            <div className={styles.info}>
              <span className={styles.label}>Two-factor authentication</span>
              <small>Add an extra layer of security to your account</small>
            </div>
            <button
              type="button"
              className={`${styles.toggle} ${twoFactorEnabled ? styles.on : ""}`}
              onClick={openTwoFactorFlow}
              disabled={statusLoading}
              aria-pressed={twoFactorEnabled}>
              <span className={styles.knob} />
            </button>
          </div>

          <div className={styles.row}>
            <div className={styles.info}>
              <span className={styles.label}>Email push notifications</span>
              <small>Receive notifications on your email even when the site is closed</small>
            </div>
            <button
              type="button"
              className={`${styles.toggle} ${pushEnabled ? styles.on : ""}`}
              onClick={() => setPushEnabled((v) => !v)}
              aria-pressed={pushEnabled}>
              <span className={styles.knob} />
            </button>
          </div>
        </div>
      </div>

      {step !== "idle" && (
        <div className={styles.overlay} onClick={closeFlow}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            {step === "password" && (
              <>
                <h2>Confirm your password</h2>
                <p>
                  Enter your current password to{" "}
                  {twoFactorEnabled ? "disable" : "enable"} two-factor authentication.
                </p>

                <form onSubmit={handlePasswordSubmit}>
                  <input
                    type="password"
                    className={styles.input}
                    placeholder="Current password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    autoFocus/>

                  {error && <div className={styles.error}>{error}</div>}

                  <div className={styles.actions}>
                    <button type="button" className={styles.btnSecondary} onClick={closeFlow}>
                      Cancel
                    </button>
                    <button type="submit" className={styles.btn} disabled={isLoading || !password}>
                      Continue
                    </button>
                  </div>
                </form>
              </>
            )}

            {step === "code" && (
              <>
                <h2>Enter verification code</h2>
                <p>Enter the 6-digit code we sent to your email.</p>

                <div className={styles.codeInputs}>
                  {code.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => {
                        inputRefs.current[index] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      disabled={isLoading}
                      onChange={(e) => handleCodeChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={handlePaste}
                      autoFocus={index === 0}
                    />
                  ))}
                </div>

                {error && <div className={styles.error}>{error}</div>}

                <div className={styles.actions}>
                  <button type="button" className={styles.btnSecondary} onClick={closeFlow}>
                    Cancel
                  </button>
                  <button
                    type="button"
                    className={styles.btn}
                    disabled={isLoading || code.join("").length !== 6}
                    onClick={() => submitCode(code.join(""))}>
                    {twoFactorEnabled ? "Disable 2FA" : "Enable 2FA"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}