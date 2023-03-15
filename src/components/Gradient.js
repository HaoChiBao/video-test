import React, { useRef, useEffect } from 'react';

const Gradient = ({ width, height }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        let circleX = width / 2;
        let circleY = height / 2;
        let radius = Math.min(width, height) / 4;

        const draw = () => {
            // Clear canvas
            ctx.clearRect(0, 0, width, height);

            // Draw gradient circle
            const gradient = ctx.createRadialGradient(circleX, circleY, 0, circleX, circleY, radius * 2);
            gradient.addColorStop(0, '#2D9BA3');
            gradient.addColorStop(0.5, '#A22D74');
            ctx.fillStyle = gradient;

            ctx.filter = 'blur(100px)';

            ctx.beginPath();
            ctx.arc(circleX, circleY, radius, 0, Math.PI * 2);
            ctx.fill();

            // Update circle position and size
            circleX += 0.5;
            circleY += 0.25;
            radius += Math.sin(Date.now() / 2000);

            // Reset circle position and size if it goes beyond canvas boundaries
            if (circleX - radius > width) {
                circleX = -radius;
            }
            if (circleX + radius < 0) {
                circleX = width + radius;
            }
            if (circleY - radius > height) {
                circleY = -radius;
            }
            if (circleY + radius < 0) {
                circleY = height + radius;
            }

            // Request next animation frame
            requestAnimationFrame(draw);
        };

        // Start animation loop
        draw();

        // Cleanup function
        return () => cancelAnimationFrame(draw);
    }, [width, height]);

    return <canvas ref={canvasRef} width={width} height={height} />;
};

export default Gradient;
