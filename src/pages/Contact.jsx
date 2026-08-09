import React, { useState } from 'react';
import SEO from '@/components/SEO';
import { motion, useReducedMotion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, Mail, Phone, Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { getSupabase } from '@/lib/supabase';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const shouldReduceMotion = useReducedMotion();

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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
        className="min-h-screen bg-[#0C0D0D] pb-16 pt-24 text-white sm:pb-20 sm:pt-28 md:pt-32"
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.8 }}
              className="mb-10 text-center sm:mb-12 md:mb-16"
            >
              <h1 className="mb-4 text-[clamp(2.25rem,12vw,3rem)] font-bold uppercase leading-tight sm:mb-6 md:text-5xl lg:text-6xl">
                Conectemos
              </h1>
              <p className="mx-auto max-w-2xl text-base leading-relaxed text-gray-400 sm:text-lg md:text-xl">
                ¿Tienes un proyecto en mente? Nos encantaría escucharte. Envíanos un mensaje y te responderemos lo antes posible.
              </p>
            </motion.div>

            <div className="grid gap-10 md:grid-cols-2 md:gap-12">
              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.8, delay: shouldReduceMotion ? 0 : 0.2 }}
                className="space-y-6 sm:space-y-8"
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
                      <a className="break-all text-gray-400 active:text-white md:hover:text-white" href="mailto:contacto@rium.com.mx">contacto@rium.com.mx</a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-accent-purple/10 rounded-lg">
                      <Phone className="w-5 h-5 text-accent-purple" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Teléfono</h3>
                      <a className="text-gray-400 active:text-white md:hover:text-white" href="tel:+525567748659">+52 5567748659</a>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.8, delay: shouldReduceMotion ? 0 : 0.4 }}
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
                    className="min-h-12 bg-[#1E1E2A] text-base text-white placeholder:text-gray-400"
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
                    className="min-h-12 bg-[#1E1E2A] text-base text-white placeholder:text-gray-400"
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
                    className="min-h-36 resize-y bg-[#1E1E2A] text-base text-white placeholder:text-gray-400"
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    size="lg"
                    disabled={loading}
                    className="group min-h-12 w-full rounded-full bg-accent-purple font-bold text-white active:scale-[.99] disabled:opacity-50 motion-reduce:transition-none md:hover:bg-accent-purple/90"
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
