import React, { useState } from 'react';
import SEO from '@/components/SEO';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, Mail, Phone, Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { getSupabase } from '@/lib/supabase';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Verificar que Supabase esté configurado
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      console.log('🔍 Verificando configuración de Supabase:', {
        hasUrl: !!supabaseUrl,
        hasKey: !!supabaseAnonKey,
        urlLength: supabaseUrl?.length || 0,
        keyLength: supabaseAnonKey?.length || 0,
      });
      
      if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === '' || supabaseAnonKey === '') {
        console.error('❌ Supabase no configurado correctamente');
        throw new Error('Supabase no está configurado. Por favor, contacta al administrador.');
      }

      const supabase = await getSupabase();
      
      if (!supabase) {
        throw new Error('No se pudo conectar con Supabase. Por favor, intenta nuevamente.');
      }

      const { data, error } = await supabase
        .from('contact_messages')
        .insert([{
          name: formData.name.trim(),
          email: formData.email.trim(),
          message: formData.message.trim(),
        }])
        .select();

      if (error) {
        console.error('Error de Supabase:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        throw new Error('No se recibió confirmación del servidor. El mensaje puede no haberse guardado.');
      }

    // Rastrear conversión en Google Analytics
    if (window.gtag && typeof window.gtag === 'function') {
      window.gtag('event', 'form_submit', {
        event_category: 'Contact',
        event_label: 'Contact Form',
        value: 1
      });
      window.gtag('event', 'conversion', {
        send_to: 'AW-CONVERSION_ID/CONVERSION_LABEL', // Reemplazar con tu ID de conversión si lo tienes
        event_category: 'Contact',
        event_label: 'Contact Form Submission'
      });
    }

    toast({
      title: '¡Gracias!',
      description: 'Tu mensaje ha sido enviado exitosamente. ¡Te responderemos pronto!',
    });
    setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Error enviando mensaje:', error);
      const errorMessage = error?.message || error?.error?.message || 'Error desconocido';
      console.error('Detalles del error:', {
        error,
        message: errorMessage,
        code: error?.code,
        details: error?.details,
      });
      
      toast({
        title: 'Error',
        description: errorMessage.includes('RLS') 
          ? 'Error de permisos. Verifica la configuración de Supabase.'
          : errorMessage.includes('JWT')
          ? 'Error de autenticación. Verifica las credenciales de Supabase.'
          : `No se pudo enviar el mensaje: ${errorMessage}`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
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
      <Toaster />
      
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
                      <p className="text-gray-400">contacto@rium.com.mx</p>
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
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-white mb-2">
                      Nombre
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Tu nombre completo"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="bg-[#1E1E2A] border-white/10 text-white placeholder:text-gray-400"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-white mb-2">
                      Email
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="tu@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="bg-[#1E1E2A] border-white/10 text-white placeholder:text-gray-400"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-white mb-2">
                      Mensaje
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      rows={6}
                      placeholder="Cuéntanos sobre tu proyecto..."
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="bg-[#1E1E2A] border-white/10 text-white placeholder:text-gray-400"
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    size="lg"
                    disabled={loading}
                    className="w-full bg-accent-purple hover:bg-accent-purple/90 text-white font-bold rounded-full group disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                    Enviar Mensaje
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
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
