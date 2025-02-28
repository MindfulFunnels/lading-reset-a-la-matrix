import React, { useEffect, useState } from "react";
import { DateTime } from "luxon";

const Countdown = ({ deadline }: { deadline: string }) => {
  const calculateTimeLeft = () => {
    // Convertir el deadline a la zona horaria local del visitante

    const eventTime = DateTime.fromISO(deadline, { zone: "Europe/Madrid" }); // Tiempo base en España

    const localTime = eventTime.setZone(
      Intl.DateTimeFormat().resolvedOptions().timeZone
    );

    const now = DateTime.now(); // Hora actual del visitante
    const diff = localTime.diff(now, ["days", "hours", "minutes", "seconds"]);

    if (diff.toMillis() <= 0) {
      return {
        days: "00",
        hours: "00",
        minutes: "00",
        seconds: "00",
        live: true,
      };
    }

    const formatNumber = (num: number) => (num < 10 ? `0${num}` : `${num}`);

    return {
      days: formatNumber(Math.floor(diff.days)),
      hours: formatNumber(Math.floor(diff.hours)),
      minutes: formatNumber(Math.floor(diff.minutes)),
      seconds: formatNumber(Math.floor(diff.seconds)),
      live: false,
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [deadline]);

  if (timeLeft.live) {
    return (
      <div className='flex flex-col gap-4 justify-center items-center w-full text-lg font-bold'>
        <iframe
          className='w-[400px] h-[225px] md:w-[600px] md:h-[338px] lg:w-[800px] lg:h-[450px] mt-4 px-4'
          src='https://www.youtube.com/embed/76v5oumR00M?si=BOe079D0g5zkXx5E'
          title='YouTube video player'
          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
          allowFullScreen
        ></iframe>
      </div>
    );
  }

  const unidades = ["Días", "Horas", "Minutos", "Segundos"]; // Traducción de las unidades

  return (
    <div className='flex flex-wrap gap-2 justify-center items-center w-full md:gap-4 lg:gap-6 count-down-main'>
      {["days", "hours", "minutes", "seconds"].map((unit, index) => (
        <div
          key={index}
          className='timer flex flex-col items-center bg-black/60 border border-[#801FC6] rounded-xl shadow-lg py-2 px-4 min-w-[60px] max-w-[80px] md:min-w-[80px] md:max-w-[100px] lg:min-w-[100px] lg:max-w-[120px]'
        >
          <div className='flex justify-center items-center w-full text-center'>
            <h3
              className={`countdown-element ${unit} font-manrope font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#FFFFFF] tracking-widest`}
              style={{
                textShadow: `
              0 0 2px #801FC6, 
              0 0 4px #801FC6, 
              0 0 8px #801FC6, 
              0 0 12px #801FC6, 
              0 0 16px #801FC6`,
              }}
            >
              {timeLeft[unit as keyof typeof timeLeft]}
            </h3>
          </div>
          <p className='mt-1 text-xs sm:text-sm md:text-base font-medium text-[#A85FE8] tracking-wide uppercase glow-text'>
            {unidades[index]}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Countdown;
