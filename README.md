# 📚 Kilivaathil — Student Reading Companion

> **An interactive reading companion designed to help primary-school students read, understand, and learn English through their own textbook content.**

**Kilivaathil** is a child-friendly web application currently being built for a **friend's school**, with the goal of making English reading practice more engaging, accessible, and interactive for students.

The application follows a simple learning loop:

**Read → Discover → Understand → Practice → Progress**

Instead of turning learning into a game-heavy experience, Kilivaathil aims to create a **calm, storybook-like reading environment** where students can explore unfamiliar words, understand their meanings in English and Malayalam, and reinforce their learning through short activities.

---

## 🌱 Project Status

🚧 **Actively under development**

The current version focuses on the **student reading experience** and the foundation for teacher-created lessons.

### Currently available

* 📖 Interactive reading experience
* 📝 Sentence-based lesson content
* 💡 Highlighted vocabulary words
* 🌱 Interactive vocabulary cards
* 🇬🇧 English vocabulary support
* 🇮🇳 Malayalam meaning support
* 🔊 Pronunciation support
* 🎯 Post-reading activities
* 📊 Reading/progress feedback
* 👩‍🏫 Teacher upload interface
* 📄 Lesson JSON import/export
* 💾 Local lesson storage
* 📱 Responsive student interface
* 🎨 Child-friendly visual design
* ✨ Motion-based interactions and animations

### In development

* 📄 PDF text extraction
* 🖼️ OCR for textbook images
* 🤖 Assisted vocabulary selection
* 👩‍🏫 Teacher lesson preview and publishing workflow
* 📚 Multiple lessons/textbooks
* 🔊 Improved pronunciation and listening support
* 📈 More meaningful student progress tracking

---

## 🎯 Why Kilivaathil?

Children often encounter unfamiliar words while reading textbooks, but the process of stopping to look up meanings can interrupt their reading flow.

Kilivaathil is designed around a different interaction:

> **Tap a word → understand it → hear it → continue reading**

The goal is to keep students inside the reading experience rather than sending them away to external dictionaries or translation tools.

The application also provides a bridge between **English and Malayalam**, helping students understand unfamiliar English vocabulary without losing the context of the original passage.

---

## 👧 Designed for Students

The primary audience is **students in Grades 3–5**.

The interface is intentionally designed around:

* Large, readable typography
* Comfortable reading widths
* Large touch targets
* Simple navigation
* Clear visual hierarchy
* Minimal distractions
* Friendly feedback
* English + Malayalam support
* Accessible interactions

The visual direction is inspired by a **children's picture book rather than a traditional educational dashboard**.

The aim is to make the application feel:

**Warm · Calm · Playful · Immersive · Readable**

---

## 🧭 Student Learning Flow

```text
        ┌───────────────┐
        │   Open Lesson │
        └───────┬───────┘
                ↓
        ┌───────────────┐
        │ Read Passage  │
        └───────┬───────┘
                ↓
        ┌───────────────┐
        │ Tap New Word  │
        └───────┬───────┘
                ↓
        ┌────────────────────┐
        │ English + Malayalam│
        │ Meaning + Pronunciation
        └─────────┬──────────┘
                  ↓
        ┌────────────────────┐
        │ Continue Reading   │
        └─────────┬──────────┘
                  ↓
        ┌────────────────────┐
        │ Practice Activities│
        └─────────┬──────────┘
                  ↓
        ┌────────────────────┐
        │ Completion/Progress│
        └────────────────────┘
```

---

## ✨ Core Features

### 📖 Interactive Reading

Students read a structured passage in a comfortable, distraction-free reading environment.

Vocabulary words that may be unfamiliar are visually highlighted without disrupting the passage.

### 💡 Vocabulary Discovery

Students can tap highlighted words to open an interactive vocabulary card containing information such as:

* Word
* Emoji/visual cue
* English meaning
* Malayalam meaning
* Pronunciation
* Example usage
* Listening support

### 🇮🇳 Malayalam Support

Malayalam translations are incorporated as a learning bridge so students can understand unfamiliar English vocabulary without leaving the application.

### 🎯 Reading Activities

After reading, students can reinforce vocabulary through short activities such as:

* Meaning selection
* Finding words
* Additional vocabulary exercises

Activities provide immediate, friendly feedback rather than treating mistakes as failures.

### 📊 Progress

The interface provides simple visual feedback about reading and activity progress, helping students understand where they are in a lesson.

### 👩‍🏫 Teacher Workflow

The long-term goal is to allow teachers to provide their existing textbook material rather than requiring them to create every lesson from scratch.

The planned workflow is:

```text
Upload textbook page
        ↓
Extract text
        ↓
Identify vocabulary
        ↓
Teacher reviews
        ↓
Preview lesson
        ↓
Publish to students
```

---

## 🛠️ Technology Stack

| Technology         | Purpose                                     |
| ------------------ | ------------------------------------------- |
| **React**          | Frontend application                        |
| **Vite**           | Development and production build tooling    |
| **React Router**   | Application navigation                      |
| **JavaScript**     | Application logic                           |
| **CSS**            | Custom design system and responsive styling |
| **Motion**         | UI transitions and interactions             |
| **LocalStorage**   | Local lesson persistence                    |
| **PDF.js**         | Planned PDF text extraction                 |
| **Tesseract.js**   | Planned OCR support                         |
| **Web Speech API** | Pronunciation/listening support             |
| **GitHub Pages**   | Static deployment                           |

The application intentionally avoids large UI frameworks and keeps the frontend lightweight.

---

## 🎨 Design System

Kilivaathil uses a warm, accessible visual language.

### Color Palette

| Purpose           | Color     |
| ----------------- | --------- |
| Background        | `#FDF9F3` |
| Primary / Teal    | `#2A9D8F` |
| Secondary / Coral | `#F4A261` |
| Text              | `#2B2B2B` |
| Highlight         | `#E8F5F3` |
| Error             | `#E07A5F` |

### Typography

* **Baloo 2** — headings and friendly UI elements
* **Atkinson Hyperlegible** — primary reading/body text
* **Noto Sans Malayalam** — Malayalam text

The design prioritizes readability, large touch targets, subtle motion, and a calm visual environment.

---

## 🗂️ Project Structure

```text
src/
├── components/
│   ├── Button
│   ├── Card
│   └── ProgressBar
│
├── data/
│   └── sampleLesson.json
│
├── screens/
│   ├── Home
│   ├── StudentReading
│   ├── Activity
│   ├── TeacherUpload
│   └── ...
│
├── utils/
│   └── lessonStorage.js
│
├── App.jsx
└── main.jsx

public/
...
```

The structure is intentionally kept modular so that future teacher, lesson-processing, and student-learning features can be added without restructuring the entire application.

---

## 🚀 Running Locally

### Prerequisites

* Node.js
* npm
* Git

### Clone the repository

```bash
git clone <repository-url>
cd <repository-name>
```

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

The application will be available at the local development URL shown by Vite.

### Create a production build

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

---

## 🌐 Deployment

The application is designed to be deployed as a static React application using **GitHub Pages**.

The production build is generated with:

```bash
npm run build
```

and the resulting `dist/` directory is deployed through GitHub Actions.

---

## 🏫 Built for a Real School

Kilivaathil is not being developed solely as a demonstration project.

It is being built specifically for **a friend's school**, with the intention of eventually creating something that can be used by actual students and teachers.

This influences the development approach:

* Features are designed around real classroom needs.
* The student experience is prioritized over unnecessary complexity.
* Teacher workflows are kept simple.
* The application is designed to work with existing textbook material.
* Accessibility and readability are treated as first-class requirements.
* Features are being added incrementally and tested through the actual product experience.

The current implementation is an **early MVP/prototype**, and the project will evolve as feedback from teachers and students becomes available.

---

## 🗺️ Roadmap

### Phase 1 — Student Experience

* [x] Reading interface
* [x] Vocabulary interaction
* [x] English/Malayalam vocabulary support
* [x] Reading progress
* [x] Post-reading activities
* [x] Responsive UI
* [x] Interactive animations

### Phase 2 — Teacher Content Creation

* [x] Textbook/worksheet upload interface
* [ ] PDF text extraction
* [ ] OCR for images
* [ ] Vocabulary identification
* [ ] Teacher review
* [ ] Lesson preview
* [ ] Lesson publishing

### Phase 3 — Learning Platform

* [ ] Multiple lessons
* [ ] Student progress history
* [ ] Improved listening/pronunciation
* [ ] More activity types
* [ ] Teacher dashboard
* [ ] Classroom-level lesson management

---

## 🔮 Future Direction

The long-term vision is to make Kilivaathil a lightweight bridge between **existing school textbooks and interactive digital learning**.

Rather than replacing textbooks, the application is intended to make the material students already need to read more accessible and engaging.

Potential future capabilities include:

* Textbook-aware vocabulary assistance
* Adaptive reading activities
* Teacher-controlled vocabulary
* More regional-language support
* Reading analytics
* Personalized practice
* Offline-friendly learning
* AI-assisted lesson preparation

These are future directions rather than currently implemented features.

---

## 🤝 Development

This project is being developed incrementally, with a strong emphasis on:

* Simple architecture
* Maintainable components
* Accessible UI
* Honest feature status
* Real-world usability
* Student-first design

The project will continue to evolve based on feedback from the school, teachers, and students.

---

## 📌 Current Version

**Status:** 🚧 Active Development
**Target Users:** Grades 3–5 students
**Primary Language:** English
**Language Support:** Malayalam
**Deployment:** GitHub Pages
**Application Type:** React + Vite Web Application

---

## 📄 License

This project is currently being developed for educational use.

License and distribution details are mentioned in the LICENSE file. 
