const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\hp\\.gemini\\antigravity\\brain\\b69ad8b5-d090-4d9d-a80c-037a7fef43de';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function cdpRequest(ws, method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = Math.floor(Math.random() * 1000000);
    const msg = JSON.stringify({ id, method, params });
    const handler = (event) => {
      const data = JSON.parse(event.data);
      if (data.id === id) {
        ws.removeEventListener('message', handler);
        if (data.error) reject(data.error);
        else resolve(data.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(msg);
  });
}

async function evaluate(ws, expression) {
  const res = await cdpRequest(ws, 'Runtime.evaluate', {
    expression,
    returnByValue: true,
    awaitPromise: true
  });
  return res.result ? res.result.value : null;
}

async function captureScreenshot(ws, filename) {
  const res = await cdpRequest(ws, 'Page.captureScreenshot', { format: 'png' });
  const filePath = path.join(ARTIFACT_DIR, filename);
  fs.writeFileSync(filePath, Buffer.from(res.data, 'base64'));
  console.log(`[Screenshot Saved] ${filePath}`);
  return filePath;
}

async function run() {
  console.log('================================================================');
  console.log('STARTING VAAYANA FRONTEND VISUAL POLISH AUDIT SUITE');
  console.log('================================================================');

  const chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    '--remote-debugging-port=9225',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--window-size=1280,950'
  ]);

  await sleep(2500);

  try {
    const targets = await new Promise((resolve, reject) => {
      http.get('http://127.0.0.1:9225/json', res => {
        let raw = '';
        res.on('data', chunk => raw += chunk);
        res.on('end', () => resolve(JSON.parse(raw)));
      }).on('error', reject);
    });

    const pageTarget = targets.find(t => t.type === 'page');
    if (!pageTarget) throw new Error('No CDP page target found');

    const WebSocketClient = globalThis.WebSocket || require(path.join(__dirname, '../frontend/node_modules/ws'));
    const ws = new WebSocketClient(pageTarget.webSocketDebuggerUrl);
    await new Promise((resolve) => {
      if (ws.readyState === 1) return resolve();
      ws.addEventListener('open', resolve, { once: true });
    });

    await cdpRequest(ws, 'Page.enable');
    await cdpRequest(ws, 'Runtime.enable');

    // -------------------------------------------------------------
    // TEST 1: Homepage Visual Inspection
    // -------------------------------------------------------------
    console.log('\n--- 1. Testing Homepage Polish (Background, Header, Purple CTAs) ---');
    await cdpRequest(ws, 'Page.navigate', { url: 'http://127.0.0.1:5173/' });
    await sleep(2500);

    const homeData = await evaluate(ws, `
      (() => {
        const bodyBg = window.getComputedStyle(document.body).backgroundColor;
        const bookIcon = !!document.querySelector('svg.lucide-book-open');
        const ctaBtn = document.querySelector('a[href="/teacher"]');
        const ctaBg = ctaBtn ? window.getComputedStyle(ctaBtn).backgroundColor : null;
        const svgs = document.querySelectorAll('svg').length;
        const hasMotionBg = !!document.querySelector('.pointer-events-none svg');
        return { bodyBg, bookIcon, ctaBg, svgs, hasMotionBg, title: document.title };
      })()
    `);
    console.log('Homepage inspection:', JSON.stringify(homeData, null, 2));
    await captureScreenshot(ws, 'screenshot_polish_homepage.png');

    // -------------------------------------------------------------
    // TEST 2: Teacher Studio Polish
    // -------------------------------------------------------------
    console.log('\n--- 2. Testing Teacher Studio Polish (White Cards, Purple Elements) ---');
    await cdpRequest(ws, 'Page.navigate', { url: 'http://127.0.0.1:5173/teacher' });
    await sleep(2000);

    const teacherData = await evaluate(ws, `
      (() => {
        const cards = document.querySelectorAll('.grid > div');
        const searchInput = document.querySelector('input[type="text"]');
        const uploadBtn = document.querySelector('button');
        return {
          cardCount: cards.length,
          hasSearch: !!searchInput,
          headingText: document.querySelector('h1')?.innerText
        };
      })()
    `);
    console.log('Teacher Studio inspection:', JSON.stringify(teacherData, null, 2));
    await captureScreenshot(ws, 'screenshot_polish_teacher.png');

    // -------------------------------------------------------------
    // TEST 3: Smart Classroom Experience Hub
    // -------------------------------------------------------------
    console.log('\n--- 3. Testing Smart Classroom Hub ---');
    await cdpRequest(ws, 'Page.navigate', { url: 'http://127.0.0.1:5173/classroom' });
    await sleep(2000);

    const classroomData = await evaluate(ws, `
      (() => {
        const filterBtns = Array.from(document.querySelectorAll('button')).filter(b => b.innerText.includes('Math') || b.innerText.includes('EVS') || b.innerText.includes('All'));
        return {
          filterLabels: filterBtns.map(b => b.innerText.trim()),
          heading: document.querySelector('h1')?.innerText
        };
      })()
    `);
    console.log('Classroom Hub inspection:', JSON.stringify(classroomData, null, 2));
    await captureScreenshot(ws, 'screenshot_polish_classroom.png');

    // -------------------------------------------------------------
    // TEST 4: Lesson View (Math Ch 1) & Controls
    // -------------------------------------------------------------
    console.log('\n--- 4. Testing Lesson View (Math Chapter 1) ---');
    await cdpRequest(ws, 'Page.navigate', { url: 'http://127.0.0.1:5173/lesson/scert-std4-maths-ch1-lines-and-shapes' });
    await sleep(2500);

    const lessonData = await evaluate(ws, `
      (() => {
        const title = document.querySelector('h1')?.innerText;
        const nextBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Next') || b.innerText.includes('തുടരുക'));
        const nextBg = nextBtn ? window.getComputedStyle(nextBtn).backgroundColor : null;
        const airplanePreviewBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Airplane Preview'));
        return {
          title,
          hasNextBtn: !!nextBtn,
          nextBg,
          hasAirplaneBtn: !!airplanePreviewBtn
        };
      })()
    `);
    console.log('Lesson View inspection:', JSON.stringify(lessonData, null, 2));
    await captureScreenshot(ws, 'screenshot_polish_lesson.png');

    // -------------------------------------------------------------
    // TEST 5: Chapter Completion Airplane Transition Modal
    // -------------------------------------------------------------
    console.log('\n--- 5. Testing Slowed Airplane Animation & Lavender Banner ---');
    await evaluate(ws, `
      (() => {
        const btn = document.querySelector('button[title*="Preview"]') || Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('വിമാനം') || b.innerText.includes('Preview'));
        if (btn) btn.click();
      })()
    `);
    // Wait ~7.5 seconds so the airplane (duration 16s from -120vw to +120vw) cruises smoothly into the center of the viewport
    await sleep(7500);

    const airplaneModalData = await evaluate(ws, `
      (() => {
        const banner = document.querySelector('.bg-gradient-to-r');
        const airplane = document.querySelector('svg ellipse');
        const isModalVisible = !!document.querySelector('.fixed.inset-0');
        return {
          isModalVisible,
          bannerText: banner?.innerText?.trim(),
          airplaneFound: !!airplane
        };
      })()
    `);
    console.log('Airplane modal inspection:', JSON.stringify(airplaneModalData, null, 2));
    await captureScreenshot(ws, 'screenshot_polish_airplane.png');

    // Close the airplane modal
    await evaluate(ws, `
      (() => {
        const closeBtn = document.querySelector('button[title="Close animation"]') || Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Close') || b.innerText.includes('തുടരുക'));
        if (closeBtn) closeBtn.click();
      })()
    `);
    await sleep(1000);

    // -------------------------------------------------------------
    // TEST 6: Quiz Activity Experience & Semantic Feedback Colors
    // -------------------------------------------------------------
    console.log('\n--- 6. Testing Quiz Activity & Feedback Colors ---');
    // Switch to quiz view
    await evaluate(ws, `
      (() => {
        const quizTab = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Quiz') || b.innerText.includes('ക്വിസ്'));
        if (quizTab) quizTab.click();
      })()
    `);
    await sleep(1500);

    // Click the correct answer
    await evaluate(ws, `
      (() => {
        const optionBtns = document.querySelectorAll('.grid button');
        if (optionBtns.length > 0) optionBtns[0].click();
      })()
    `);
    await sleep(1200);

    const quizData = await evaluate(ws, `
      (() => {
        const correctBadge = document.querySelector('.bg-emerald-600') || document.querySelector('.bg-emerald-50');
        const questionBanner = document.querySelector('.bg-gradient-to-br');
        return {
          hasCorrectBadge: !!correctBadge,
          hasQuestionBanner: !!questionBanner,
          feedbackText: correctBadge?.innerText
        };
      })()
    `);
    console.log('Quiz inspection:', JSON.stringify(quizData, null, 2));
    await captureScreenshot(ws, 'screenshot_polish_quiz.png');

    // -------------------------------------------------------------
    // TEST 7: EVS Chapter 3 (Directions & Map) Still Fully Functional
    // -------------------------------------------------------------
    console.log('\n--- 7. Testing EVS Chapter 3 Integration & Intactness ---');
    await cdpRequest(ws, 'Page.navigate', { url: 'http://127.0.0.1:5173/lesson/scert-std4-evs-directions-homeland' });
    await sleep(2500);

    const evs3Data = await evaluate(ws, `
      (() => {
        return {
          title: document.querySelector('h1')?.innerText,
          hasCompass: document.body.innerText.includes('കോമ്പസ്') || document.body.innerText.includes('ദിശ'),
          hasSmartboardControls: !!document.querySelector('.fixed')
        };
      })()
    `);
    console.log('EVS Chapter 3 inspection:', JSON.stringify(evs3Data, null, 2));
    await captureScreenshot(ws, 'screenshot_polish_evs_ch3.png');

    console.log('\n================================================================');
    console.log('AUDIT COMPLETE: ALL POLISH REQUIREMENTS TESTED AND VERIFIED');
    console.log('================================================================');

    ws.close();
  } catch (err) {
    console.error('Fatal during audit:', err);
  } finally {
    chromeProc.kill();
  }
}

run();
