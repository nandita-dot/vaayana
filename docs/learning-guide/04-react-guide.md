# VAAYANA (വായന) — Developer Learning Guide
## Module 04: React & Component Architecture

---

### Mentor Introduction
If you have written plain JavaScript before, you are probably used to writing code like `document.getElementById('title').innerText = 'New Title'`. In modern applications like VAAYANA, we never do this. Instead, we use **React**.

In React, instead of manually searching for and updating HTML elements, you describe what the screen should look like based on the current **state** (data). When the data changes, React automatically figures out the fastest way to update the browser.

Let us explore React using the real components inside `frontend/src/`.

---

### 1. Functional Components and JSX

In React, a **component** is simply a JavaScript function that returns user interface elements. The syntax inside the return statement looks like HTML, but it is actually **JSX (JavaScript XML)**.

Look at this simple example from `frontend/src/components/Footer.tsx`:

```tsx
import React from 'react';
import { BookOpen, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#0B0B0D] border-t border-[#2E263B] py-6 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-sm text-[#A09CA8]">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#7950B8]" />
          <span>VAAYANA (വായന) — A.L.P.S. Koottala</span>
        </div>
        <p className="flex items-center gap-1 mt-2 md:mt-0">
          Made with <Heart className="w-4 h-4 text-[#FF8066] fill-[#FF8066]" /> for primary education
        </p>
      </div>
    </footer>
  );
};
```

#### Key Differences Between HTML and JSX:
1. **`className` instead of `class`**: Because `class` is a reserved keyword in JavaScript (used for OOP classes), JSX uses `className` to specify CSS classes.
2. **Embedding JavaScript inside curly braces `{}`**: Anytime you see `{ ... }` inside JSX, whatever is inside is evaluated as standard JavaScript (e.g., `{currentSlide + 1}` or `{slide.title_ml}`).
3. **Self-closing tags**: In standard HTML, you might write `<input>` or `<img>`. In JSX, tags without children must be explicitly self-closed: `<input />` or `<BookOpen />`.

---

### 2. State & The React Render Cycle (`useState`)

**State** is data that changes over time. When a component's state changes, React **re-renders** (redraws) that component.

Let us look at a simplified version of `frontend/src/pages/LessonView.tsx`:

```tsx
import React, { useState } from 'react';

export const LessonView: React.FC = () => {
  // 1. Declare state variable 'currentSlide' with default value 0
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  // 2. Handler functions to modify state
  const handleNext = () => {
    setCurrentSlide(prev => prev + 1); // Triggers re-render!
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1); // Triggers re-render!
    }
  };

  return (
    <div className="p-6">
      <h2>Slide Number: {currentSlide + 1}</h2>
      <button onClick={handlePrev}>Previous</button>
      <button onClick={handleNext}>Next</button>
    </div>
  );
};
```

#### The Golden Rule of State: NEVER Mutate State Directly!
In plain JavaScript, you might want to do this:
```javascript
// ❌ WRONG in React:
currentSlide = currentSlide + 1;
```
If you do this, React will not know that the value changed, and the screen will not update! **Always** use the setter function provided by `useState` (e.g., `setCurrentSlide(newValue)`).

---

### 3. Side Effects & Lifecycle (`useEffect`)

Sometimes a component needs to do something outside of just drawing HTML:
- Fetching data from the database.
- Listening for keyboard events (e.g., when the teacher presses the left or right arrow keys on a wireless presenter).
- Setting a timer.

These are called **Side Effects**, and they are managed with the `useEffect` hook.

Look at how keyboard navigation is implemented in `LessonView.tsx`:

```tsx
useEffect(() => {
  // 1. Define the event listener function
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowRight' || event.key === 'Space') {
      handleNext();
    } else if (event.key === 'ArrowLeft') {
      handlePrev();
    }
  };

  // 2. Attach the listener to the window
  window.addEventListener('keydown', handleKeyDown);

  // 3. CLEANUP FUNCTION: Essential!
  // When this component unmounts (closes), remove the listener
  // to prevent memory leaks and duplicate triggers!
  return () => {
    window.removeEventListener('keydown', handleKeyDown);
  };
}, [currentSlide, totalSlides]); // Dependency array
```

#### What is the Dependency Array `[...]`?
- `useEffect(() => { ... }, [])`: If the array is **empty**, the effect runs **only once** when the component first appears on screen (mounts).
- `useEffect(() => { ... }, [currentSlide])`: The effect re-runs **whenever `currentSlide` changes**.
- If you return a function from `useEffect`, React executes it when the component is removed from the screen (cleanup).

---

### 4. Avoiding "Prop Drilling": The React Context API

Imagine you have a piece of state like the current language (`'ml'` for Malayalam or `'en'` for English).
The `Navbar` needs it to highlight the active language button. The `InteractiveSlideView` needs it to know which text to display. The `QuizActivity` needs it to format the questions.

Passing this prop manually down through 5 levels of parent-child components is called **Prop Drilling**, and it is messy.

VAAYANA solves this using **React Context** in `frontend/src/context/LanguageContext.tsx`:

```tsx
// Simplified from frontend/src/context/LanguageContext.tsx:
import React, { createContext, useContext, useState } from 'react';

type Language = 'ml' | 'en';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
}

// 1. Create the Context object
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// 2. Create the Provider component that wraps the whole app
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ml'); // Default Malayalam

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'ml' ? 'en' : 'ml'));
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

// 3. Custom Hook to easily use the language anywhere in the app!
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
```

#### How any component consumes this:
Any component anywhere in the application can simply call:
```tsx
import { useLanguage } from '../context/LanguageContext';

export const MyComponent = () => {
  const { language, toggleLanguage } = useLanguage();
  return (
    <button onClick={toggleLanguage}>
      Current: {language === 'ml' ? 'മലയാളം' : 'English'}
    </button>
  );
};
```

---

### 5. Conditional Rendering Patterns in VAAYANA

In classroom presentations, what is shown on screen depends heavily on state. Here are the three main conditional rendering patterns used in VAAYANA:

#### Pattern A: The Ternary Operator (`condition ? ifTrue : ifFalse`)
Used for toggling Malayalam vs English text:
```tsx
<h1 className="text-2xl font-bold text-white">
  {language === 'ml' ? slide.title_ml : slide.title_en}
</h1>
```

#### Pattern B: Short-Circuit Evaluation (`condition && <Component />`)
Used to render something only when a condition is met:
```tsx
{/* Show drawing toolbar ONLY when the teacher enables drawing mode */}
{isDrawingMode && (
  <DrawingToolbar 
    selectedColor={drawColor} 
    onColorChange={setDrawColor} 
    onClear={clearCanvas} 
  />
)}
```

#### Pattern C: Dynamic Manipulative Component Mapping
In `InteractiveSlideView.tsx`, each slide can request a different interactive activity (e.g., `'abacus'`, `'clock'`, `'compass'`). How does React load the right one?

VAAYANA uses a **Component Registry / Switch Pattern**:

```tsx
// Inside InteractiveSlideView.tsx:
const renderActivity = (activityType?: string) => {
  switch (activityType) {
    case 'abacus':
      return <AbacusManipulative key={slide.slide_number} />;
    case 'clock':
      return <AnalogClockManipulative key={slide.slide_number} />;
    case 'compass':
      return <CompassActivity key={slide.slide_number} />;
    case 'geoboard':
      return <GeoboardManipulative key={slide.slide_number} />;
    case 'tangram':
      return <TangramActivity key={slide.slide_number} />;
    case 'solar_system':
      return <SolarSystemSimulator key={slide.slide_number} />;
    default:
      return null; // No interactive activity for this slide
  }
};
```
Notice the `key={slide.slide_number}` prop. This tells React: *"When the slide changes, destroy the previous activity and create a fresh one from scratch"* so beads or clock hands reset cleanly between slides!

---

### 6. Accessing Real DOM Elements with `useRef`

Sometimes React's virtual abstraction is not enough—you need direct access to an actual HTML element on the page. In VAAYANA, this happens in two main places:
1. **The Smartboard Drawing Canvas**: Where the teacher draws with a pen or finger over the slide.
2. **Audio Nodes**: Where procedural sounds are played.

Look at how `useRef` powers the drawing canvas in `InteractiveSlideView.tsx`:

```tsx
const canvasRef = useRef<HTMLCanvasElement | null>(null);

// When mouse/finger moves on canvas:
const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
  if (!isDrawing) return;
  const canvas = canvasRef.current;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.strokeStyle = drawColor;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  }
};

return (
  <div className="relative">
    {/* Slide text and images behind */}
    <div className="slide-content">...</div>

    {/* Canvas overlay directly on top */}
    <canvas
      ref={canvasRef}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      className="absolute inset-0 z-20 pointer-events-auto"
    />
  </div>
);
```

---

### Mentor's Checkpoint
You now understand how React works under the hood: functional components, JSX, state triggers, side effects and cleanups with `useEffect`, global context sharing, and DOM refs.

In **Module 05: Tailwind CSS & Visual Styling**, we will demystify all those CSS utility classes and see how VAAYANA achieves its gorgeous dark classroom theme and playful child-friendly accents!

