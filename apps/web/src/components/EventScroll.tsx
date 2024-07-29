"use client"

import { useEffect, useState, useRef } from "react";
import { getAllEvents } from "@/api/event";
import Image from "next/image";

import { Event } from "../app/interfaces";

interface EventProps {
  backgroundImage: string;
  title: string;
  subtitle: string;
}

const EventList = ({ backgroundImage, title, subtitle }: EventProps) => {
  const encodedBackgroundImage = encodeURI(backgroundImage);

  return (
    <div className="relative h-full w-full min-w-[1100px] lg:rounded-r-5xl 2xl:rounded-5xl">
      <Image
        src={encodedBackgroundImage}
        alt={title}
        layout="fill"
        objectFit="cover"
        className="lg:rounded-r-5xl 2xl:rounded-5xl"
      />

      
    </div>
  );
};

const EventScroll = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const pageSize = 4;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await getAllEvents(1, pageSize, "");
        setEvents(response.data);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const container = document.querySelector('.event-scroll-container');
    let currentIndex = 0;
    let scrollWidth = 0;

    const scrollEvent = () => {
      if (container) {
        const children = container.children;
        if (children.length > 0) {
          scrollWidth = children[0].clientWidth + 32; // Event width + gap
          container.scrollTo({
            left: scrollWidth * currentIndex,
            behavior: 'smooth'
          });
          currentIndex = (currentIndex + 1) % children.length;
        }
      }
    };

    const interval = setInterval(scrollEvent, 3000);

    return () => clearInterval(interval);
  }, [events]);

  return (
    <section className="2xl:max-container relative flex flex-col py-10 lg:mb-10 lg:py-20 xl:mb-20">
      <div className="hide-scrollbar event-scroll-container flex h-[340px] w-full items-start justify-start gap-8 overflow-x-auto lg:h-[400px] xl:h-[640px]">
        {events.map((event) => (
          <EventList
            key={event.id}
            backgroundImage={`http://localhost:8000/${event?.picture?.replace(/\\/g, '/')}`}
            title={event.name}
            subtitle={event.description}
          />
        ))}
      </div>

      <div className="flexEnd mt-10 px-6 lg:-mt-60 lg:mr-6">
        <div className="bg-green-50 p-8 lg:max-w-[500px] xl:max-w-[734px] xl:rounded-5xl xl:px-16 xl:py-20 relative w-full overflow-hidden rounded-3xl">
          <h2 className="regular-24 md:regular-32 2xl:regular-64 capitalize text-white">
            Browse through your <strong>Favorite Events!</strong>
          </h2>
          <p className="regular-14 xl:regular-16 mt-5 text-white">
            Find your favorite events! From music concerts, education, seminars and many more. All over Indonesia.
          </p>
          <Image
            src="/quote.svg"
            alt="camp-2"
            width={186}
            height={219}
            className="camp-quote"
          />
        </div>
      </div>
    </section>
  );
};

export default EventScroll;