/*!
 * Copyright © 2024 Shingo Suzuki
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

const passwordHistory = []; // 履歴を保存する配列
const maxHistorySize = 10; // 履歴の最大サイズ

// スライダーと表示用要素を取得
const lengthSlider = document.getElementById('lengthSlider');
const lengthValue = document.getElementById('lengthValue');

// スライダーの値をリアルタイムで表示
lengthSlider.addEventListener('input', () => {
  lengthValue.textContent = lengthSlider.value;
});

// パスワード生成ボタンの処理
document.getElementById('generateButton').addEventListener('click', () => {
  const length = parseInt(lengthSlider.value);
  const includeNumbers = document.getElementById('includeNumbers').checked;
  const includeLowercase = document.getElementById('includeLowercase').checked;
  const includeUppercase = document.getElementById('includeUppercase').checked;
  const includeSymbols = document.getElementById('includeSymbols').checked;

  const password = generatePassword(length, includeNumbers, includeLowercase, includeUppercase, includeSymbols);
  document.getElementById('output').textContent = password;

  // パスワードの強度を表示
  const strength = evaluateStrength(password);
  displayStrength(strength);

  addToHistory(password);
});

// パスワードをクリップボードにコピー
async function copyToClipboard(password) {
  try {
    await navigator.clipboard.writeText(password);
    alert(`Copied to clipboard: ${password}`);
  } catch (err) {
    console.error('Failed to copy text: ', err);
    alert('Failed to copy the password.');
  }
}

// コピー機能の処理
document.getElementById('copyButton').addEventListener('click', async () => {
  const passwordField = document.getElementById('output');
  const password = passwordField.textContent;

  if (!password) {
    alert('No password to copy!');
    return;
  }

  copyToClipboard(password);
});

// パスワード生成ロジック
function generatePassword(length, includeNumbers, includeLowercase, includeUppercase, includeSymbols) {
  const numbers = '0123456789';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const symbols = '!@#$%^&*()-_=+[]{};:,.<>?';

  let charset = '';
  if (includeNumbers) charset += numbers;
  if (includeLowercase) charset += lowercase;
  if (includeUppercase) charset += uppercase;
  if (includeSymbols) charset += symbols;

  if (charset === '') return 'Please select at least one option.';

  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
}

// パスワードの強度を評価
function evaluateStrength(password) {
  const length = password.length;
  const hasNumbers = /[0-9]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasSymbols = /[!@#$%^&*()\-_=+\[\]{};:,.<>?]/.test(password);

  let score = 0;
  if (length >= 8) score++;
  if (length >= 16) score++;
  if (hasNumbers) score++;
  if (hasLowercase) score++;
  if (hasUppercase) score++;
  if (hasSymbols) score++;

  if (score <= 3) return 'weak';
  if (score <= 5) return 'moderate';
  return 'strong';
}

// 強度を画面に表示
function displayStrength(strength) {
  const strengthText = document.getElementById('strength');
  strengthText.textContent = `Password Strength: ${strength.charAt(0).toUpperCase() + strength.slice(1)}`;
  strengthText.className = strength;
}

// 履歴に追加
function addToHistory(password) {
  if (passwordHistory.length >= maxHistorySize) {
    passwordHistory.pop();
  }
  passwordHistory.unshift(password);
  renderHistory();
}

// 履歴を表示
function renderHistory() {
  const historyElement = document.getElementById('history');
  historyElement.innerHTML = '';

  passwordHistory.forEach((password, index) => {
    const li = document.createElement('li');
    li.textContent = password;

    const copyButton = document.createElement('button');
    copyButton.textContent = 'Copy';
    copyButton.addEventListener('click', () => copyToClipboard(password));

    li.appendChild(copyButton);
    historyElement.appendChild(li);
  });
}
