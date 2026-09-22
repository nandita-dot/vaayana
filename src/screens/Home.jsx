import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'
import Button from '../components/Button.jsx'
import Card from '../components/Card.jsx'
import ProgressBar from '../components/ProgressBar.jsx'
import StorybookScene from '../components/StorybookScene.jsx'
import './Lessons.css'

function Home() {
  const reduce = useReducedMotion()
  const item = {
    hidden: reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.32, ease: 'easeOut' } },
  }

  return (
    <main className="page">
      <StorybookScene />
      <motion.div
        className="home-stage"
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: reduce ? 0 : 0.08 } },
        }}
      >
        <motion.div
          variants={item}
          className="home-card-wrap"
          whileHover={reduce ? undefined : { y: -4, scale: 1.012 }}
          transition={{ duration: 0.22 }}
        >
          <Card className="page-card card--paper">
            <motion.h1 variants={item}>Reading Companion</motion.h1>
            <motion.p className="page-copy" variants={item}>
              Are you here to make a story, or to read one?
            </motion.p>
            <motion.div variants={item} style={{ width: '100%' }}>
              <ProgressBar value={0} label="Your reading journey" />
            </motion.div>
            <motion.div className="role-buttons" variants={item}>
              <Button variant="primary" size="large" to="/teacher">
                I&apos;m a Teacher
              </Button>
              <Button variant="primary" size="large" to="/student">
                I&apos;m a Student
              </Button>
            </motion.div>
            <motion.p className="utility-link" variants={item}>
              <Link to="/lessons">Story files</Link>
            </motion.p>
          </Card>
        </motion.div>
      </motion.div>
    </main>
  )
}

export default Home
