import { useRef } from "react"
import { motion, useMotionValue, useSpring } from "motion/react"

const springValues = {
  damping: 30,
  stiffness: 100,
  mass: 1,
}

export default function TiltedImage({ rotateAmplitude = 3 }) {
  const ref = useRef<HTMLDivElement>(null)
  const rotateX = useSpring(useMotionValue(0), springValues)
  const rotateY = useSpring(useMotionValue(0), springValues)

  function handleMouse(e: React.MouseEvent<HTMLElement, MouseEvent>) {
    if (!ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const offsetX = e.clientX - rect.left - rect.width / 2
    const offsetY = e.clientY - rect.top - rect.height / 2

    const rotationX = (offsetY / (rect.height / 2)) * rotateAmplitude
    const rotationY = (offsetX / (rect.width / 2)) * rotateAmplitude

    rotateX.set(rotationX)
    rotateY.set(rotationY)
  }

  function handleMouseLeave() {
    rotateX.set(0)
    rotateY.set(0)
  }

  return (
    <motion.figure
      ref={ref}
      className="relative w-full h-full perspective-midrange mt-16 max-w-4xl mx-auto flex flex-col items-center justify-center"
      onMouseMove={handleMouse}
      onMouseLeave={handleMouseLeave}
      initial={{ y: 150, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 320, damping: 70, mass: 1 }}
    >
      <motion.div
        className="relative transform-3d w-full max-w-4xl"
        style={{ rotateX, rotateY }}
      >
        <img
          src="/hero_img.png"
          className="borderb bg-linear-180 from-pink-500 to-transparent p-1 w-full rounded-[15px] will-change-transform transform-[translateZ(0)]"
          alt="hero section showcase"
        />
      </motion.div>
    </motion.figure>
  )
}
