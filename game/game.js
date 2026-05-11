let emails = [
  {
    subject: "Netflix Account Suspended",
    body: "Your payment failed. Verify your account within 24 hours or it will be permanently closed!",
    link: "www.netflix-security-update-check.net",
    phishing: true,
    reason: "Fake domain (should be netflix.com) + Artificial urgency + Threat language"
  },
  {
    subject: "University Password Expiring",
    body: "Your Coventry password expires today. Verify to avoid lockout.",
    link: "coventry-student-portal-login.net",
    phishing: true,
    reason: "Impersonated domain (should be coventry.ac.uk) + Pressure tactics"
  },
  {
    subject: "Amazon Order Confirmation",
    body: "We detected suspicious activity. Confirm your order immediately.",
    link: "amazon-security-order-check.net",
    phishing: true,
    reason: "Fake domain + Impersonation + Suspicious domain extension"
  },
  {
    subject: "Your timetable update",
    body: "New schedule available for download.",
    link: "university.coventry.ac.uk",
    phishing: false,
    reason: "Official university domain + Neutral tone + No urgency"
  },
  {
    subject: "PayPal Account Verification",
    body: "Click here to verify your PayPal account and avoid suspension.",
    link: "paypal-verify-account.org",
    phishing: true,
    reason: "Wrong domain (.org instead of .com) + Fake verification request"
  },
  {
    subject: "Bank Security Alert",
    body: "We detected unauthorized access. Update your password immediately by clicking the link below.",
    link: "bank-secure-login-portal.com",
    phishing: true,
    reason: "Malicious domain + Fake security alert + Urgency + Poor grammar"
  },
  {
    subject: "Monthly Invoice from Your ISP",
    body: "Your monthly internet bill is ready. Download your invoice from our portal.",
    link: "isp.company.co.uk",
    phishing: false,
    reason: "Official company domain + Professional tone + No suspicious requests"
  },
  {
    subject: "Apple ID Login Attempt",
    body: "Someone tried to login to your Apple ID from an unknown location. Verify this was you.",
    link: "apple-id-verify-signin.xyz",
    phishing: true,
    reason: "Suspicious .xyz domain + Fake verification request + Grammar issues"
  },
  {
    subject: "Google Account Activity",
    body: "We detected an unusual login. Your account is still secure, but review the activity.",
    link: "myaccount.google.com",
    phishing: false,
    reason: "Official Google domain + Professional tone + Reassuring message"
  },
  {
    subject: "Microsoft Office 365 Update",
    body: "URGENT: Your O365 subscription expires in 24 hours. Renew now to continue using your account!",
    link: "office365-renewal-secure.net",
    phishing: true,
    reason: "Wrong domain + All caps (urgency) + Fake expiration threat"
  }
];

let currentEmail = null;
let score = 0;
let emailIndex = 0;
let totalEmails = 10;
let correctAnswers = 0;
let wrongAnswers = 0;
let answers = [];

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

function initializeGame() {
  score = 0;
  emailIndex = 0;
  correctAnswers = 0;
  wrongAnswers = 0;
  answers = [];
  startGame();
}

function startGame() {
  showScreen("game-screen");
  loadInbox();
  document.getElementById("reading-panel").classList.add("hidden");
}

function loadInbox() {
  if (emailIndex >= totalEmails) {
    endGame();
    return;
  }

  let list = document.getElementById("email-list");
  list.innerHTML = "";

  let e = emails[emailIndex];
  currentEmail = e;

  let li = document.createElement("li");
  li.innerText = e.subject;
  li.onclick = () => openEmail(e);
  list.appendChild(li);

  document.getElementById("email-number").innerText = emailIndex + 1;
}

function openEmail(e) {
  document.getElementById("reading-panel").classList.remove("hidden");

  document.getElementById("email-subject").innerText = e.subject;
  document.getElementById("email-body").innerText = e.body;
  document.getElementById("email-link").innerText = "🔗 " + e.link;
  
  // Reset cartoon
  const cartoon = document.getElementById("cartoon");
  cartoon.innerHTML = "🤖";
  cartoon.classList.remove("jump", "fall");
}

function choose(isLegit) {
  let correct = (isLegit === !currentEmail.phishing);
  
  // Points system: 10 points per email, 100 max for 10 emails
  if (correct) {
    score += 10;
    correctAnswers++;
  } else {
    wrongAnswers++;
  }

  document.getElementById("score").innerText = score;

  // Trigger animation
  const cartoon = document.getElementById("cartoon");
  cartoon.classList.remove("jump", "fall");
  
  setTimeout(() => {
    if (correct) {
      cartoon.classList.add("jump");
    } else {
      cartoon.classList.add("fall");
    }
  }, 50);

  // Store answer
  answers.push({
    subject: currentEmail.subject,
    userAnswer: isLegit,
    correct: correct,
    reason: currentEmail.reason
  });

  showFeedback(correct, currentEmail.reason);
}

function showFeedback(correct, reason) {
  showScreen("feedback-screen");

  let title = document.getElementById("feedback-title");
  let icon = document.getElementById("feedback-icon");
  let reasonEl = document.getElementById("feedback-reason");

  if (correct) {
    title.innerText = "✓ CORRECT!";
    title.classList.remove("incorrect");
    icon.innerText = "🎉";
    reasonEl.innerText = "Great job! You blocked the threat.";
  } else {
    title.innerText = "✗ INCORRECT";
    title.classList.add("incorrect");
    icon.innerText = "⚠️";
    reasonEl.innerText = "You fell for the phishing attack!";
  }

  document.getElementById("feedback-explanation").innerText = "Why: " + reason;
}

function nextEmail() {
  emailIndex++;
  if (emailIndex >= totalEmails) {
    endGame();
  } else {
    startGame();
  }
}

function endGame() {
  showScreen("end-screen");

  let passed = score >= 70;
  let icon = document.getElementById("end-icon");
  let title = document.getElementById("end-title");
  let message = document.getElementById("end-message");
  let finalScore = document.getElementById("final-score");

  finalScore.innerText = score;

  if (passed) {
    icon.innerText = "🏆";
    title.innerText = "CONGRATULATIONS!";
    title.classList.remove("fail");
    message.innerText = `Excellent work! You scored ${score}/100 and successfully identified phishing attempts. You're now a phishing detection expert! Keep your inbox safe! 🛡️`;
  } else {
    icon.innerText = "📚";
    title.innerText = "KEEP PRACTICING";
    title.classList.add("fail");
    message.innerText = `You scored ${score}/100. You need 70 points to pass. Don't worry! Review the material and try again. Every attempt helps you get better at spotting phishing! 💪`;
  }
}
