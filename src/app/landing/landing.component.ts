import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface Testimonial {
  name: string;
  role: string;
  avatar: string;
  text: string;
  rating: number;
  lang: string;
}

interface Plan {
  name: string;
  price: string;
  period: string;
  highlight: boolean;
  badge: string;
  features: string[];
  cta: string;
}

@Component({
  selector: 'app-landing',
  imports: [CommonModule, MatButtonModule, MatIconModule, MatCardModule, MatChipsModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent {
  readonly stats = [
    { value: '500K+', label: 'Usuarios activos' },
    { value: '50+',   label: 'Idiomas disponibles' },
    { value: '10M+',  label: 'Lecciones completadas' },
    { value: '4.9★',  label: 'Valoración media' },
  ];

  readonly features: Feature[] = [
    {
      icon: 'psychology',
      title: 'IA Adaptativa',
      description: 'El motor de IA analiza tu progreso y ajusta las lecciones en tiempo real para maximizar tu aprendizaje.'
    },
    {
      icon: 'record_voice_over',
      title: 'Práctica con Nativos',
      description: 'Conecta con hablantes nativos para sesiones de conversación guiadas y feedback instantáneo.'
    },
    {
      icon: 'emoji_events',
      title: 'Gamificación',
      description: 'Gana puntos, desbloquea logros y compite en rankings globales mientras aprendes de forma divertida.'
    },
    {
      icon: 'offline_bolt',
      title: 'Modo Sin Conexión',
      description: 'Descarga lecciones y practica en cualquier momento y lugar, sin necesidad de internet.'
    },
    {
      icon: 'mic',
      title: 'Reconocimiento de Voz',
      description: 'Tecnología de voz avanzada que analiza tu pronunciación y te guía hacia la fluidez nativa.'
    },
    {
      icon: 'bar_chart',
      title: 'Analítica de Progreso',
      description: 'Dashboards detallados con tus estadísticas, rachas, tiempo invertido y áreas de mejora.'
    },
  ];

  readonly steps = [
    {
      number: '01',
      icon: 'flag',
      title: 'Elige tu idioma',
      description: 'Selecciona entre más de 50 idiomas y dinos tu nivel actual. Glottia crea tu plan personalizado en segundos.'
    },
    {
      number: '02',
      icon: 'school',
      title: 'Completa lecciones',
      description: 'Lecciones de 5 a 15 minutos diseñadas por expertos y potenciadas por IA para que aprendas más rápido.'
    },
    {
      number: '03',
      icon: 'groups',
      title: 'Practica y conecta',
      description: 'Habla con nativos, únete a retos y celebra tus logros con la comunidad global de Glottia.'
    },
  ];

  readonly testimonials: Testimonial[] = [
    {
      name: 'María González',
      role: 'Estudiante de alemán',
      avatar: 'MG',
      text: 'En 6 meses con Glottia llegué a nivel B2 en alemán. Las lecciones adaptativas son increíbles, siente que la app te conoce.',
      rating: 5,
      lang: '🇩🇪 Alemán'
    },
    {
      name: 'Carlos Ramírez',
      role: 'Profesional de negocios',
      avatar: 'CR',
      text: 'Necesitaba mejorar mi inglés de negocios rápido. Glottia me dio exactamente el vocabulario que uso en mi trabajo diario.',
      rating: 5,
      lang: '🇺🇸 Inglés'
    },
    {
      name: 'Ana Martínez',
      role: 'Viajera frecuente',
      avatar: 'AM',
      text: 'Aprendí japones básico en 3 meses antes de mi viaje a Tokio. La gente quedó impresionada con mi pronunciación.',
      rating: 5,
      lang: '🇯🇵 Japonés'
    },
  ];

  readonly plans: Plan[] = [
    {
      name: 'Gratis',
      price: '$0',
      period: 'para siempre',
      highlight: false,
      badge: '',
      cta: 'Empezar gratis',
      features: [
        '5 lecciones diarias',
        '3 idiomas disponibles',
        'Gamificación básica',
        'Comunidad limitada',
      ]
    },
    {
      name: 'Pro',
      price: '$9.99',
      period: 'por mes',
      highlight: true,
      badge: 'Más popular',
      cta: 'Empezar prueba gratis',
      features: [
        'Lecciones ilimitadas',
        '50+ idiomas disponibles',
        'IA adaptativa completa',
        'Práctica con nativos',
        'Modo sin conexión',
        'Analítica avanzada',
      ]
    },
    {
      name: 'Familiar',
      price: '$19.99',
      period: 'por mes',
      highlight: false,
      badge: '',
      cta: 'Empezar prueba gratis',
      features: [
        'Todo lo de Pro',
        'Hasta 6 miembros',
        'Panel familiar',
        'Soporte prioritario',
      ]
    },
  ];

  readonly languages = ['🇬🇧 Inglés', '🇫🇷 Francés', '🇩🇪 Alemán', '🇯🇵 Japonés', '🇮🇹 Italiano', '🇵🇹 Portugués', '🇰🇷 Coreano', '🇨🇳 Chino', '🇷🇺 Ruso', '🇦🇪 Árabe'];

  getStars(count: number): number[] {
    return Array(count).fill(0);
  }
}