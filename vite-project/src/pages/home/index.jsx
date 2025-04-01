import React from 'react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Statistics } from '../../components/Statistics';
import chatImage from '../../components/hero.png';
import Navbar from '@/components/Navbar';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Navbar />
      {/* Header Section */}
      <header className="text-center py-8 px-4">
        <h1 className="text-4xl sm:text-6xl md:text-8xl font-extrabold lobster-regular">
          Welcome to Chater: <br /> Connect, Share, and Collaborate
        </h1>
        <p className="mt-4 text-lg sm:text-xl md:text-2xl">
          Simplify your communication and file sharing with Chater, the ultimate platform for fast and secure collaboration.
        </p>
      </header>

      {/* Chater Feature Section */}
      <section style={{ backgroundColor: '#c93b02' }} className="text-white py-12 px-4 sm:px-6 lg:px-8 rounded-lg w-full max-w-7xl mx-auto my-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="lg:w-1/2">
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold mb-4">
              Experience Chater <br /> Effortless Communication
            </h2>
            <p className="text-sm sm:text-base lg:text-lg mb-6">
              Chater helps you keep in touch with teams, friends, and clients through a seamless and intuitive interface.
            </p>
            <Button 
              className="bg-white text-red-700 py-2 px-4 rounded-md hover:bg-gray-100 transition duration-300"
              onClick={() => window.location.href = '/signup'}
            >
              Get Started
            </Button>
          </div>

          <div className="lg:w-1/2 w-full">
            <img src={chatImage} alt="Chater" className="w-full h-auto object-cover rounded-lg" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl sm:text-4xl font-bold mb-8 sm:mb-12">Key Features of Chater</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Feature Cards */}
          {[
            {
              title: "Real-Time Messaging",
              desc: "Instantly send messages to individuals or groups. Enjoy fast, reliable communication with no delays."
            },
            {
              title: "Secure File Sharing",
              desc: "Share large files securely with end-to-end encryption. Keep your work private and accessible."
            },
            {
              title: "Organized Channels",
              desc: "Create public or private channels to organize communication and collaboration within teams."
            },
            {
              title: "Customizable Notifications",
              desc: "Stay updated with customizable notifications. Control what you get notified about and when."
            }
          ].map((feature, index) => (
            <Card key={index} className="shadow-md bg-white text-black dark:bg-gray-800 dark:text-white p-4 sm:p-6">
              <h3 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-4">{feature.title}</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4">
                {feature.desc}
              </p>
              <Button className="bg-primary text-white w-full sm:w-auto">Learn more</Button>
            </Card>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="container py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="bg-muted/50 border rounded-lg py-8 sm:py-12">
          <div className="px-4 sm:px-6 flex flex-col-reverse md:flex-row gap-6 md:gap-12">
            <div className="flex flex-col justify-between">
              <div className="pb-4 sm:pb-6">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                  <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
                    About{' '}
                  </span>
                  Chater
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-muted-foreground mt-2 sm:mt-4">
                  Chater is designed to empower teams and individuals to communicate efficiently.
                </p>
              </div>
              <Statistics />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;