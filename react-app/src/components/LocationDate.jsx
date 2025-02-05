import React, { useState, useEffect } from "react";

const LocationDate = ({timezoneOffset,city}) => {
    const [dateTime, setDateTime] = useState({ day: "", month: "", year:"", time: "" });
    const dayNames = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      const formatTime = (date) => {
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        const amPm = hours >= 12 ? "PM" : "AM";
    
        hours = hours % 12 || 12;
        const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
        const formattedSeconds = seconds < 10 ? "0" + seconds : seconds;
    
        return `${hours}:${formattedMinutes}:${formattedSeconds} ${amPm}`;
      };

    useEffect(() => {
        if (typeof timezoneOffset !== "number" || isNaN(timezoneOffset)) {
            console.error("Invalid timezoneOffset:", timezoneOffset);
            return;
        }

        const updateTime = () => {
            const defaultTime = new Date();
            const utcTime = defaultTime.getTime() + defaultTime.getTimezoneOffset() * 60000; // Convert to UTC
            const localDate = new Date(utcTime + timezoneOffset * 1000); // Apply offset

            if (isNaN(localDate.getTime())) {
                console.error("Invalid Date generated:", localDate);
                return;
            }

            setDateTime({
                day: localDate.getDate(),
                month: localDate.getMonth(),
                year: localDate.getFullYear(),
                time: formatTime(localDate),
            });
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);

        return () => clearInterval(interval);
    }, [timezoneOffset]);
  return (
    <div>
        <p>{dateTime.time}</p>
        <p>{dayNames[dateTime.day]}</p>
        <p>{monthNames[dateTime.month]} {dateTime.day} {dateTime.year}</p>
    </div>
  )
}

export default LocationDate
