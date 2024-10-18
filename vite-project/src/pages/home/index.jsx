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
      <header className="text-center py-8">
        <h1 className="text-6xl md:text-8xl font-extrabold lobster-regular">
          Welcome to Chater: <br /> Connect, Share, and Collaborate
        </h1>
        <p className="mt-4 text-xl md:text-2xl">
          Simplify your communication and file sharing with Chater, the ultimate platform for fast and secure collaboration.
        </p>
      </header>

      {/* Chater Feature Section */}
      <section style={{ backgroundColor: '#c93b02' }} className="text-white py-12 lg:py-24 px-6 lg:px-12 rounded-lg w-full">
        <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between">
          <div className="lg:w-1/2 lg:pr-16">
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">
              Experience Chater <br /> Effortless Communication
            </h2>
            <p className="text-base lg:text-lg mb-6">
              Chater helps you keep in touch with teams, friends, and clients through a seamless and intuitive interface. Share files, send messages, and collaborate in real-time—anytime, anywhere.
            </p>
            <Button 
              className="bg-white text-red-700 py-2 px-4 rounded-md hover:bg-gray-100 transition duration-300"
              onClick={() => window.location.href = '/signup'}
            >
              Get Started
            </Button>
          </div>

          {/* Video/GIF Section */}
          <div className="lg:w-1/2 mt-8 lg:mt-0 relative">
          <img src={chatImage} alt="Chater" className="w-full h-full object-cover rounded-lg" />
          </div>
        </div>
      </section>

      
      {/* Features Section */}
      <section className="container py-24 px-6 lg:px-12">
        <h2 className="text-center text-4xl font-bold mb-12">Key Features of Chater</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature 1: Real-Time Messaging */}
          <Card className="shadow-md bg-white text-black dark:bg-gray-800 dark:text-white p-6">
            <h3 className="text-2xl font-semibold mb-4">Real-Time Messaging</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Instantly send messages to individuals or groups. Enjoy fast, reliable communication with no delays.
            </p>
            <Button className="bg-primary text-white">Learn more</Button>
          </Card>

          {/* Feature 2: Secure File Sharing */}
          <Card className="shadow-md bg-white text-black dark:bg-gray-800 dark:text-white p-6">
            <h3 className="text-2xl font-semibold mb-4">Secure File Sharing</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Share large files securely with end-to-end encryption. Keep your work private and accessible only to intended recipients.
            </p>
            <Button className="bg-primary text-white">Learn more</Button>
          </Card>

          {/* Feature 3: Organized Channels */}
          <Card className="shadow-md bg-white text-black dark:bg-gray-800 dark:text-white p-6">
            <h3 className="text-2xl font-semibold mb-4">Organized Channels</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Create public or private channels to organize communication and collaboration within teams.
            </p>
            <Button className="bg-primary text-white">Learn more</Button>
          </Card>

          {/* Feature 4: Customizable Notifications */}
          <Card className="shadow-md bg-white text-black dark:bg-gray-800 dark:text-white p-6">
            <h3 className="text-2xl font-semibold mb-4">Customizable Notifications</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Stay updated with customizable notifications. Control what you get notified about and when.
            </p>
            <Button className="bg-primary text-white">Learn more</Button>
          </Card>
        </div>
      </section>

    {/* About Section */}
    <section id="about" className="container py-24 sm:py-32">
        <div className="bg-muted/50 border rounded-lg py-12">
          <div className="px-6 flex flex-col-reverse md:flex-row gap-8 md:gap-12">
            <div className="flex flex-col justify-between">
              <div className="pb-6">
                <h2 className="text-3xl md:text-4xl font-bold">
                  <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
                    About{' '}
                  </span>
                  Chater
                </h2>
                <p className="text-xl text-muted-foreground mt-4">
                  Chater is designed to empower teams and individuals to communicate efficiently. Whether you’re sending files, hosting channels, or engaging in private chats, Chater makes it easy to stay connected.
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
