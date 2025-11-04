import React, { useState } from 'react';
import SEO from '@/components/SEO';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, Mail, Phone } from 'lucide-react';
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
      title: '¡Gracias!',
      description: 'Tu mensaje ha sido enviado exitosamente. ¡Te responderemos pronto!',
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
      <SEO
        title="Contacto"
        description="Ponte en contacto con nuestra agencia creativa especializada en diseño UI/UX, auditorías UX, investigación de mercado, arquitectura de información, wireframes, pruebas de usabilidad y más servicios de experiencia de usuario."
        keywords="contacto agencia creativa, consulta diseño, contacto marketing digital, agencia diseño UI/UX, consultoría UX, experiencia de usuario, auditoría UX, evaluaciones heurísticas, contacto diseño interfaces, contacto auditoría UX, contacto investigación mercado, cotización diseño UI/UX, presupuesto UX"
        url="https://rium.com.mx/contact"
      />
      
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
                Conectemos
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                ¿Tienes un proyecto en mente? Nos encantaría escucharte. Envíanos un mensaje y te responderemos lo antes posible.
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
                  <h2 className="text-2xl font-bold mb-6">Ponte en Contacto</h2>
                  <p className="text-gray-400 mb-8">
                    Estamos aquí para ayudarte y responder cualquier pregunta que tengas. Esperamos saber de ti.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-accent-purple/10 rounded-lg">
                      <Mail className="w-5 h-5 text-accent-purple" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Correo</h3>
                      <p className="text-gray-400">hectorhugo359@gmail.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-accent-purple/10 rounded-lg">
                      <Phone className="w-5 h-5 text-accent-purple" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Teléfono</h3>
                      <p className="text-gray-400">+52 5567748659</p>
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
                    label="Nombre"
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
                    label="Mensaje"
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
                    Enviar Mensaje
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
