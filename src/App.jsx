import { Route, Routes } from 'react-router-dom'
import Home from './screens/Home.jsx'
import Lessons from './screens/Lessons.jsx'
import StudentActivities from './screens/StudentActivities.jsx'
import StudentProgress from './screens/StudentProgress.jsx'
import StudentReading from './screens/StudentReading.jsx'
import TeacherEdit from './screens/TeacherEdit.jsx'
import TeacherExtract from './screens/TeacherExtract.jsx'
import TeacherPreview from './screens/TeacherPreview.jsx'
import TeacherPublished from './screens/TeacherPublished.jsx'
import TeacherUpload from './screens/TeacherUpload.jsx'
import Button from './components/Button.jsx'
import Card from './components/Card.jsx'

function MissingPage() {
  return (
    <main className="page">
      <Card className="page-card">
        <h1>This page isn&apos;t here</h1>
        <p className="page-copy">Let&apos;s go home and start again.</p>
        <Button variant="primary" to="/">
          Back to home
        </Button>
      </Card>
    </main>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/lessons" element={<Lessons />} />
      <Route path="/teacher" element={<TeacherUpload />} />
      <Route path="/teacher/extract" element={<TeacherExtract />} />
      <Route path="/teacher/edit" element={<TeacherEdit />} />
      <Route path="/teacher/preview" element={<TeacherPreview />} />
      <Route path="/teacher/published" element={<TeacherPublished />} />
      <Route path="/student" element={<StudentReading />} />
      <Route path="/student/read/:lessonId" element={<StudentReading />} />
      <Route path="/student/activity/:lessonId" element={<StudentActivities />} />
      <Route path="/student/complete/:lessonId" element={<StudentProgress />} />
      <Route path="*" element={<MissingPage />} />
    </Routes>
  )
}

export default App
