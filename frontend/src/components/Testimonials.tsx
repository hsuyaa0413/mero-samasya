'use client';

import * as React from 'react';
import Autoplay from 'embla-carousel-autoplay';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';

export function Testimonials() {
  const plugin = React.useRef(Autoplay({ delay: 4000 }));

  const testimonials = [
    {
      quote:
        'Our city has become cleaner and safer since we started using this platform. It has been a game-changer for us in managing public issues.',
      name: 'Aayush Dhungel',
      designation: 'Senior Administrative Officer, Dharan',
      src: '/aayush.jpg',
    },
    {
      quote:
        'I reported a broken sewage pipe in our area and it was fixed within two days! The updates kept me informed throughout the process.',
      name: 'Jeevan Poudel',
      designation: 'Itahari Resident',
      src: '/jeevan.jpg',
    },
    {
      quote:
        'Mero समस्या has streamlined our workflow. We can now prioritize issues based on urgency and track their resolution in real-time.',
      name: 'Yanjal Khanal',
      designation: 'Sanitation Officer, Dharan',
      src: '/yanjal.jpg',
    },
    {
      quote:
        'The platform is user-friendly and the community engagement features are top-notch. It has made our work so much easier',
      name: 'Sanjeev Shrestha',
      designation: 'Community Leader',
      src: '/sanjeev.jpg',
    },
  ];

  return (
    <div className="w-full bg-lightBlue p-2 pt-10 sm:p-0">
      <div className="text-center sm:pt-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          <span className="text-skyBlue">What Our Users Are Saying</span>
        </h2>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Our users have shared their experiences with &apos;Mero समस्या&apos;.
          Here are some of their testimonials that highlight the impact of our
          platform on their lives.
        </p>
      </div>

      <div className="max-w-4xl w-full mx-auto px-4 py-10 font-sans antialiased sm:max-w-4xl md:max-w-7xl md:px-8 lg:px-12 flex justify-center">
        <Carousel
          opts={{
            loop: true,
            align: 'start',
          }}
          plugins={[plugin.current]}
          className="w-full max-w-md"
        >
          <CarouselContent>
            {testimonials.map((item, index) => (
              <CarouselItem key={index}>
                <div className="">
                  <Card className="max-w-5xl border-none shadow-none bg-lightBlue">
                    <CardContent className="">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-24 w-24 sm:h-30 sm:w-30 border-2 border-white/20 flex-shrink-0">
                          <AvatarImage src={item.src} alt={item.name} />
                          <AvatarFallback>
                            {item.name
                              .split(' ')
                              .map(n => n[0])
                              .join('')}
                          </AvatarFallback>
                        </Avatar>

                        <div className="space-y-3">
                          <div>
                            <h3 className="font-semibold text-xl">
                              {item.name}
                            </h3>
                            <p className="text-skyBlue">{item.designation}</p>
                          </div>

                          <p className=" text-gray-600 border-l-0 pl-0">
                            &ldquo;{item.quote}&rdquo;
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hover:bg-greyBlue hidden sm:flex" />
          <CarouselNext className="hover:bg-greyBlue hidden sm:flex" />
        </Carousel>
      </div>
    </div>
  );
}
