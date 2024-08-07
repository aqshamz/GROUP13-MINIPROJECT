import Image from 'next/image'
import Button from './Button'
import Link from "next/link";

const Hero = () => {
  return (
    <section className="max-container padding-container flex flex-col gap-20 py-10 pb-32 md:gap-28 lg:py-20 xl:flex-row">
      <div className="hero-map" />

      <div className="relative z-20 flex flex-1 flex-col xl:w-1/2">
        <h1 className="bold-52 lg:bold-88">Find Events Near You</h1>
        <p className="regular-16 mt-6 text-gray-30 xl:max-w-[520px]">
        Welcome to Event Management Web, where organizing unforgettable events is just a click away. Discover, manage, and celebrate your events with ease using our all-in-one platform designed for seamless planning and memorable experiences.
        </p>

        <div className="my-11 flex flex-wrap gap-5">
          <div className="flex items-center gap-2">
            {Array(5).fill(1).map((_, index) => (
              <Image 
                src="/star.svg"
                key={index}
                alt="star"
                width={24}
                height={24}
              />
            ))}
          </div>

          <p className="bold-16 lg:bold-20 text-blue-70">
            59k
            <span className="regular-16 lg:regular-20 ml-1">Excellent Reviews</span>
          </p>
        </div>

        <div className="flex flex-col w-full gap-3 sm:flex-row">
          <Link href={'/event'}>
          <Button 
            type="button" 
            title="See Events" 
            variant="btn_green" 
          />
          </Link>
          
          
        </div>
      </div>

      <div className="relative flex flex-1 items-start">
        <div className="relative z-20 flex w-[268px] flex-col gap-8 rounded-3xl bg-green-90 px-7 py-8">

           <div className="flex flex-col">
            <div className="flexBetween">
              <p className="regular-16 text-gray-20">Event</p>
              <Image src="/close.svg" alt="close" width={24} height={24} />
            </div>
            <p className="bold-20 text-white">Mountain Camp</p>
          </div>

         
            <div className="flex flex-col">
              <p className="regular-16 block text-gray-20">Location</p>
              <p className="bold-20 text-white">Bromo</p>
            </div>
            
        </div>
      </div>
    </section>
  )
}

export default Hero