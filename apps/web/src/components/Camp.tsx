"use client"

import { useEffect, useState } from "react";
// import { getAllEvents } from "@/api/event";
import Image from "next/image";
import Link from "next/link";
import { Box, Text } from "@chakra-ui/react";
import { Event } from "../app/interfaces";

interface CampProps {
  backgroundImage: string;
  title: string;
  subtitle: string;
  
}

const CampSite = ({ backgroundImage, title, subtitle }: CampProps) => {

  

  const encodedBackgroundImage = encodeURI(backgroundImage);
  console.log('encoded: ',encodedBackgroundImage)
  return (
    <div className="relative h-full w-full min-w-[1100px] lg:rounded-r-5xl 2xl:rounded-5xl">
      <Image
        src={encodedBackgroundImage}
        alt={title}
        layout="fill"
        objectFit="cover"
        className="lg:rounded-r-5xl 2xl:rounded-5xl"
      />
  
    
     <div className="flex h-full flex-col items-start justify-between p-6 lg:px-20 lg:py-10">
      <div className="flexCenter gap-4">
        <div className="rounded-full bg-green-50 p-4">
          <Image
            src="/folded-map.svg"
            alt="map"
            width={28}
            height={28}
          />
        </div>
        <div className="flex flex-col gap-1">
          <h4 className="bold-18 text-white">{title}</h4>
          <p className="regular-14 text-white">{subtitle}</p>
        </div>
      </div>

      
     </div>
    </div>
  )
}

const Camp = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const pageSize = 2; // Limit to first two events

  // useEffect(() => {
  //   const fetchEvents = async () => {
  //     try {
  //       const response = await getAllEvents(1, pageSize, "");
  //       setEvents(response.data);
  //     } catch (error) {
  //       console.error("Failed to fetch events:", error);
  //     }
  //   };

  //   fetchEvents();
  // }, []);

  // useEffect(() => {
  //   console.log("events:", events);
  // }, [events]);
  return (
    <section className="2xl:max-container relative flex flex-col py-10 lg:mb-10 lg:py-20 xl:mb-20">
      <div className="hide-scrollbar flex h-[340px] w-full items-start justify-start gap-8 overflow-x-auto lg:h-[400px] xl:h-[640px]">
        {/* {events.slice(0, 2).map((event) => (
          
              <CampSite 
              key={event.id}
                backgroundImage={`http://localhost:5670/${event.thumbnail.replace(/\\/g, '/')}`}
                title={event.title}
                subtitle={event.description}
              />

            
        ))} */}
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

export default Camp