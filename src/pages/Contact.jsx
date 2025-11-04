import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, Mail, Phone, MapPin } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast({
      title: 'Thank you!',
      description: 'Your message has been sent successfully. We\'ll get back to you soon!',
    });
    setFormData({ name: '', email: '', message: '' });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <Helmet>
        <title>Contact Us - Creative Agency</title>
        <meta name="description" content="Get in touch with our creative agency. We'd love to hear from you and discuss how we can help transform your brand." />
      </Helmet>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen bg-[#0C0D0D] text-white pt-32 pb-20"
      >
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 uppercase">
                Let's <span className="text-accent-purple">Connect</span>
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Have a project in mind? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-12">
              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
                  <p className="text-gray-400 mb-8">
                    We're here to help and answer any question you might have. We look forward to hearing from you.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-accent-purple/10 rounded-lg">
                      <Mail className="w-5 h-5 text-accent-purple" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <p className="text-gray-400">hello@agency.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-accent-purple/10 rounded-lg">
                      <Phone className="w-5 h-5 text-accent-purple" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Phone</h3>
                      <p className="text-gray-400">+1 (555) 123-4567</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-accent-purple/10 rounded-lg">
                      <MapPin className="w-5 h-5 text-accent-purple" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Address</h3>
                      <p className="text-gray-400">123 Creative Street, Design City, DC 12345</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <form onSubmit={handleSubmit} className="space-y-6">
                  <Input
                    label="Name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="bg-[#1E1E2A] border-white/10 text-white"
                  />
                  
                  <Input
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="bg-[#1E1E2A] border-white/10 text-white"
                  />
                  
                  <Textarea
                    label="Message"
                    name="message"
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="bg-[#1E1E2A] border-white/10 text-white"
                  />
                  
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-accent-purple hover:bg-accent-purple/90 text-white font-bold rounded-full group"
                  >
                    Send Message
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Contact;
