// Test script to verify form functionality
console.log("Testing Axiom ID waitlist form functionality...");

// Check if required elements exist
const form = document.getElementById('email-form');
const emailInput = document.getElementById('email');
const nameInput = document.getElementById('fullName');
const phoneInput = document.getElementById('phone');
const consent = document.getElementById('consent');
const status = document.getElementById('form-status');
const submitBtn = document.getElementById('submit-btn');
const connectBtn = document.getElementById('connect-wallet');

console.log("Form elements check:");
console.log("- Form:", form ? "✓ Found" : "✗ Missing");
console.log("- Email input:", emailInput ? "✓ Found" : "✗ Missing");
console.log("- Name input:", nameInput ? "✓ Found" : "✗ Missing");
console.log("- Phone input:", phoneInput ? "✓ Found" : "✗ Missing");
console.log("- Consent checkbox:", consent ? "✓ Found" : "✗ Missing");
console.log("- Status display:", status ? "✓ Found" : "✗ Missing");
console.log("- Submit button:", submitBtn ? "✓ Found" : "✗ Missing");
console.log("- Connect wallet button:", connectBtn ? "✓ Found" : "✗ Missing");

// Test email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const testEmails = [
  { email: "test@example.com", expected: true },
  { email: "invalid.email", expected: false },
  { email: "test@", expected: false },
  { email: "@example.com", expected: false },
  { email: "test@.com", expected: false }
];

console.log("\nEmail validation tests:");
testEmails.forEach(test => {
  const result = emailRegex.test(test.email);
  const passed = result === test.expected;
  console.log(`${test.email}: ${result ? "Valid" : "Invalid"} ${passed ? "✓" : "✗"}`);
});

console.log("\nForm functionality test completed.");