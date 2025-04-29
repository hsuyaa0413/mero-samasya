import { AnimatedTestimonials } from '@/components/ui/animated-testimonials';

export function Testimonials() {
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
        '"Mero समस्या" has streamlined our workflow. We can now prioritize issues based on urgency and track their resolution in real-time.',
      name: 'Yanjal Khanal',
      designation: 'Sanitation Officer, Dharan Sub-Metropolitan City',
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
  return <AnimatedTestimonials testimonials={testimonials} />;
}
