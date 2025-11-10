import { useEffect, useRef } from 'react'

function NeuralNetworkAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width = 600
    const height = canvas.height = 600

    interface Node {
      x: number
      y: number
      vx: number
      vy: number
    }

    const nodes: Node[] = []
    const nodeCount = 50

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5
      })
    }

    const keyNode = { x: width / 2, y: height / 2 }

    function animate() {
      if (!ctx) return
      
      ctx.fillStyle = 'rgba(10, 10, 16, 0.1)'
      ctx.fillRect(0, 0, width, height)

      // Update and draw nodes
      nodes.forEach((node, i) => {
        node.x += node.vx
        node.y += node.vy

        if (node.x < 0 || node.x > width) node.vx *= -1
        if (node.y < 0 || node.y > height) node.vy *= -1

        // Draw connections
        nodes.forEach((otherNode, j) => {
          if (i < j) {
            const dx = node.x - otherNode.x
            const dy = node.y - otherNode.y
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance < 100) {
              ctx.strokeStyle = `rgba(0, 255, 255, ${0.3 * (1 - distance / 100)})`
              ctx.lineWidth = 1
              ctx.beginPath()
              ctx.moveTo(node.x, node.y)
              ctx.lineTo(otherNode.x, otherNode.y)
              ctx.stroke()
            }
          }
        })

        // Draw node
        ctx.fillStyle = '#00FFFF'
        ctx.beginPath()
        ctx.arc(node.x, node.y, 3, 0, Math.PI * 2)
        ctx.fill()
      })

      // Draw key in center
      ctx.save()
      ctx.translate(keyNode.x, keyNode.y)
      ctx.rotate(Date.now() / 1000)
      
      // Key shape
      ctx.strokeStyle = '#9E00FF'
      ctx.lineWidth = 3
      ctx.shadowBlur = 20
      ctx.shadowColor = '#9E00FF'
      
      ctx.beginPath()
      ctx.arc(0, 0, 30, 0, Math.PI * 2)
      ctx.stroke()
      
      ctx.beginPath()
      ctx.moveTo(30, 0)
      ctx.lineTo(60, 0)
      ctx.lineTo(60, -10)
      ctx.moveTo(60, 0)
      ctx.lineTo(60, 10)
      ctx.stroke()
      
      ctx.restore()

      requestAnimationFrame(animate)
    }

    animate()
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ maxWidth: '600px', maxHeight: '600px' }}
    />
  )
}

export default NeuralNetworkAnimation