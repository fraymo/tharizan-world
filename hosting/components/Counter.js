import React, { useEffect, useState } from "react";

const Counter = () => {
    const [timeLeft, setTimeLeft] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const updateTimer = () => {
        const now = new Date();

        const startTime = new Date();
        startTime.setHours(process.env.NEXT_PUBLIC_START_TIME, 0, 0, 0); // 7:00 AM today
        const endTime = new Date();
        endTime.setHours(process.env.NEXT_PUBLIC_END_TIME, 0, 0, 0); // 12:00 PM today

        if (now >= startTime && now < endTime) {
            // ✅ Shop is open → show countdown until 12 PM
            setIsOpen(true);
            const diff = endTime - now;

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
        } else {
            // ❌ Shop is closed → show "Opens tomorrow at 7:00 AM"
            setIsOpen(false);

            let nextOpen = new Date(startTime);
            if (now >= endTime) {
                // already past today's 12 PM → open tomorrow
                nextOpen.setDate(nextOpen.getDate() + 1);
            }

            setTimeLeft(`Opens tomorrow at ${process.env.NEXT_PUBLIC_START_TIME}:00 AM`);
        }
    };

    useEffect(() => {
        updateTimer(); // initial run
        const interval = setInterval(updateTimer, 1000); // update every second
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="text-center p-4">
            <p className="text-lg font-bold text-red-600">
                {isOpen ? `Closes in: ${timeLeft}` : timeLeft}
            </p>
        </div>
    );
};

export default Counter;
